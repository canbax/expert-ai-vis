import { Component, HostListener, OnInit } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from './helper';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

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
    this.cy = cytoscape({
      // style: GENERAL_CY_STYLE,
      container: document.getElementById('cy'),
      wheelSensitivity: 0.1,
    });
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
    if (this.isFullDocAnalysis) {
      this._api.analyzeFull(this.txt2Analyze, this.token).then(async (v) => {
        this.isLoading = false;
        if (v.ok) {
          this.apiResponse = this.json2Tree(JSON.parse(await v.text()), false);
        } else {
          this._errLogger('Status: ' + v.status);
        }
      }, this._errLogger).catch(this._errLogger);
    }
  }

  isPrimitiveType(o: any): boolean {
    const t = typeof o;
    return t == 'string' || t == 'number' || t == 'boolean';
  }

  json2Tree(o: any, root: TreeNode | false): TreeNode {
    if (!root) {
      root = { name: 'Response', children: [] };
    }

    if (this.isPrimitiveType(o)) {
      root.children?.push({ name: o });
      return root;
    }

    for (const k in o) {
      const newNode = { name: k, children: [] };
      root.children?.push(newNode);
      this.json2Tree(o[k], newNode);
    }

    return root;
  }

  tree2CyGraph(root: TreeNode) {
    if (root.children && root.children.length == 1) {
      // this.cy.add({ data: { name: root.children[0].name } })
    }
  }
}
