import { Component, OnInit, ViewChild } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import { DocsService } from 'src/app/services/docs/docs.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Doc } from 'src/app/models/Doc.model';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Router } from '@angular/router';
import { ManagerService } from 'src/app/services/manager/manager.service';
import { AuthService } from 'src/app/services/auth/auth.service';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})


export class DocsComponent implements OnInit {

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;

  @ViewChild(ContextMenuComponent) public globalMenu: ContextMenuComponent;


  ngOnInit(): void {

  }

  isopened: boolean;
  docs: Doc[];
  session: any;
  myprojects: any;

  TREE_DATA: FoodNode[] = [];
  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  constructor(private docsService: DocsService,
    private authService: AuthService,
    private managerService: ManagerService,
    public loadingService: LoadingService,
    private router: Router) {
    this.myprojects = ["TEST", "TEST"]
    this.TREE_DATA = [{
      name: 'Root',

      children: [
        {
          "name": 'Directive.pdf',
        },
        {
          name: 'MyWork.pdf',
        },

        {
          name: 'Agency infos.pdf',
        },
      ]
    }, {
      name: 'Bigger Folder',
      children: [
        {
          name: 'Folder',
          children: [
            {
              name: 'Dock Corp.pdf',
            },
            {
              name: 'Contracts.pdf',
            },
          ]
        }, {
          name: 'Folder',
          children: [
            {
              name: 'Property Infos.pdf',
            },
            {
              name: 'Fiscality.pdf',
            },
          ]
        },
      ]
    },
    ];
    this.dataSource.data = this.TREE_DATA;


  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  getDocs() {
    return this.docsService.getDocs()
      .subscribe(
        docs => {
          this.docs = docs;
          this.loadingService.isFinished();
        }
      );
  }

  onRightClick(event) {
    console.log("yes");
  }

  showMessage(message: any) {
    console.log(message);
  }

  getMyProjects() {
    this.session = this.authService.getPayload();
    this.managerService.getUserProjects(this.session).subscribe(
      (val) => {
        this.myprojects = val;
        this.loadingService.isFinished();
      }
    )
  }

  singleProject(id) {
    this.router.navigate(['/myprojects/' + id]);

  }


  testbutton() {
    console.log(this.myprojects);
    //this.docsService.organize();
    //this.tree = this.docsService.obj;
    //console.log("tree", this.tree);
  }
}





