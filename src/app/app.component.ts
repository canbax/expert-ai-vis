import { Component, HostListener } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from './helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'expert-ai-vis';
  isStartNavOpen = true;
  isEndNavOpen = true;
  isAutoSizeSideNav = false;
  token: string = '';
  isErrFromToken = false;
  private _errLogger = (err: any) => { console.log('err: ', err); this.showSnackbar(err, 'Error!'); }
  tokenForm: FormGroup;
  promptAuth = 'Enter your username and password'
  isFullDocAnalysis = false;
  txt2Analyze = '';
  apiResponse: TreeNode | null = null;

  constructor(private fb: FormBuilder, private _api: ApiClientService, private _snackBar: MatSnackBar) {
    this.tokenForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      token: ['']
    });

    this.checkSavedToken();
    this.checkSavedText2Analyze();
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
    this._api.token(u, p).then(async (v) => {
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
    this.apiResponse = null;
    this.saveText2Query();
    if (this.isFullDocAnalysis) {
      this._api.analyzeFull(this.txt2Analyze, this.token).then(async (v) => {
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
}
