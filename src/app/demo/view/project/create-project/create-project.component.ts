import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { MasterTableService } from '../../../../services/master-table.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import dayjs from 'dayjs';
import { DatePipe } from '@angular/common';
import { EditableRow, Table } from 'primeng/table'; 
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  providers: [MessageService, ConfirmationService, EditableRow]
})


export class CreateProjectComponent implements OnInit {

  date: Date | undefined;
  activeIndex: number = 0;
  myForm: FormGroup;
  projectStatusOptions = [];
  regionOptions = [];
  // companyOptions = [];
  IVOptions = [];
  projectStageOptions = [];
  opportunityManagerOptions = [];
  companyOptions: any[] = [];
  opportunityNameOptions: any[] = [];
  // body//
  projectName:string;
  customerCode: any;
  opportunityName: any;
  companyName: any;
  industryVertical: any;
  region: any;
  projectStage: any;
  projectStatus: any;
  startDate: any;
  endDate: any;
  designNotes: any;
  impleNotes: any;
  opportunityManger: any;
  saveError: string;
  dateRange: any;
  locationOptions: any[] = [];
  originLocations: any[] = [];
  destinationLocations: any[] = [];
  uomOptions: any[];
  selectedLocationForEditing: any;
  products: any[] = [];
  originTableData: any[] = [];
enableOriginLocation: boolean = false;
enableDestinationLocation: boolean = false;
isRowEditMode: boolean[] = [];
 originTableControls: FormArray;
  isAddingRow: boolean;

