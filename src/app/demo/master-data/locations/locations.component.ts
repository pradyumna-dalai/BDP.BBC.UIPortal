import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { MessageService } from 'primeng/api';
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
  
  constructor(private datePipe: DatePipe, private breadcrumbService: AppBreadcrumbService, 
    private messageService: MessageService,private fb: FormBuilder,
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService,private masterTableService:MasterTableService ) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Location' }
    ]);

    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      region: ['', Validators.required],
      country: ['xx', Validators.required], 
      countryCode: ['33', Validators.required],
      locationCode: ['', Validators.required],
      description: ['', Validators.required],
      status: ['inactive', Validators.required],
       // Assuming '1' for Active and '0' for Inactive
    });
  }

  ngOnInit() {
    this.fetchAllLocationDetails();
    this.fetchLocationRegion();

  }


  confirm(action: string, itemId?: string): void {
    let confirmationMessage: string;
    let header: string;

    if (action === 'edit') {
      confirmationMessage = 'Are you sure that you want to edit this Location?';
      header = 'EditLocation';
    } else if (action === 'delete') {
      confirmationMessage = 'Are you sure that you want to delete this Location?';
      header = 'Delete Location';
    }

    this.confirmationHeader = header;
    this.confirmationService.confirm({
      message: confirmationMessage,
      accept: () => {
        if (action === 'copy') {
          //   this.router.navigateByUrl('/create-location');
        } else if (action === 'delete') {
          this.rowDisabledState[itemId] = true;
        }
      },
      header: this.confirmationHeader,
    });
  }



  fetchAllLocationDetails() {
    this.masterDataService.getAllLocationDetails().subscribe((res: any) => {
      if (res?.message == "success") {
        this.locationdetails = res.data.location.map((item: any) => {
          return {
            loc_name: item.name,
            region: item.region,
            country: item.country,
            country_code: item.countryCode,
            description: item.description,
            location_code: item.locationCode,
            status: item.status,
            id: item.id 

          };
        });
       // console.log("djdsf",this.locationdetails);
      } else {
        this.locationdetails = [];
      }
    });
  }


//----------------------------Delete location--------------------------------------//

confirmDelete(locationId: number): void {
  this.confirmationHeader = 'Delete Location';
  this.confirmationService.confirm({
    message: 'Are you sure that you want to delete this Location?',
    accept: () => {
      this.deleteLocation(locationId);
    },
    header: this.confirmationHeader,
  });
}

deleteLocation(locationId: number): void {
  console.log('Deleting location with ID:', locationId);
  this.masterDataService.deleteLocationDetails(locationId).subscribe((response: any) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Location Deleted',
        detail: 'The location has been deleted successfully.'
      });
      this.fetchAllLocationDetails(); 
    },
    (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error Deleting Location',
        detail: 'An error occurred while deleting the location.'
      });
    }
  );
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


addLocationsDetails() {
  if (this.locationForm.valid) {
    const formData = { ...this.locationForm.value };
    formData.status = formData.status ? 'active' : 'inactive';
    this.masterDataService.addLocations(formData).subscribe(
      (response: any) => {
        if (response.message === 'success') {
          this.messageService.add({
            key: 'successToast',
            severity: 'success',
            summary: 'Location Created',
            detail: 'The location has been created successfully.'
          });
          this.fetchAllLocationDetails();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error Creating Location',
            detail: 'An error occurred while creating the location.'
          });
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'API Error',
          detail: 'An error occurred while communicating with the server.'
        });
      }
    );

    this.cancelCreateLocationDialog();
  } else {
    console.log('Form is invalid. Cannot submit.');

    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please complete all required fields.'
    });
  }
}


//-------------------------------end--------------------------------------//
}
