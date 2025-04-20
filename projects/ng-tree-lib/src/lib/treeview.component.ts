import {Component, Input, TemplateRef, OnInit, inject, viewChild} from '@angular/core';
import { TreeNode, FlatTreeNode } from './models/tree-node.model';
import { TreeFlattenerService } from './services/tree-flattener.service';
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {NgTemplateOutlet} from "@angular/common";
import {TreeFilterService} from "./services/tree-filter.service";
import {FilterOutInvisiblePipe} from "./pipes/filter-out-invisible.pipe";
import {TreeScrollService} from "./services/tree-scroll.service";
import {TreeNodeExpansionService} from "./services/tree-node-expansion.service";

@Component({
  selector: 'ng-treeview',
  templateUrl: './treeview.component.html',
  standalone: true,
  imports: [ScrollingModule, NgTemplateOutlet, FilterOutInvisiblePipe],
  styleUrls: ['./treeview.component.css']
})
export class TreeViewComponent implements OnInit {
  @Input() treeData: TreeNode[] = [];
  @Input() nodeTemplate!: TemplateRef<any>;

  private treeFlattener = inject(TreeFlattenerService);
  private treeFilter = inject(TreeFilterService);
  private treeScroll = inject(TreeScrollService);
  private treeExpander = inject(TreeNodeExpansionService);
  flatNodes: FlatTreeNode[] = [];

  viewport = viewChild.required<CdkVirtualScrollViewport>(CdkVirtualScrollViewport);

  constructor() {}

  ngOnInit() {
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
    console.log(this.flatNodes.length);
    this.treeScroll.setViewport(this.viewport());
  }

  private ensureNodeVisibleAndScroll(
    findPredicate: (node: FlatTreeNode) => boolean,
    scrollFn: () => void
  ) {
    const node = this.flatNodes.find(findPredicate);
    if (!node) {
      console.warn("Node not found.");
      return;
    }

    if (!node.visible) {
      this.treeExpander.expandNodeById(this.treeData, node.node.id);
      this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
    }

    scrollFn();
  }

  scrollTo(node: TreeNode) {
    this.ensureNodeVisibleAndScroll(
      f => f.node === node,
      () => this.treeScroll.scrollToNode(this.flatNodes, node)
    );
  }

  scrollToIndex(index: string) {
    this.ensureNodeVisibleAndScroll(
      f => f.node.id === index,
      () => this.treeScroll.scrollToNodeById(this.flatNodes, index)
    );
  }

  filter(filterFn: (node: TreeNode) => boolean) {
    const visibleNodeIds = this.treeFilter.filterNodes(this.treeData, filterFn);
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData, 0, true, visibleNodeIds)
  }
  _handleToggleButtonClick(node: TreeNode) {
    node.isExpanded = !node.isExpanded;
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
  }
  expandNode(id: string) {
    const expanded = this.treeExpander.expandNodeById(this.treeData, id);
    if (expanded) {
      this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
    }
  }

  collapseNode(id: string) {
    const collapsed = this.treeExpander.collapseNodeById(this.treeData, id);
    if (collapsed) {
      this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
    }
  }
  trackByNode = (_: number, flatNode: FlatTreeNode) => flatNode.node.id;
}
