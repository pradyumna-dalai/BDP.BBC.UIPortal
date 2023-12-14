import { Component,OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
// import { MasterTableService } from '.';
// import { MasterTableService } from '../../../../';
import { MasterTableService } from '../../../../services/master-table.service';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  date: Date | undefined;
  activeIndex: number = 0;
  myForm: FormGroup;
  projectStatusOptions = [];
  region = [];
  // files1: TreeNode[];

  constructor(private breadcrumbService: AppBreadcrumbService,private fb: FormBuilder,public MasterTableservice: MasterTableService) {
    this.breadcrumbService.setItems([
      {
        label: 'PROJECT',
        routerLink: 'project'
      },
      { label: 'Create Project' },
    ]);
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      // Define your form controls here
      companyName: ['', Validators.required],
      customerCode: ['', Validators.required],
      opportunityName: ['', [Validators.required, Validators.email]],
      industryVertical: ['', Validators.required],
      region: ['', Validators.required],
      projectName: ['', Validators.required],
      projectStage: ['', Validators.required],
      projectStatus: ['', Validators.required],
      opportunityManger: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      designNotes: ['', Validators.required],
      impleNotes: ['', Validators.required],
      // Add more fields as needed
      
    });
    this.getProjectStatus();
    this.getRegion();
  
  
  }

   // ---------------get project status------------------------//
   getProjectStatus() {
     this.projectStatusOptions = [];
    this.MasterTableservice.getProjectStatus().subscribe((res: any) => {
      if (res?.message == "success") {
        this.projectStatusOptions = res?.data;
      } else {
        this.projectStatusOptions = [];
      }
    })
  }
   // ---------------get project status------------------------//
   getRegion() {
    this.region = [];
   this.MasterTableservice.getRegion().subscribe((res: any) => {
     if (res?.message == "success") {
       this.region = res?.data;
     } else {
       this.region = [];
     }
   })
 }

//  files1 = [
//     {
//       "key": "0",
//       "label": "BB1",
//       "data": "Documents Folder",
//       "icon": "pi pi-fw pi-inbox",
//       "children": [
//         {
//           "key": "0-0",
//           "label": "step-1",
//           "data": "Work Folder",
//           "icon": "pi pi-fw pi-cog",
//           "children": [
//             {
//               "key": "0-0-0",
//               "label": "EDI",
//               "icon": "pi pi-fw pi-file",
//               "data": "Expenses Document",
//               "children": [
//                 {
//                   "key": "0-0-0-0",
//                   "label": "India",
//                   "data": "Work Folder",
//                   "icon": "pi pi-fw pi-cog"
//                 },
//                 {
//                   "key": "0-0-0-1",
//                   "label": "Singapore",
//                   "data": "Work Folder",
//                   "icon": "pi pi-fw pi-cog"
//                 },
//                 {
//                   "key": "0-0-0-2",
//                   "label": "China",
//                   "data": "Work Folder",
//                   "icon": "pi pi-fw pi-cog"
//                 }
//               ]
//             },
//             {
//               "key": "0-0-1",
//               "label": "Manual",
//               "icon": "pi pi-fw pi-file",
//               "data": "Resume Document",
//               "children": [
//                 {
//                   "key": "0-0-1-0",
//                   "label": "step-1",
//                   "data": "Work Folder",
//                   "icon": "pi pi-fw pi-cog"
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           "key": "0-0",
//           "label": "step-2",
//           "data": "Work Folder",
//           "icon": "pi pi-fw pi-cog",
//           "children": [
//             { "key": "0-0-0", "label": "Expenses.doc", "icon": "pi pi-fw pi-file", "data": "Expenses Document" },
//             { "key": "0-0-1", "label": "Resume.doc", "icon": "pi pi-fw pi-file", "data": "Resume Document" }
//           ]
//         },
//         {
//           "key": "0-0",
//           "label": "step-3",
//           "data": "Work Folder",
//           "icon": "pi pi-fw pi-cog",
//           "children": [
//             { "key": "0-0-0", "label": "Expenses.doc", "icon": "pi pi-fw pi-file", "data": "Expenses Document" },
//             { "key": "0-0-1", "label": "Resume.doc", "icon": "pi pi-fw pi-file", "data": "Resume Document" }
//           ]
//         },
//         {
//           "key": "0-1",
//           "label": "step-4",
//           "data": "Home Folder",
//           "icon": "pi pi-fw pi-home",
//           "children": [
//             { "key": "0-1-0", "label": "Invoices.txt", "icon": "pi pi-fw pi-file", "data": "Invoices for this month" }
//           ]
//         }
//       ]
//     }
//   ];

 
// selectedFiles1: any[] = [];

}
