import { Injectable } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Injectable({ providedIn: 'root' })
export class TreeNodeExpansionService {

  /**
   * Expands a node and all its ancestors up to the root, based on a node's ID.
   *
   * @param treeData - The full tree structure.
   * @param targetId - The ID of the node to expand.
   * @returns True if the node and its ancestors were successfully expanded, false if not found.
   */
  expandNodeById(treeData: TreeNode[], targetId: string): boolean {
    const path = this.findPathToNode(treeData, targetId);
    if (!path) return false; // ❌ Node not found in the tree.

    // Expand all ancestor nodes (excluding the target node itself)
    for (const ancestor of path.slice(0, -1)) {
      ancestor.isExpanded = true;
    }
    return true; // 🎯 Node and ancestors expanded successfully.
  }

  /**
   * Collapses a node based on its ID.
   *
   * @param treeData - The full tree structure.
   * @param targetId - The ID of the node to collapse.
   * @returns True if the node was successfully collapsed, false if not found.
   */
  collapseNodeById(treeData: TreeNode[], targetId: string): boolean {
    const node = this.findNodeById(treeData, targetId);
    if (node) {
      node.isExpanded = false;
      return true; // ✅ Node collapsed successfully.
    }
    return false; // ❌ Node not found.
  }

  /**
   * Recursively finds a path from the root to a node with a given ID.
   *
   * @param currentNodes - The current level of nodes to search.
   * @param targetId - The ID of the node we are searching for.
   * @param pathSoFar - Accumulates the path of ancestor nodes.
   * @returns The full path to the target node, or null if not found.
   */
  private findPathToNode(currentNodes: TreeNode[], targetId: string, pathSoFar: TreeNode[] = []): TreeNode[] | null {
    for (const currentNode of currentNodes) {
      const updatedPath = [...pathSoFar, currentNode];

      if (currentNode.id === targetId) {
        return updatedPath; // 🎯 Target node found, return the path.
      }

      if (currentNode.children) {
        const result = this.findPathToNode(currentNode.children, targetId, updatedPath);
        if (result) return result; // 🚪 Node found in child branch.
      }
    }

    return null; // ❌ Node not found in this branch.
  }

  /**
   * Recursively finds a node by its ID.
   *
   * @param nodes - The current level of nodes to search.
   * @param targetId - The ID of the node we are searching for.
   * @returns The node if found, or null if not found.
   */
  private findNodeById(nodes: TreeNode[], targetId: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node; // 🎯 Node found.
      }

      if (node.children) {
        const found = this.findNodeById(node.children, targetId);
        if (found) return found; // 🚪 Node found in child branch.
      }
    }

    return null; // ❌ Node not found.
  }
}
