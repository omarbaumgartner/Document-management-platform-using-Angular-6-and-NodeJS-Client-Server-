import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import { DocsService } from 'src/app/services/docs/docs.service';


interface FoodNode {
  name: string;
  fileurl: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Root',
    fileurl: 'folder',

    children: [
      {
        name: 'Directive.pdf',
        fileurl: 'http://www.africau.edu/images/default/sample.pdf'
      },
      {
        name: 'MyWork.pdf',
        fileurl: 'http://www.pdfpdf.com/samples/Sample1.PDF'
      },

      {
        name: 'Agency infos.pdf',
        fileurl: 'http://www.pdfpdf.com/samples/Sample2.PDF'
      },
    ]
  }, {
    name: 'Bigger Folder',
    fileurl: 'folder',
    children: [
      {
        name: 'Folder',
        fileurl: 'folder',
        children: [
          {
            name: 'Dock Corp.pdf',
            fileurl: 'http://www.pdfpdf.com/samples/Sample4.PDF'
          },
          {
            name: 'Contracts.pdf',
            fileurl: 'http://www.pdfpdf.com/samples/Sample3.PDF'
          },
        ]
      }, {
        name: 'Folder',
        fileurl: ' folder',
        children: [
          {
            name: 'Property Infos.pdf',
            fileurl: 'http://www.pdfpdf.com/samples/Sample5.PDF'
          },
          {
            name: 'Fiscality.pdf',
            fileurl: 'http://www.pdfpdf.com/samples/xlsdemo1.pdf'
          },
        ]
      },
    ]
  },
];

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
export class DocsComponent {

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      fileurl: node.fileurl,
      level: level,
    };
  }
  isopened: boolean;
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  controllerSrc: any;
  srcfile: string;
  mytree: string[];



  constructor(private sanitizer: DomSanitizer, private docsService: DocsService) {
    this.dataSource.data = TREE_DATA;
    this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl("");
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  fileclick(url: string) {
    this.srcfile = 'https://docs.google.com/viewer?url=' + url + '&embedded=true';
    this.controllerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcfile);
  }

  ngOnit() {


  }

  testbutton() {
    this.docsService.organize();
  }

}