  constructor(private breadcrumbService: AppBreadcrumbService, 
    private datePipe: DatePipe, private messageService: MessageService,private fb: FormBuilder, public MasterTableservice: MasterTableService, public projectService: ProjectsService) {
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
      companyName: [''],
      customerCode: [''],
      opportunityName: [''],
      industryVertical: [''],
      region: [''],
      projectName: ['', Validators.required],
      projectStage: [''],
      projectStatus: [''],
      opportunityManger: [''],
      selectedDateRange: [''],
      designNotes: ['', [Validators.maxLength(1000)]],
      impleNotes: ['', [Validators.maxLength(1000)]],
      originTable: this.fb.array([])
      

    });
    this.fetchActiveUom();
    this.getRegion();
    this.getCompany();
    this.getProjectStage();
    this.getOpportunityManger();
    this.fetchActiveLocation();
   
    this.originTableControls = this.myForm.get('originTable') as FormArray;
    this.isRowEditMode = new Array(this.originTableControls.length).fill(false);
    
    this.isRowEditMode = new Array(this.originTableControls.length).fill(false);
  }


  // ---------------get Region------------------------//
  getRegion() {
    this.regionOptions = [];
    this.MasterTableservice.getRegion().subscribe((res: any) => {
      if (res?.message == "success") {
        this.regionOptions = res?.data;
      } else {
        this.regionOptions = [];
      }
    })
  }
  // ---------------get Comapany------------------------//
  getCompany() {
    this.companyOptions = [];
    this.MasterTableservice.getCompany().subscribe((res: any) => {
      if (res?.message == "success") {
        this.companyOptions = res?.data;
      } else {
        this.companyOptions = [];
      }
    })

  }
  // ---------------get Opportunity name on company select------------------------//

  onCompanySelect(event) {
    this.IVOptions = [];
    this.opportunityNameOptions = [];
    const selectedCompanyId = event.value;
    this.MasterTableservice.getOpportunityName(selectedCompanyId).subscribe((res: any) => {
      if (res?.message === "success") {
        this.opportunityNameOptions = res?.data;
      } else {
        this.opportunityNameOptions = [];
      }
    });
  }
  // ---------------get Industry Vertical------------------------//
  onOpportunitySelect(event) {
    const selectedOpportunityId = event.value;

    // Assuming your service method to get industry vertical takes the selected opportunity ID
    this.MasterTableservice.getIndustryVertical(selectedOpportunityId).subscribe((res: any) => {
      if (res?.message === "success") {
        this.IVOptions = res?.data;
      } else {
        this.IVOptions = [];
      }
    });
  }
  // ---------------get Project Stage------------------------//
  getProjectStage() {
    this.projectStageOptions = [];
    this.MasterTableservice.getProjectStage().subscribe((res: any) => {
      if (res?.message == "success") {
        this.projectStageOptions = res?.data;
      } else {
        this.projectStageOptions = [];
      }
    })
  }
   // ---------------get project status------------------------//
   OnStageSelectProjectstatus(event) {
   // this.projectStatusOptions = [];
    const selectedStageId = event.value;
    this.MasterTableservice.getProjectStatus(selectedStageId).subscribe((res: any) => {
      if (res?.message == "success") {
        this.projectStatusOptions = res?.data;
      } else {
        this.projectStatusOptions = [];
      }
    })
  }
  // ---------------get Opportunity Manager------------------------//
  getOpportunityManger() {
    this.projectStageOptions = [];
    this.MasterTableservice.getOpportunityManger().subscribe((res: any) => {
      if (res?.message == "success") {
        this.opportunityManagerOptions = res?.data;
      } else {
        this.opportunityManagerOptions = [];
      }
    })
  }

  formatDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }
  //----------------------Save Project as Draft-----------------------//
  SaveAsDraftProjects() {
    var om = this.myForm.get('opportunityManger').value;
    if (om == "" || om == undefined || om == null) {
      var opportunityMangers = []
    } else {
      opportunityMangers = om.map(id => ({ id }))
    }
    this.dateRange = this.myForm.get('selectedDateRange').value;
    let dateRangevalStartDate = this.dateRange.startDate;
    let dateRangevalEndDate = this.dateRange.endDate;
   
const body = {
  description: "",
  projectInformation: {
      customerCode: this.myForm.get('customerCode').value,
      projectName: this.myForm.get('projectName').value,
      startDate: this.formatDate(dateRangevalStartDate),
      endDate: this.formatDate(dateRangevalEndDate),
      designNote: this.myForm.get('designNotes').value,
      implementationNote: this.myForm.get('impleNotes').value,
      company: {
          "id": this.myForm.get('companyName').value,
      },
      opportunityName: {
        "id": this.myForm.get('opportunityName').value,
    },
    industryVertical: {
        "id":this.myForm.get('industryVertical').value,
    },
    region: {
        "id": this.myForm.get('region').value,
    },
    projectStage: {
        "id": this.myForm.get('projectStage').value,
    },
    projectStatus: {
        "id": this.myForm.get('projectStatus').value,
    },
    opportunityManager: opportunityMangers
  }
}
    this.projectService.saveAsDraftProject(body).subscribe(
    (res) => {
      console.log('Draft saved successfully:', res);

      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Project draft is saved Successfully.'
      });
    },
    (error) => {

      if (error.status === 400) {
        // console.log('Bad Request Error:', error);
        if(error.error.data[0] == 'Project name exist'){
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Project Name already exists.'
          });
        }
      }else{
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Failed to save Project draft.'
      });
    }
    }
  
  );
  
}



//-----------------------------location Information-----------------------------//
fetchActiveLocation() {
  this.MasterTableservice.getAllActiveLocation().subscribe((res: any) => {
    if (res?.message === "success") {
      this.locationOptions = res?.data.map((location: any) => ({ id: location.id, name: location.name }));

      this.originLocations = [...this.locationOptions];
      this.destinationLocations = [...this.locationOptions];
    } else {
      this.locationOptions = [];
      this.originLocations = [];
      this.destinationLocations = [];
    }
  });
}
onDestinationLocationChange(event: any) {
  const selectedLocationIds = event.value;
  console.log('fdf2', this.originLocations);

  if (selectedLocationIds && selectedLocationIds.length > 0) {
    this.originLocations = this.locationOptions.filter(loc => !selectedLocationIds.includes(loc.id));
  } else {
    
    this.originLocations = [...this.locationOptions];
  }
}


