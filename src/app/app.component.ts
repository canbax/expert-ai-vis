import { Component, HostListener, OnInit } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CyNode, CY_STYLE, EXPAND_COLLAPSE_FAST_OPT, getFcoseOptions, TreeNode } from './helper';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import expandCollapse from 'cytoscape-expand-collapse';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'expert-ai-vis';
  isStartNavOpen = true;
  isEndNavOpen = true;
  isAutoSizeSideNav = false;
  token: string = '';
  isErrFromToken = false;
  private _errLogger = (err: any) => { console.log('err: ', err); this.isLoading = false; this.showSnackbar(err, 'Error!'); }
  tokenForm: FormGroup;
  promptAuth = 'Enter your username and password'
  isFullDocAnalysis = false;
  txt2Analyze = '';
  apiResponse: TreeNode | null = null;
  isLoading = false;
  cy: any;
  expandCollapseApi: any;
  isRandomizedLayout: boolean = true;
  viewUtils: any;
  apiFunctions = [
    { link: 'v2/analyze/standard/en', text: 'Full' },
    { link: 'v2/analyze/standard/en/disambiguation', text: 'Disambiguation' },
    { link: 'v2/analyze/standard/en/entities', text: 'Entities' },
    { link: 'v2/analyze/standard/en/relevants', text: 'Relevants' },
    { link: 'v2/analyze/standard/en/relations', text: 'Relations' },
    { link: 'v2/analyze/standard/en/sentiment', text: 'Sentiment' },
    { link: 'v2/categorize/iptc/en', text: 'IPTC' },
    { link: 'v2/categorize/geotax/en', text: 'GeoTax' }
  ];
  currEndPoint = '';

  constructor(private fb: FormBuilder, private _api: ApiClientService, private _snackBar: MatSnackBar) {
    this.tokenForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      token: ['']
    });

    this.checkSavedToken();
    this.checkSavedText2Analyze();
  }

  ngOnInit(): void {

  }

  private initCy() {
    cytoscape.use(fcose);
    cytoscape.use(dagre);
    cytoscape.use(klay);
    //register expand-collapse extension
    expandCollapse(cytoscape);
    this.cy = cytoscape({
      // style: GENERAL_CY_STYLE,
      container: document.getElementById('cy'),
      wheelSensitivity: 0.1,
      style: CY_STYLE,
      layout: getFcoseOptions()
    });
    this.bindExpandCollapseExt();
    (window as any)['cy'] = this.cy;
  }

  private showSnackbar(txt: string, title: string) {
    this._snackBar.open(txt, title, { duration: 3000 });
  }

  private checkSavedToken() {
    const t = localStorage.getItem('expert_ai_vis_token');
    if (t) {
      this.promptAuth = 'Already have a token!';
      this.token = t;
    }
  }

  private saveToken() {
    localStorage.setItem('expert_ai_vis_token', this.token);
  }

  private saveText2Query() {
    localStorage.setItem('expert_ai_vis_text2analyze', this.txt2Analyze);
  }

  private checkSavedText2Analyze() {
    const t = localStorage.getItem('expert_ai_vis_text2analyze');
    if (t) {
      this.txt2Analyze = t;
    }
  }

  getToken() {
    const u = this.tokenForm.get('username')?.value;
    const p = this.tokenForm.get('password')?.value;
    this.isLoading = true;
    this._api.token(u, p).then(async (v) => {
      this.isLoading = false;
      if (v.ok) {
        this.isErrFromToken = false;
        this.token = await v.text();
        this.saveToken();
        this.checkSavedToken();
      } else {
        this.isErrFromToken = true;
        this._errLogger('Status: ' + v.status);
      }

    }, (e) => { this.isErrFromToken = true; this._errLogger(e); }).catch(this._errLogger);
  }

  queryApi() {
    this.isLoading = true;
    this.apiResponse = null;
    this.saveText2Query();
    this._api.callEndpoint(this.currEndPoint, this.txt2Analyze, this.token).then(async (v) => {
      this.isLoading = false;
      if (v.ok) {
        this.apiResponse = this.json2Tree(JSON.parse(await v.text()), false);
        // this.tree2CyGraphWithCompounds(this.apiResponse);
        // this.tree2CyGraphWithEdges(this.apiResponse);
        // const opt = getFcoseOptions();
        // opt.name = 'dagre';
        // this.cy.layout(opt).run();
      } else {
        this._errLogger('Status: ' + v.status);
      }
    }, this._errLogger).catch(this._errLogger);
  }

  isPrimitiveType(o: any): boolean {
    const t = typeof o;
    return t == 'string' || t == 'number' || t == 'boolean';
  }

  json2Tree(o: any, root: TreeNode | false): TreeNode {
    if (!root) {
      root = { name: this.currEndPoint, children: [] };
    }

    if (this.isPrimitiveType(o)) {
      root.children?.push({ name: o, parent: root });
      return root;
    }

    for (const k in o) {
      const newNode = { name: k, children: [], parent: root };
      root.children?.push(newNode);
      this.json2Tree(o[k], newNode);
    }

    return root;
  }

  tree2CyGraphWithCompounds(root: TreeNode, parent?: any) {
    if (!root) {
      return;
    }
    const p = parent ? parent.id() : null;
    const n: CyNode = { data: { name: root.name, parent: p }, group: 'nodes' };
    const cyEl = this.cy.add(n);
    if (!root.children) {
      return;
    }
    for (const ch of root.children) {
      this.tree2CyGraphWithCompounds(ch, cyEl);
    }
  }

  tree2CyGraphWithEdges(root: TreeNode, parent?: any) {
    if (!root) {
      return;
    }
    const p = parent ? parent.id() : null;
    const n: CyNode = { data: { name: root.name }, group: 'nodes' };
    const cyEl = this.cy.add(n);
    if (p) {
      this.cy.add({ data: { source: p, target: cyEl.id() }, group: 'edges' });
    }
    if (!root.children) {
      return;
    }
    for (const ch of root.children) {
      this.tree2CyGraphWithEdges(ch, cyEl);
    }
  }

  treeStateChanged(p: { isShow: boolean, node: TreeNode }) {
    let path: string[] = [];
    let curr = p.node;
    while (curr) {
      path.push(curr.name);
      curr = curr.parent;
    }
    console.log('path : ', path);

    // this.syncGraphFromTree(path, p.isShow);
  }

  syncGraphFromTree(path: string[], isShow: boolean) {
    let curr = this.cy.nodes('[!parent]');
    for (let i = path.length - 2; i > -1; i--) {
      curr = curr.children(`[name='${path[i]}']`);
    }
    if (isShow) {
      this.expandCollapseApi.expand(curr, EXPAND_COLLAPSE_FAST_OPT);
    } else {
      this.expandCollapseApi.collapse(curr, EXPAND_COLLAPSE_FAST_OPT);
    }

  }

  private bindExpandCollapseExt() {
    const layout = getFcoseOptions();
    layout.randomize = false;
    this.expandCollapseApi = this.cy.expandCollapse({
      layoutBy: layout,
      // recommended usage: use cose-bilkent layout with randomize: false to preserve mental map upon expand/collapse
      fisheye: false, // whether to perform fisheye view after expand/collapse you can specify a function too
      animate: true, // whether to animate on drawing changes you can specify a function too
      ready: function () { }, // callback when expand/collapse initialized
      undoable: false, // and if undoRedoExtension exists,
      randomize: false,

      cueEnabled: true, // Whether cues are enabled
      expandCollapseCuePosition: 'top-left',
      expandCollapseCueSize: 12, // size of expand-collapse cue
      expandCollapseCueLineSize: 8, // size of lines used for drawing plus-minus icons
      expandCueImage: undefined, // image of expand icon if undefined draw regular expand cue
      collapseCueImage: undefined, // image of collapse icon if undefined draw regular collapse cue
      expandCollapseCueSensitivity: 1, // sensitivity of expand-collapse cues
      allowNestedEdgeCollapse: false
    });
  }
}
