import {Component, Input, TemplateRef, OnInit, inject, viewChild, ChangeDetectorRef} from '@angular/core';
import { TreeNode, FlatTreeNode } from './models/tree-node.model';
import { TreeFlattenerService } from './services/tree-flattener.service';
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {NgTemplateOutlet} from "@angular/common";
import {TreeFilterService} from "./services/tree-filter.service";
import {FilterOutInvisiblePipe} from "./pipes/filter-out-invisible.pipe";
import {TreeScrollService} from "./services/tree-scroll.service";
import {TreeNodeExpansionService} from "./services/tree-node-expansion.service";
import {IsNodeSelectedPipe} from "./pipes/is-node-selected.pipe";
import {TreeSelectionService} from "./services/tree-selection.service";
import {TreeNavigationService} from "./services/tree-navigation.service";

@Component({
  selector: 'ng-treeview',
  templateUrl: './treeview.component.html',
  standalone: true,
  imports: [ScrollingModule, NgTemplateOutlet, FilterOutInvisiblePipe, IsNodeSelectedPipe],
  styleUrls: ['./treeview.component.css']
})
export class TreeViewComponent implements OnInit {
  @Input() treeData: TreeNode[] = [];
  @Input() nodeTemplate!: TemplateRef<any>;

  private treeFlattener = inject(TreeFlattenerService);
  private treeFilter = inject(TreeFilterService);
  private treeScroll = inject(TreeScrollService);
  private treeExpander = inject(TreeNodeExpansionService);
  private treeSelector = inject(TreeSelectionService);
  private treeNavigation = inject(TreeNavigationService);

  private changeDetectorRef = inject(ChangeDetectorRef);

  flatNodes: FlatTreeNode[] = [];

  selection = this.treeSelector.getSelectedNodes(this.flatNodes);

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
  selectNode(id: string, expand: false){
    this.treeSelector.selectNode(this.flatNodes, this.treeData, id, expand)
  }
  deselectNode(id: string, expand: false){
    this.treeSelector.deselectNode(id)
  }
  toggleNode(id: string, expand = false){
    this.treeSelector.toggleSelection(this.flatNodes, this.treeData, id, expand);
  }
  initializeSelection(ids: string[], expand = false){
    this.treeSelector.initializeSelection(this.flatNodes, this.treeData, ids, expand);
  }
  _trackByNode = (_: number, flatNode: FlatTreeNode) => flatNode.node.id;
  _handleToggleButtonClick(node: TreeNode) {
    node.isExpanded = !node.isExpanded;
    this.flatNodes = this.treeFlattener.flattenTree(this.treeData);

  }
  _toggleNodeSelection(id: string){
    this.treeSelector.toggleSelection(this.flatNodes, this.treeData, id)
  }
  _handleKeydown(event: KeyboardEvent, index: number) {
    this.treeNavigation.onKeydown(
      event,
      this.flatNodes,
      index,
      (id: string) => this._focusNodeById(id),
      () => {
        this.flatNodes = this.treeFlattener.flattenTree(this.treeData);
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  private _focusNodeById(id: string) {
    const visibleFlatNodes = this.flatNodes.filter(n => n.visible);
    const index = visibleFlatNodes.findIndex(f => f.node.id === id);

    if (index !== -1) {
      this.treeScroll.scrollToIndex(index - 2);
      const element = this.viewport().elementRef.nativeElement.querySelector(`[data-index="${index}"]`);
      (element as HTMLElement)?.focus();
    }
  }


}
