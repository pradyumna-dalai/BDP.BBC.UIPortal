import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class LocationsComponent {
  text: string = '';
  data: any = {};
  rowDisabledState: { [key: string]: boolean } = {};
  confirmationHeader: string;
  locationdetails: any;
  displayCreateLocationDialog: boolean = false;
  regionOptions: any[];
  locationForm: FormGroup;
  countryOptions: any[];
  editMode: boolean = false;
  selectedLocation: any;
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = ''; // Initial sort field
  sortOrder: string = 'asc'; // 1 for ascending, -1 for descending
  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;
  modeTitle: string = 'Add';
  searchTimeout: number;
  processing: boolean = false;
  regionId:any;

  constructor(private breadcrumbService: AppBreadcrumbService,
    private messageService: MessageService, private fb: FormBuilder,
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService, private masterTableService: MasterTableService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Location' }
    ]);
    // this.createForm();
    this.locationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      //  countryCode: ['', Validators.required],
      locationCode: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
  }

  ngAfterViewInit(): void {

  }
  ngOnInit() {
    this.fetchAllLocationDetails();
    this.fetchLocationRegion();
    // this.fetchLocationCountry();
    // this.createForm();
    this.locationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      //  countryCode: ['', Validators.required],
      locationCode: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
    this.locationForm.get('region').valueChanges.subscribe((value: any) => {
      this.regionId = value;
      if(value){
        this.fetchLocationCountry()
      }
    });
  }
findRegionId(event){
  const region = event.value;
  console.log("regionid",region);
  this.regionId= region;
  this.fetchLocationCountry()
}
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  //--------------------------fetch location-------------------------------//

  fetchAllLocationDetails(keyword: string = ''): void{
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder,
      keyword: keyword // Add the keyword parameter
    };
    this.masterDataService.getAllLocationDetails(params).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.locationdetails = res.data.location;
        this.totalRecords = res?.data.totalElements;
        console.log('fetch location details:', this.totalRecords);
      } else {
        console.error('Failed to fetch Location details:', res);
      }
    });
  }
  onGlobalSearch(keyword: string): void {
    // Clear any existing timeout
    if (this.searchTimeout) {
     clearTimeout(this.searchTimeout);
 }
 
 // Set a new timeout to trigger the search after 500 milliseconds (adjust as needed)
 this.searchTimeout = setTimeout(() => {
     this.fetchAllLocationDetails(keyword);
 }, 500);
 }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchAllLocationDetails();
  }

  onSort(event: any) {
    const newSortField = event.field;
    const newSortOrder = event.order === 1 ? 'asc' : 'desc';

    if (newSortField !== this.sortField || newSortOrder !== this.sortOrder) {
      this.sortField = newSortField;
      this.sortOrder = newSortOrder;
      this.currentPage = 1;
      this.fetchAllLocationDetails();
    }
  }
  clear(table: Table) {
    table.clear();
    this.onSort(Event);
    this.clearSearchInput();
  }

  clearSearchInput(): void {
    // Assuming you have a reference to the input element, you can clear its value
    const searchInput = document.getElementById('gSearch') as HTMLInputElement;
  
    // Or if you are using a framework like Angular, you can use a ViewChild or ngModel to get the reference
  
    if (searchInput) {
      searchInput.value = '';
    }
  }
  //---------------------------------end------------------------------------------//

  //--------------------------Create Location--------------------------------------//

  showCreateLocationDialog() {
    this.displayCreateLocationDialog = true;
    this.locationForm.reset({
      status: 'inactive'
    });
    this.editMode = false;
    this.modeTitle = 'Add';

  }

  saveLocation() {

    this.displayCreateLocationDialog = false;
  }

  //---------------fetch Region and Country---------------------------------//
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

  fetchLocationCountry() {
    this.countryOptions = [];
    this.masterDataService.getAllCountry(this.regionId).subscribe((res: any) => {
      if (res?.message == "success") {
        if(this.editMode){
          this.locationForm.get('country').patchValue(this.selectedLocation.country.id)
        }
        this.countryOptions = res?.data;
        this.countryOptions = res?.data.map((country: any) => ({
          ...country,
          //  flagClass: `flag-icon flag-icon-${country.iso2.toLowerCase()}`,
        }));
      } else {
        this.countryOptions = [];
      }
    })
  }
  //--------------------end---------------------------------------//

  addLocationsDetails() {
    if (this.locationForm.valid) {
      this.processing = false;
      const body = {
        id: this.locationForm.get('id').value || '',
        name: this.locationForm.value.name,
        locationCode: this.locationForm.value.locationCode,
        region: {
          id: this.locationForm.value.region
        },
        country: {
          id: this.locationForm.value.country
        },
        // country: this.locationForm.value.country,
        description: this.locationForm.value.description,
        status: this.locationForm.value.status === 'active' ? true : false,
        isDeleted: false,
      };

      if (this.editMode) {
        this.modeTitle = 'Edit';
        body['id'] = this.selectedLocation.id;
        this.masterDataService.updateLocations(body).subscribe(
          (response) => {
            console.log(response);
            this.displayCreateLocationDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location updated successfully!' });
            //   this.createForm();
            this.editMode = false;
            this.fetchAllLocationDetails();
            this.processing = false; 
          },
          (error) => {
            console.error(error);
            this.processing = false; 
          }
        );
      } else {
        this.modeTitle = 'Add';
        this.masterDataService.addLocations(body).subscribe(
          (response) => {
            console.log(response);
            this.displayCreateLocationDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location added successfully!' });
            this.totalRecords += 1;
            this.fetchAllLocationDetails();
            this.processing = false; 
          },
          (error) => {
            console.error(error);
            if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
              const errorMessage = error.error.data?.join(', ') || 'Error in adding location';
              this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding location' });
            }
          }
        );
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Form is invalid!' });
    }

    //-------------------------------end--------------------------------------//
  }
  //------------------------------UpdateLocation--------------------------------------------//
  editLocation(location: any) {
    this.selectedLocation = location;
    this.updateLocationDetails(location);
  }
  updateLocationDetails(location: any) {
    this.editMode = true;
    this.modeTitle = 'Edit';
    console.log("pathValue_location")
    if (this.selectedLocation) {

      this.locationForm.patchValue({
        name: this.selectedLocation.name,
        locationCode: this.selectedLocation.locationCode,
        region: this.selectedLocation.region.id,
        country: this.selectedLocation.country.id,
        description: this.selectedLocation.description,
        status: this.selectedLocation.status ? 'active' : 'inactive',
      });
      console.log('df', this.locationForm)
      this.displayCreateLocationDialog = true;
    
    }
  }


  //------------------export excel-----------------------------------------------------------//
  downloadExcel(event: Event) {
    event.preventDefault();

    this.masterDataService.downloadLocationDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'LocationDetails.xlsx';
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
    this.locationForm.reset();
    this.displayCreateLocationDialog = false;
    this.editMode = false;

  }
}