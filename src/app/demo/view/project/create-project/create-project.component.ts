import { Component,OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
// import { MasterTableService } from '.';
// import { MasterTableService } from '../../../../';
import { MasterTableService } from '../../../../services/master-table.service';

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

}
