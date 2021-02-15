import { Component, Input, OnInit } from '@angular/core';
import { TreeNode } from '../helper';



const TREE_DATA: TreeNode[] = [
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          { name: 'Broccoli' },
          { name: 'Brussels sprouts' },
        ]
      },
      {
        name: 'Orange',
        children: [
          { name: 'Pumpkins' },
          { name: 'Carrots' },
        ]
      },
      {
        name: 'Bean',
        children: []
      },
    ]
  },
];

@Component({
  selector: 'app-json2-tree',
  templateUrl: './json2-tree.component.html',
  styleUrls: ['./json2-tree.component.scss']
})
export class Json2TreeComponent implements OnInit {

  @Input() root: TreeNode = { name: 'Response', children: [] };
  isShowChildren = true;
  @Input() isLastChild: boolean;
  
  constructor() {
  }

  ngOnInit(): void {
    
  }

  

}
