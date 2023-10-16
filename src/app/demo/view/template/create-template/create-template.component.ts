import { Component } from '@angular/core';
import {MessageService} from 'primeng/api';
import {NodeService} from '../../../service/nodeservice';
import {TreeNode} from 'primeng/api';
import {AppBreadcrumbService} from '../../../../app.breadcrumb.service';

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss'],
  providers: [MessageService]
})

export class CreateTemplateComponent {
  genInfoflag:boolean = false;
  files1: TreeNode[];

  files2: TreeNode[];

  files3: TreeNode[];

  selectedFiles1: TreeNode;

  selectedFiles2: TreeNode[];

  selectedFiles3: TreeNode;

  cols: any[];
  constructor(private breadcrumbService: AppBreadcrumbService,private messageService: MessageService,private nodeService: NodeService) {
    this.breadcrumbService.setItems([
        {label: 'Template'},
        {label: 'Create Template'},
    ]);
}
onBasicUpload(event) {
  this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
}
ngOnInit(){
  {
    this.nodeService.getFiles().then(files => this.files1 = files);
    this.nodeService.getFilesystem().then(files => this.files2 = files);
    this.nodeService.getFiles().then(files => {
        this.files3 = [{
            label: 'Root',
            children: files
        }];
    });

    this.cols = [
        { field: 'name', header: 'Name' },
        { field: 'size', header: 'Size' },
        { field: 'type', header: 'Type' }
    ];
}
}


}
