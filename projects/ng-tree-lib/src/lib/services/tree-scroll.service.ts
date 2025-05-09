import {Injectable} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {TreeNode, FlatTreeNode} from '../models/tree-node.model';

@Injectable({
  providedIn: 'root'
})
export class TreeScrollService {
  private viewport: CdkVirtualScrollViewport | null = null;

  setViewport(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
  }

  scrollToNode(flatNodes: FlatTreeNode[], node: TreeNode) {
    this.scrollTo(flatNodes, f => f.node === node);
  }

  scrollToNodeById(flatNodes: FlatTreeNode[], id: string) {
    this.scrollTo(flatNodes, f => f.node.id === id);
  }
  scrollToIndex(index: number){
    this.viewport?.scrollToIndex(index, 'instant');
  }
  private scrollTo(flatNodes: FlatTreeNode[], predicate: (f: FlatTreeNode) => boolean) {
    const index = flatNodes.filter(node => node.visible).findIndex(predicate);
    this.scrollToIndex(index);

  }
}
