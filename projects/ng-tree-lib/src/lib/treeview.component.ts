import {Component, Input, TemplateRef, OnInit, inject} from '@angular/core';
import { TreeNode, FlatTreeNode } from './models/tree-node.model';
import { TreeFlattenerService } from './services/tree-flattener.service';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NgTemplateOutlet} from "@angular/common";
import {TreeFilterService} from "./services/tree-filter.service";

@Component({
  selector: 'ng-treeview',
  templateUrl: './treeview.component.html',
  standalone: true,
  imports: [ScrollingModule, NgTemplateOutlet],
  styleUrls: ['./treeview.component.css']
})
export class TreeViewComponent implements OnInit {
  @Input() treeData: TreeNode[] = [];
  @Input() nodeTemplate!: TemplateRef<any>;

  private treeFlattener = inject(TreeFlattenerService);
  private treeFilter = inject(TreeFilterService);

  flatNodes: FlatTreeNode[] = [];

  constructor() {}

  ngOnInit() {
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
  }
  filter(filterFn: (node: TreeNode) => boolean) {
    const visibleNodeIds = this.treeFilter.filterNodes(this.treeData, filterFn);
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData, 0, true, visibleNodeIds)
  }
  toggleNode(node: TreeNode) {
    node.isExpanded = !node.isExpanded;
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
  }

  trackByNode = (_: number, flatNode: FlatTreeNode) => flatNode.node.id;
}
