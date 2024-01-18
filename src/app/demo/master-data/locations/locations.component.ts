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
  sortOrder: number = 1; // 1 for ascending, -1 for descending
  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;


  constructor(private breadcrumbService: AppBreadcrumbService,
    private messageService: MessageService, private fb: FormBuilder,
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService, private masterTableService: MasterTableService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Location' }
    ]);

    this.locationForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      //  countryCode: ['', Validators.required],
      locationCode: ['', Validators.required],
      description: ['', Validators.required],
      status: ['inactive', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchAllLocationDetails();
    this.fetchLocationRegion();
    this.fetchLocationCountry();

  }
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  //--------------------------fetch location-------------------------------//

  fetchAllLocationDetails() {
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder
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

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchAllLocationDetails();
  }
  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order === 1 ? 1 : -1;
    this.currentPage = 1; // Reset to the first page when sorting
    this.fetchAllLocationDetails();
  }

  clear(table: Table) {
    table.clear();
  }
  //---------------------------------end------------------------------------------//

  //--------------------------Create Location--------------------------------------//

  showCreateLocationDialog() {

    this.displayCreateLocationDialog = true;
  }

  cancelCreateLocationDialog() {

    this.displayCreateLocationDialog = false;
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
    this.masterDataService.getAllCountryDetails().subscribe((res: any) => {
      if (res?.message == "success") {
        this.countryOptions = res?.data;
        this.countryOptions = res?.data.map((country: any) => ({
          ...country,
          flagClass: `flag-icon flag-icon-${country.iso2.toLowerCase()}`,
        }));
      } else {
        this.countryOptions = [];
      }
    })
  }
  //--------------------end---------------------------------------//

  addLocationsDetails() {
    if (this.locationForm.valid) {
      const body = {
        id: this.locationForm.get('id').value || '',
        name: this.locationForm.value.name,
        locationCode: this.locationForm.value.locationCode,
        region: this.locationForm.value.region,
        country: {
          id: this.locationForm.value.country
        },
        // country: this.locationForm.value.country,
        description: this.locationForm.value.description,
        status: this.locationForm.value.value.status === 'active' ? true : false,
        isDeleted: false,
      };

      if (this.editMode) {
        body['id'] = this.selectedLocation.id;
        this.masterDataService.updateLocations(body).subscribe(
          (response) => {
            console.log(response);
            this.displayCreateLocationDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location updated successfully!' });
            // this.createForm();
            this.editMode = false;
            this.fetchAllLocationDetails();
          },
          (error) => {
            console.error(error);

          }
        );
      } else {
        this.masterDataService.addLocations(body).subscribe(
          (response) => {
            console.log(response);
            this.displayCreateLocationDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location added successfully!' });
            // this.createForm();
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
    if (this.selectedLocation) {
      this.locationForm.patchValue({
        name: this.selectedLocation.name,
        locationCode: this.selectedLocation.locationCode,
        region: this.selectedLocation.region.name,
        country: this.selectedLocation.country.id,
        description: this.selectedLocation.description,
        status: this.selectedLocation.status ? 'active' : 'inactive',
      });

      this.displayCreateLocationDialog = true;
    }

  }
}