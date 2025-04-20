import {Component, OnInit, viewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TreeNode, TreeViewComponent} from "ng-tree-lib";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TreeViewComponent, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  treeComponent = viewChild.required<TreeViewComponent>(TreeViewComponent);
  filterValue: string = "";

  generateDataItem(id: number) {
    return {
      id: `${id}`,
      label: `Root Node ${id}`,
      isExpanded: true,
      hasChildren: true,
      metadata: {description: 'This is the root node'},
      children: [
        {
          id: `${id}.1`,
          label: `Child Node ${id}.1`,
          isExpanded: false,
          hasChildren: true,
          metadata: {description: `This is a child node under Root Node ${id}`},
          children: [
            {
              id: `${id}.1.1`,
              label: `Child Node ${id}.1.1`,
              isExpanded: false,
              hasChildren: false,
              metadata: {description: `Leaf node under Child Node ${id}.1`}
            },
            {
              id: `${id}.1.2`,
              label: `Child Node ${id}.1.2`,
              isExpanded: false,
              hasChildren: false,
              metadata: {description: `Another leaf node under Child Node ${id}.1`}
            }
          ]
        },
        {
          id: `${id}.2`,
          label: `Child Node ${id}.2`,
          isExpanded: false,
          hasChildren: false,
          metadata: {description: `This is a leaf node under Root Node ${id}`}
        }
      ]
    }
  }


  data: TreeNode[] = [...Array(10000).keys()].map((item) => {
    return this.generateDataItem(item)
  })
  ngOnInit(){
    //console.log(this.data)
    console.log(this.data.length);
  }
  filter(){
    console.log("filtering")
    this.treeComponent().filter(node => node.label.includes(this.filterValue))
  }

}
