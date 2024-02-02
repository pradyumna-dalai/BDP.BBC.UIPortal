import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
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
  editMode: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = ''; // Initial sort field
  sortOrder: string = 'asc'; // 1 for ascending, -1 for descending
  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;
  modeTitle: string = 'Add';
  searchTimeout: number;
  isSearchClear:boolean =false;
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
      id: [''],
      region : ['',Validators.required],
      country : ['',Validators.required],
      location: ['',Validators.required],
      fte_month: ['',Validators.required],
      ftf_year :[''],
      Work_Time_Year: ['',Validators.required],
      status : ['']
    })


  }

  ngOnInit(){
    this.fetchAllFteDetails();
    this.fetchLocationRegion();
    this.fetchLocationCountry();
    this.fetchLocation();
    this.FteForm = this.fb.group({
      id: [''],
      region : ['',Validators.required],
      country : ['',Validators.required],
      location: ['',Validators.required],
      fte_month: ['',Validators.required],
      ftf_year : [''],
      Work_Time_Year: ['',Validators.required],
      status : ['']
    });
    this.FteForm.get('fte_month').valueChanges.subscribe((value: any) => {
      this.FteForm.patchValue({
        ftf_year: value*13
      })
    });
  }
  
  clear(table: Table) {
    table.clear();
    this.fetchAllFteDetails();
  }

  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  showCreateFteDialog() {
    this.displayCreateFteDialog = true;
    this.FteForm.reset({
      status: 'inactive'
    });
    this.editMode = false;
    this.modeTitle = 'Add';
    
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

fetchAllFteDetails(keyword: string = '') {
  const params = {
    pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
    pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
    sortBy: this.sortField,
    sortDir: this.sortOrder,
    keyword: keyword
  };
  this.masterDataService.getAllFteDetails(params).subscribe((res: any) => {
    if (res?.message === 'success') {
      this.Ftedetails = res.data.fte;
      this.totalRecords = res?.data.totalElements;
    } else {
      // console.error('Failed to fetch Fte details:', res);
    }
  });
} 

clearKeyword(event){
if(event.type === 'click'){
  this.isSearchClear = true;
}

}

onGlobalSearch(keyword: string): void {
  // Clear any existing timeout
  if (this.searchTimeout) {
   clearTimeout(this.searchTimeout);
}

// Set a new timeout to trigger the search after 500 milliseconds (adjust as needed)
this.searchTimeout = setTimeout(() => {
   this.fetchAllFteDetails(keyword);
}, 500);
}


/**@edit function here*/

fteRowData:any;
editDisable:boolean = false;
editFteRow(ftes: any){
this.fteRowData = ftes;

  this.updateLocationDetails()
}
updateLocationDetails() {
  this.editMode = true;
  this.modeTitle = 'Edit';
    this.FteForm.patchValue({
      region: this.fteRowData.region.id,
      country: this.fteRowData.country.id,
      location: this.fteRowData.location.id,
      fte_month: this.fteRowData.monthlyCost,
      ftf_year: this.fteRowData.yearlyCost,
      Work_Time_Year: this.fteRowData.yearlyWorkingMin,
      status: this.fteRowData.status ? 'active' : 'inactive',
    });
    this.displayCreateFteDialog = true;
}

/**@Add_FTE_Data Form*/

  addFteData(){

    if (this.FteForm.valid) {
   const body = { 
        region: {
            id: this.FteForm.value.region
        },
        country: {
            id: this.FteForm.value.country
        },
        location: {
            id: this.FteForm.value.location
        },
        monthlyCost: this.FteForm.value.fte_month,
        yearlyCost:this.FteForm.value.ftf_year,
        yearlyWorkingMin: this.FteForm.value.Work_Time_Year,
        status: this.FteForm.value.status === 'active' ? true : false,
  
    }
    if (this.editMode) {
      this.modeTitle = 'Edit';
      body['id'] = this.fteRowData.id
      this.masterDataService.updateFte(body).subscribe(
        (response) => {
          this.displayCreateFteDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Fte updated successfully!' });
          //   this.createForm();
          this.editMode = false;
          this.fetchAllFteDetails();
        },
        (error) => {
          // console.error(error);

        }
      );
    } else {
      this.modeTitle = 'Add';
      this.masterDataService.addFteDetails(body).subscribe(
        (response) => {
          this.displayCreateFteDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Fte added successfully!' });
          this.totalRecords += 1;
          this.fetchAllFteDetails();
        },
        (error) => {
          if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
            const errorMessage = error.error.data?.join(', ') || 'Error in adding Fte';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding Fte' });
          }
        }
      );
    }

    } else {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Form is invalid!' });
    }


    
   
    this.displayCreateFteDialog = false;
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchAllFteDetails();
  }

  onSort(event: any) {
    const newSortField = event.field;
    const newSortOrder = event.order === 1 ? 'asc' : 'desc';

    if (newSortField !== this.sortField || newSortOrder !== this.sortOrder) {
      this.sortField = newSortField;
      this.sortOrder = newSortOrder;
      this.currentPage = 1;
      this.fetchAllFteDetails();
    }
  }
  downloadExcel(event: Event) {
    event.preventDefault();

    this.masterDataService.downloadFteDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'FTEDetails.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Excel File Downloaded successfully.'
      });
    });
  }

  cancelUpdate() {
    // Reset the form when the "Cancel" button is clicked
    this.FteForm.reset();
    this.displayCreateFteDialog = false;
    this.editMode = false;

  }
  
}
