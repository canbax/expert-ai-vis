import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TreeNode } from '../helper';

@Component({
  selector: 'app-json2-tree',
  templateUrl: './json2-tree.component.html',
  styleUrls: ['./json2-tree.component.scss']
})
export class Json2TreeComponent implements OnInit {

  @Input() root: TreeNode = { name: 'Response', children: [] };
  isShowChildren = true;
  @Input() isLastChild: boolean;
  @Output() onStateChanged = new EventEmitter<{ isShow: boolean, node: TreeNode }>();

  constructor() {
  }

  ngOnInit(): void {

  }

  stateChanged(p: { isShow: boolean, node: TreeNode }) {
    this.onStateChanged.emit(p);
  }



}
