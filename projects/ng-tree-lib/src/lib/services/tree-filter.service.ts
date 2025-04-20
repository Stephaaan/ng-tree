import {Injectable} from '@angular/core';
import {TreeNode} from "../models/tree-node.model";

@Injectable({
  providedIn: 'root'
})
export class TreeFilterService {
  visibleNodeIds = new Set<string>();
  constructor() { }

  filterNodes(tree: TreeNode[], filterFn: (node: TreeNode) => boolean): Set<string> {
    this.visibleNodeIds = new Set<string>();
    for (const node of tree) {
      this.markVisibleAndAncestors(node, [], filterFn);
    }

    return this.visibleNodeIds;
  }
  private markVisibleAndAncestors = (node: TreeNode, ancestors: TreeNode[], filterFn: (node: TreeNode) => boolean) => {
    if (filterFn(node)) {
      this.visibleNodeIds.add(node.id);
      for (const ancestor of ancestors) {
        this.visibleNodeIds.add(ancestor.id);
        ancestor.isExpanded = true; // expand the path so child can be seen
      }
    }

    if (node.children) {
      for (const child of node.children) {
        this.markVisibleAndAncestors(child, [...ancestors, node], filterFn);
      }
    }
  };
}
