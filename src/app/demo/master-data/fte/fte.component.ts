import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-fte',
  templateUrl: './fte.component.html',
  styleUrls: ['./fte.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FteComponent {

  FteForm: FormGroup;
  displayCreateFteDialog :boolean =false
  regionOptions:any;
  countryOptions:any;
  locationOptions:any;
  Ftedetails:any;

  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = ''; // Initial sort field
  sortOrder: string = 'asc'; // 1 for ascending, -1 for descending
  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;
  constructor(private breadcrumbService: AppBreadcrumbService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService, private masterTableService: MasterTableService,private fb: FormBuilder,) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'FTE - Full Time Employee' }
    ]);

    /**
     * @FormGroup for FteFrom Group 
     */

    this.FteForm = this.fb.group({
      region : ['',Validators.required],
      country : ['',Validators.required],
      location: ['',Validators.required],
      fte_month: ['',Validators.required],
      ftf_year : ['',Validators.required],
      Work_Time_Year: ['',Validators.required],
      status : ['']
    })



  }

  ngOnInit(){
    this.fetchAllFteDetails();
    this.fetchLocationRegion();
    this.fetchLocationCountry();
    this.fetchLocation();
  }


  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  showCreateFteDialog() {
    this.displayCreateFteDialog = true;
    // this.locationForm.reset({
    //   status: 'inactive'
    // });
    // this.editMode = false;
    // this.modeTitle = 'Add';
    
  }

/**Region get Data */

fetchLocationRegion() {
  this.regionOptions = [];
  this.masterTableService.getRegion().subscribe((res: any) => {
    if (res?.message == "success") {
      this.regionOptions = res?.data;
    } else {
      this.regionOptions = [];
    }
  })
}

/**Contry get */


fetchLocationCountry() {
  this.countryOptions = [];
  this.masterDataService.getAllCountryDetails().subscribe((res: any) => {
    if (res?.message == "success") {
      this.countryOptions = res?.data;
      this.countryOptions = res?.data.map((country: any) => ({
        ...country,
      }));
    } else {
      this.countryOptions = [];
    }
  })
}


fetchLocation() {
  this.locationOptions = [];
  this.masterDataService.getAllLocationDropdown().subscribe((res: any) => {
    if (res?.message == "success") {
      this.locationOptions = res?.data;
      this.locationOptions = res?.data.map((country: any) => ({
        ...country,
      }));
    } else {
      this.locationOptions = [];
    }
  })
}


/**getFTE Details */

fetchAllFteDetails() {
  const params = {
    pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
    pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
    sortBy: this.sortField,
    sortDir: this.sortOrder
  };
  this.masterDataService.getAllFteDetails(params).subscribe((res: any) => {
    if (res?.message === 'success') {
      this.Ftedetails = res.data.fte;
      this.totalRecords = res?.data.totalElements;
      console.log('fetch Fte details:', this.totalRecords);
    } else {
      console.error('Failed to fetch Fte details:', res);
    }
  });
} 




/**@edit function here*/


editFteRow(){
  let rowData:any;
  this.FteForm.patchValue({
    region: rowData.region,
    country: rowData.country,
    location: rowData.location,
    fte_month: rowData.fte_month,
    ftf_year: rowData.ftf_year,
    Work_Time_Year: rowData.Work_Time_Year,
    status: rowData.status
  });
}

  addFteData(){
    console.log(this.FteForm.value)
  }

  onSort(event){
    console.log(event)
  }
  onPageChange(event){
    
  }

  
}
