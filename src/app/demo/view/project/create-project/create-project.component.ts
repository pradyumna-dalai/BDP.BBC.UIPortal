import { Component, OnInit, ViewChild } from '@angular/core';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { MasterTableService } from '../../../../services/master-table.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import dayjs from 'dayjs';
import { DatePipe } from '@angular/common';
import { EditableRow, Table } from 'primeng/table';
import { AddVolumeComponent } from './add-volume/add-volume.component';

interface UomData {
  id: number;
  name: string;
}

interface TableRow {
  city: string;
  Volume: string;
  Uom: null;
  editing: boolean;
  adding: boolean;
}
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  providers: [MessageService, ConfirmationService, EditableRow]
})


export class CreateProjectComponent implements OnInit {
  @ViewChild(AddVolumeComponent) addVolume!: AddVolumeComponent;
  date: Date | undefined;
  activeIndex: number = 0;
  myForm: FormGroup;
  projectStatusOptions = [];
  regionOptions = [];
  IVOptions = [];
  projectStageOptions = [];
  opportunityManagerOptions = [];
  companyOptions: any[] = [];
  opportunityNameOptions: any[] = [];
  projectName: string;
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
  selectedLocationForEditing: any;
  products: any[] = [];
  originTableData: any[] = [];
  enableOriginLocation: boolean = false;
  enableDestinationLocation: boolean = false;
  isRowEditMode: boolean[] = [];
  originTableControls: FormArray;
  isAddingRow: boolean;
  isActionButtonsVisible = false;
  selectedFile: any;
  visibleOperationBox: boolean = false;
  fileNameOC: string;
  uomOptions: UomData[] = [];
  tableData: TableRow[] = [];//Destination table data
  selectedCity: any[] = [];
  selectedCities: any[] = [];
  selectedCitiesOrign: any[] = [];
  OtableData: TableRow[] = [];//Orign table data

  enableOriginLocationTab: boolean = false;
  enableDestinationLocationTab: boolean = false;

  selectedLocationIsOrigin: boolean = true;
  activeTabIndex: number = 0; // default to Origin Location


