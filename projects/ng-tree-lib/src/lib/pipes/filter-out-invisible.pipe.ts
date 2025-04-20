import { Pipe, PipeTransform } from '@angular/core';
import {FlatTreeNode} from "../models/tree-node.model";

@Pipe({
  name: 'filterOutInvisible',
  standalone: true,
  pure: true
})
export class FilterOutInvisiblePipe implements PipeTransform {

  transform(arr: FlatTreeNode[]): FlatTreeNode[] {
    return arr.filter(node => node.visible);
  }

}
