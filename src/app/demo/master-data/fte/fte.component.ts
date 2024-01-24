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
    this.fetchLocationRegion();
    this.fetchLocationCountry();
    this.fetchLocation();
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
        //  flagClass: `flag-icon flag-icon-${country.iso2.toLowerCase()}`,
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
        //  flagClass: `flag-icon flag-icon-${country.iso2.toLowerCase()}`,
      }));
    } else {
      this.locationOptions = [];
    }
  })
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