fetchActiveUom(){
  this.uomOptions = [];
  this.MasterTableservice.getAllActiveUOM().subscribe((res: any) => {
    if (res?.message == "success") {
      this.uomOptions = res?.data;
    } else {
      this.uomOptions = [];
    }
  })
}



onOriginLocationChange(event: any) {
  const selectedLocationIds = event.value;
 // console.log('fdf4', this.destinationLocations);

  if (selectedLocationIds && selectedLocationIds.length > 0) {
    this.destinationLocations = this.locationOptions.filter(loc => !selectedLocationIds.includes(loc.id));
  } else {
   
    this.destinationLocations = [...this.locationOptions];
  }
  while (this.originTableControls.length !== 0) {
    this.originTableControls.removeAt(0);
  }
  selectedLocationIds.forEach((locationId: any) => {
    const newRow = this.fb.group({
      location: [locationId, Validators.required], 
      volume: ['', Validators.required],
      uom: ['']
    });

   this.originTableControls.push(newRow);
   console.log( 't1',this.originTableControls)
  });
}


getLocationName(locationId: any): string {
  const location = this.locationOptions.find(loc => loc.id === locationId);
  return location ? location.name : '';
}

//---------------------------------dummy UI--------------------------------------------//


toggleOriginCheckbox() {
  this.enableOriginLocation = !this.enableOriginLocation;
}
toggleDestinationCheckbox() {
  this.enableDestinationLocation = !this.enableDestinationLocation;
}

removeRowFromOriginTable(index: number) {
  (this.myForm.get('originTable') as FormArray).removeAt(index);
}


onSave(event: Event, product: FormGroup) {
  event.preventDefault();

  const newRowData = {
      location: product.get('location').value,
      volume: product.get('volume').value,
      uom: product.get('uom').value ? product.get('uom').value.name : ''
  };

  this.originTableData.push(newRowData);

  console.log( 't2',this.originTableData)
  const newRow = this.fb.group({
      location: [newRowData.location, Validators.required],
      volume: [newRowData.volume, Validators.required],
      uom: [newRowData.uom]
  });
  console.log('t3', this.originTableControls);
  this.originTableControls.push(newRow);
  console.log('t4:', this.originTableControls);
  this.isAddingRow = false;
  product.reset();

  console.log('t5', this.originTableData);
}



onRowEditCancel(product: FormGroup, rowIndex: number): void {
  console.log('Row Edit Canceled:', product);
}

onDeleteRow(rowIndex: number): void {
  console.log('Deleting Row at index:', rowIndex);
  this.originTableControls.removeAt(rowIndex);
}

addRowToOriginTable(data: any) {
  const newRow = this.fb.group({
    location: [data.location, Validators.required],
    volume: [data.volume, Validators.required],
    uom: [data.uom]
  });

  (this.myForm.get('originTable') as FormArray).push(newRow);
  //this.isAddingRow = true;
}
onAddRowBelow(rowIndex: number) {
  const selectedRow = this.originTableControls.at(rowIndex);

  const newRow = this.fb.group({
    location: [selectedRow.get('location').value, Validators.required],
    volume: ['', Validators.required],
    uom: ['']
  });

  this.isAddingRow = true;
  this.originTableControls.insert(rowIndex + 1, newRow); 
  this.products.splice(rowIndex + 1, 0, {
    id: this.products.length + 1,
    location: selectedRow.get('location').value,
    volume: '',
    uom: '',
    editing: true
  });

  this.originTableControls.controls.forEach((control, index) => {
    if (index === rowIndex + 1) {
      this.isRowEditMode.splice(index, 0, true);
    } else {
    
      this.isRowEditMode[index] = false;
    }
  });
}


onRowEditInit(product: FormGroup, rowIndex: number) {
  this.isRowEditMode[rowIndex] = true;
  this.products[rowIndex] = {
      ...product.value,
      editing: true
  };
}

}
