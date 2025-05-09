import { Injectable } from '@angular/core';
import { FlatTreeNode } from '../models/tree-node.model';
import { Subject } from 'rxjs';
import { debounceTime, filter, scan, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TreeNavigationService {
  private typeahead$ = new Subject<{ key: string, flatNodes: FlatTreeNode[], callback: (id: string) => void }>();

  constructor() {
    this.typeahead$
      .pipe(
        filter(({ key }) => key.length === 1 && /^[a-z0-9]$/i.test(key)),
        scan((acc, { key, flatNodes, callback }) => {
          acc.buffer += key;
          acc.flatNodes = flatNodes;
          acc.callback = callback;
          return acc;
        }, { buffer: '', flatNodes: [] as FlatTreeNode[], callback: (_: string) => {} }),
        debounceTime(300),
        tap(({ buffer, flatNodes, callback }) => this.focusFirstMatchingNode(buffer, flatNodes, callback))
      )
      .subscribe();
  }

  onKeydown(event: KeyboardEvent, flatNodes: FlatTreeNode[], currentIndex: number, focusNode: (id: string) => void, rebuildFlatTree: () => void) {
    const visibleNodes = flatNodes.filter(n => n.visible);
    const currentNode = visibleNodes[currentIndex];

    switch (event.key) {
      case 'ArrowDown': {
        const nextIndex = Math.min(currentIndex + 1, visibleNodes.length - 1);
        focusNode(visibleNodes[nextIndex].node.id);
        break;
      }
      case 'ArrowUp': {
        const prevIndex = Math.max(currentIndex - 1, 0);
        focusNode(visibleNodes[prevIndex].node.id);
        break;
      }
      case 'ArrowRight': {
        if (currentNode.node.hasChildren && !currentNode.node.isExpanded) {
          currentNode.node.isExpanded = true;
          rebuildFlatTree();
        } else {
          const next = visibleNodes[currentIndex + 1]?.level === currentNode.level + 1 ? visibleNodes[currentIndex + 1] : undefined;
          if (next) focusNode(next.node.id);
        }
        break;
      }
      case 'ArrowLeft': {
        if (currentNode.node.hasChildren && currentNode.node.isExpanded) {
          currentNode.node.isExpanded = false;
          rebuildFlatTree();
        } else {
          for (let i = currentIndex - 1; i >= 0; i--) {
            const node = visibleNodes[i];
            if (node.level === currentNode.level - 1) {
              focusNode(node.node.id);
              break;
            }
          }
        }
        break;
      }
      case 'Home': {
        focusNode(visibleNodes[0].node.id);
        break;
      }
      case 'End': {
        focusNode(visibleNodes[visibleNodes.length - 1].node.id);
        break;
      }
      case '*': {
        const currentLevel = currentNode.level;
        visibleNodes.forEach(node => {
          if (node.level === currentLevel && node.node.hasChildren) {
            node.node.isExpanded = true;
          }
        });
        rebuildFlatTree();
        focusNode(currentNode.node.id);
        break;
      }
      default: {
        this.typeahead$.next({ key: event.key.toLowerCase(), flatNodes, callback: focusNode });
      }
    }
  }

  private focusFirstMatchingNode(buffer: string, flatNodes: FlatTreeNode[], focusNode: (id: string) => void) {
    const match = flatNodes.find(n => n.visible && n.node.label.toLowerCase().startsWith(buffer));
    if (match) {
      focusNode(match.node.id);
    }
  }
}
