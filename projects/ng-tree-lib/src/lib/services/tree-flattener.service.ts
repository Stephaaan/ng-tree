import { Injectable } from '@angular/core';
import { TreeNode, FlatTreeNode } from '../models/tree-node.model';

@Injectable({ providedIn: 'root' })
export class TreeFlattenerService {
  flattenTree(
    nodes: TreeNode[],
    level = 0,
    parentExpanded = true,
    visibleNodeIds?: Set<string>
  ): FlatTreeNode[] {
    let result: FlatTreeNode[] = [];

    for (const node of nodes) {
      const visible = parentExpanded && (!visibleNodeIds || visibleNodeIds.has(node.id));
      result.push({ node, level, visible });

      if (node.children && node.children.length > 0) {
        const children = this.flattenTree(
          node.children,
          level + 1,
          visible && !!node.isExpanded,
          visibleNodeIds
        );
        result.push(...children);
      }
    }

    return result;
  }
}
