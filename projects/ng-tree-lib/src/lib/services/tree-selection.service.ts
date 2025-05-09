import { Injectable } from '@angular/core';
import { FlatTreeNode, TreeNode } from '../models/tree-node.model';
import { TreeNodeExpansionService } from './tree-node-expansion.service';

@Injectable({
  providedIn: 'root',
})
export class TreeSelectionService {
  private selectedNodeIds = new Set<string>();

  constructor(private treeNodeExpansionService: TreeNodeExpansionService) {}

  /**
   * Selects a node by ID. Optionally expands the node.
   */
  selectNode(
    flatNodes: FlatTreeNode[],
    treeData: TreeNode[],
    id: string,
    expand = false
  ): TreeNode | null {
    console.log(id)
    const flatNode = flatNodes.find(f => f.node.id === id);
    console.log(flatNode)
    if (!flatNode) return null;

    if (expand && !flatNode.node.isExpanded) {
      this.treeNodeExpansionService.expandNodeById(treeData, id);
    }

    this.selectedNodeIds.add(id);
    return flatNode.node;
  }

  deselectNode(id: string) {
    this.selectedNodeIds.delete(id);
  }

  toggleSelection(
    flatNodes: FlatTreeNode[],
    treeData: TreeNode[],
    id: string,
    expand = false
  ): TreeNode | null {
    if (this.selectedNodeIds.has(id)) {
      this.deselectNode(id);
      return null;
    }
    return this.selectNode(flatNodes, treeData, id, expand);


  }

  isSelected(id: string): boolean {
    return this.selectedNodeIds.has(id);
  }

  getSelectedNodes(flatNodes: FlatTreeNode[]): TreeNode[] {
    return flatNodes
      .filter(f => this.selectedNodeIds.has(f.node.id))
      .map(f => f.node);
  }

  clearSelection() {
    this.selectedNodeIds.clear();
  }

  /**
   * Initialize selection by a list of node IDs.
   * Optionally expands each node before selecting it.
   */
  initializeSelection(
    flatNodes: FlatTreeNode[],
    treeData: TreeNode[],
    ids: string[],
    expand = true
  ){
    for (const id of ids) {
      this.selectNode(flatNodes, treeData, id, expand);
    }
  }
}