  constructor(private breadcrumbService: AppBreadcrumbService,
    private datePipe: DatePipe, private messageService: MessageService, private fb: FormBuilder, public MasterTableservice: MasterTableService, public projectService: ProjectsService) {
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
      impleNotes: ['', [Validators.maxLength(1000)]]


    });
    this.fetchActiveUom();
    this.getRegion();
    this.getCompany();
    this.getProjectStage();
    this.getOpportunityManger();
    this.fetchActiveLocation();
  }


  getForm(): FormGroup {
    return this.myForm;
  }
  goToNextTab() {
    // this.activeIndex = (this.activeIndex + 1) % 8; 
    console.log(this.myForm.value);
    this.activeIndex = (this.activeIndex + 1) % 8
    // this.addVolume.shareFunctionAddVolume()



  }
  submit() { }
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

    const originProjectLocationData = this.OtableData.map((row: TableRow) => ({
      volume: row.Volume,
      originDestination: 'Origin',
      location: {
        id: this.locationOptions.find(loc => loc.name === row.city)?.id
      },
      uom: {
        id: row.Uom
      }
    }));

    const destinationProjectLocationData = this.tableData.map((row: TableRow) => ({
      volume: row.Volume,
      originDestination: 'Destination',
      location: {
        id: this.locationOptions.find(loc => loc.name === row.city)?.id
      },
      uom: {
        id: row.Uom
      }
    }));
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
          "id": this.myForm.get('industryVertical').value,
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
        opportunityManager: opportunityMangers,
        projectLocation: [...originProjectLocationData, ...destinationProjectLocationData],
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
          if (error.error.data[0] == 'Project name exist') {
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Project Name already exists.'
            });
          }
        } else {
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
  fetchActiveUom() {
    this.uomOptions = [];
    this.MasterTableservice.getAllActiveUOM().subscribe((res: any) => {
      if (res?.message == "success") {
        this.uomOptions = res?.data.map((uom: any) => ({
          id: uom.id,
          name: uom.name
        }));
      } else {
        this.uomOptions = [];
      }
    })
  }

  toggleOriginCheckbox() {
    this.enableOriginLocation = !this.enableOriginLocation;
    // this.enableOriginLocationTab = this.enableOriginLocation;
   // this.selectedLocationIsOrigin = this.enableOriginLocation;
    if (!this.enableOriginLocation) {
      this.selectedCitiesOrign = [];
      this.OtableData = [];
    }
    
  }
  toggleDestinationCheckbox() {
    this.enableDestinationLocation = !this.enableDestinationLocation;
    //  this.enableDestinationLocationTab = this.enableDestinationLocation;
   // this.selectedLocationIsOrigin = !this.enableDestinationLocation;
    if (!this.enableDestinationLocation) {
      this.selectedCities = [];
      this.tableData = [];
    }
  }


  //-----------------------upload doct------------------//
  downloadSampleOpExcel(event: Event) {
    event.preventDefault();
  }
  showDialogOperationCard() {
    this.visibleOperationBox = true;
  }

  onOperarationCancelClick() {
    this.visibleOperationBox = false;
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      console.log('Selected File:', file);
    }
  }

  onUploadClick() {

  }
  onRemoveOperationClick() {
    //  this.showUploaderror = false;
    this.fileNameOC = "";
    // this.uploadFileOC = null;
    this.selectedFile = null;
  }
  showSuccessMessage(message: string) {
    this.messageService.add({ key: 'successToast', severity: 'success', summary: 'Success', detail: message });
  }

  //---end-----------------------------------------------//


  ///------------------------------Orign Location Table------------------//
  onOriginLocationChange(event: any) {
    const selectedLocationIds = event.value;
    if (selectedLocationIds && selectedLocationIds.length > 0) {
      this.isActionButtonsVisible = true;
      this.destinationLocations = this.locationOptions.filter(loc => !selectedLocationIds.includes(loc.id));
    } else {
      this.isActionButtonsVisible = false;
      this.destinationLocations = [...this.locationOptions];
    }
    const selectedCitiesOrign = this.locationOptions
      .filter(loc => selectedLocationIds.includes(loc.id))
      .map(city => ({ name: city.name }));

    selectedCitiesOrign.forEach(city => {
      const existingCity = this.OtableData.find(item => item.city === city.name);
      if (!existingCity) {
        this.OtableData.push({
          city: city.name,
          Volume: '',
          editing: true,
          adding: false,
          Uom: null
        });
      }
    });
  }

  OrignaddRow(rowIndex: number) {
    const newRow = {
      city: this.OtableData[rowIndex].city,
      Volume: '',
      Uom: null,
      editing: true,
      adding: true
    };
    this.OtableData.splice(rowIndex + 1, 0, newRow);

  }
  OrigneditRow(rowIndex: number) {
    this.OtableData[rowIndex].editing = true;
    this.initializeOriginalDataO();
  }
  OrignsaveRow(rowIndex: number) {
    const rowData = this.OtableData[rowIndex];
  if (!rowData.Volume || rowData.Uom === null) {
    this.messageService.add({
      key: 'errorToast',
      severity: 'error',
      summary: 'Error!',
      detail: 'Volume and UOM are required for each row in Origin Location.'
    });
  } else {
    rowData.editing = false;
  }
  }
  OrigndiscardRow(rowIndex: any) {
    if (this.OtableData[rowIndex].adding || this.OtableData[rowIndex].editing) {
      this.OtableData.splice(rowIndex, 1);
    }
  }

  initializeOriginalDataO() {
    this.OtableData.forEach(row => {
    });
  }

  OrigndeleteRow(rowIndex: number) {
    this.OtableData.splice(rowIndex, 1);
  }
  OrigngetUomName(uomId: number): string {
    const selectedUom = this.uomOptions.find(uom => uom.id === uomId);
    return selectedUom ? selectedUom.name : '';
  }
  //-----------------------------------Destination Location Table----------------------------------------------//
  onDestinationLocationChange(event: any) {
    let selectedLocationIds = event.value;
    if (selectedLocationIds && selectedLocationIds.length > 0) {
      this.originLocations = this.locationOptions.filter(loc => !selectedLocationIds.includes(loc.id));
    } else {

      this.originLocations = [...this.locationOptions];
    }
    const selectedCities = this.locationOptions
      .filter(loc => selectedLocationIds.includes(loc.id))
      .map(city => ({ name: city.name }));

    selectedCities.forEach(city => {
      const existingCity = this.tableData.find(item => item.city === city.name);
      if (!existingCity) {
        this.tableData.push({
          city: city.name,
          Volume: '',
          editing: true,
          adding: false,
          Uom: null
        });
      }
    });
  }

  addRow(rowIndex: number) {
    const newRow = {
      city: this.tableData[rowIndex].city,
      Volume: '',
      Uom: null,
      editing: true,
      adding: true
    };
    this.tableData.splice(rowIndex + 1, 0, newRow);
    console.log(this.tableData);
  }
  editRow(rowIndex: number) {
    this.tableData[rowIndex].editing = true;
    this.initializeOriginalData();
  }
  saveRow(rowIndex: number) {
    const rowData = this.tableData[rowIndex];
    if (!rowData.Volume || rowData.Uom === null) {
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Volume and UOM are required for each row in Destination Location.'
      });
    } else {
      rowData.editing = false;
    }
  }
  discardRow(rowIndex: any) {
    if (this.tableData[rowIndex] && (this.tableData[rowIndex].adding || this.tableData[rowIndex].editing)) {
      this.tableData.splice(rowIndex, 1);
    }
  }


  initializeOriginalData() {
    this.tableData.forEach(row => {
    });
  }

  deleteRow(rowIndex: number) {
    this.tableData.splice(rowIndex, 1);
  }
  getUomName(uomId: number): string {
    const selectedUom = this.uomOptions.find(uom => uom.id === uomId);
    return selectedUom ? selectedUom.name : '';
  }
  //-----------------------------destination end----------------------------------//

}

