import { Pipe, PipeTransform } from '@angular/core';
import { TreeSelectionService } from '../services/tree-selection.service';
import { TreeNode } from '../models/tree-node.model';

@Pipe({
  name: 'isNodeSelected',
  standalone: true,
  pure: false
})
export class IsNodeSelectedPipe implements PipeTransform {
  constructor(private treeSelectionService: TreeSelectionService) {}

  transform(node: TreeNode): boolean {
    return this.treeSelectionService.isSelected(node.id);
  }
}
