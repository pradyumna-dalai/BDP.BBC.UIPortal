import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
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
  visibleValueBox: boolean = false;
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
  uploadedFiles: {  id: number;name: string, file: File }[] = [];
  selectedFiles: File[] = [];
  uploadedResponseFiles: { name: string, file: File }[] = [];
  uploadedOtherFiles: { name: string, file: File }[] = [];
  projectId: number | null = null;
  visibleResponseBox: boolean = false;
  visibleOthersBox: boolean = false;
  uploadedFilesToSave: {  id: number;name: string; file: File }[] = [];
  uploadedResponseFilesToSave: { name: string; file: File }[] = [];
  uploadedOtherFilesToSave: {id: number | null; name: string; file: File }[] = [];
  constructor(private breadcrumbService: AppBreadcrumbService,private zone: NgZone,
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

  onSaveAsDraftClick()
  {
    this.SaveAsDraftProjects();
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
      id: this.projectId,
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
        const savedProjectId = res.data.id;
        console.log('Draft saved successfully:', savedProjectId);
  
        if (savedProjectId) {
          this.projectId = savedProjectId;
  
        if (this.uploadedFilesToSave.length > 0 && this.projectId !== null) {
          this.uploadFiles();
        }
        if (this.uploadedResponseFilesToSave.length > 0 && this.projectId !== null) {
          this.uploadResponseFiles();
        }
        if (this.uploadedOtherFilesToSave.length > 0 && this.projectId !== null) {
          this.uploadOtherFiles();
        }
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Project draft is saved Successfully.'
        });
      }
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

  //-----------------------------Artifact Upload------------------------------------//
  showDialogValue() {
    this.visibleValueBox = true;
  }

  onValueCancelClick() {
    this.fileNameOC = "";
    this.selectedFiles = [];
    this.selectedFile = null;
    this.visibleValueBox = false;
  }

  onFileSelected(event: any) {
    const newFiles: File[] = Array.from(event.target.files);

    this.selectedFiles = [...this.selectedFiles, ...newFiles];

    if (this.selectedFiles.length > 0) {
      // Display the names of selected files
      this.fileNameOC = this.selectedFiles.map(file => file.name).join(', ');
    } else {
      this.fileNameOC = "";
    }
  }

  onRemoveClick() {
    // this.selectedFiles.splice(index, 1);

    // if (this.selectedFiles.length > 0) {
    //   // Display the names of remaining files
    //   this.fileNameOC = this.selectedFiles.map(file => file.name).join(', ');
    // } else {
    //   this.fileNameOC = "";
    // }
    this.fileNameOC = "";
    this.selectedFiles = [];
    this.selectedFile = null;
  }
  showSuccessMessage(message: string) {
    this.messageService.add({ key: 'successToast', severity: 'success', summary: 'Success', detail: message });
  }

  onUploadClick(): void {
    if (this.selectedFiles.length > 0) {
      this.uploadedFilesToSave = [
        ...this.uploadedFilesToSave,
        ...this.selectedFiles.map(file => ({ id: null, name: file.name, file })),
      ];
      this.selectedFiles = [];
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      this.visibleValueBox = false;
      this.fileNameOC = "";
      console.log('Files added to save:', this.uploadedFilesToSave);
    } else {
      console.log('No file selected.');
    }
  }
  
  uploadFiles(): void {
    const scopeId = 2;
    const entityId = this.projectId;
    for (const file of this.uploadedFilesToSave) {
      this.projectService.UploadProjectArtifact(file.file, scopeId, entityId).subscribe(
        (res: any) => {
          if (res?.status === 200 && res?.message === 'success' && res?.data?.id) {
            file.id = res.data.id;
            this.uploadedFiles.push({ id: file.id, name: file.name, file: file.file });
           // this.showSuccessMessage('File uploaded successfully!');
                } else {
            console.error('Error uploading file. Unexpected response:', res);
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
    this.uploadedFilesToSave = [];
  }
  

  // onRemoveUploadedFile(index: number): void {
  //   this.uploadedFiles.splice(index, 1);
  // }

  deleteProjectArtifact(index: number): void {
    if (index >= 0 && index < this.uploadedFiles.length) {
      const documentIdToDelete = this.uploadedFiles[index].id;
      this.projectService.deleteProjectDocument(documentIdToDelete).subscribe(
        (res:any) => {
          if (res.status === 200 ) {
            this.uploadedFiles.splice(index, 1);
            this.showSuccessMessage('Document deleted successfully!');
          } else {
            console.error('Unexpected response:', res);
          }
        },
        (error) => {
          // Handle error response
          console.error('Error deleting document:', error);
        }
      );
    } else {
      console.error('Invalid index for deleting document.');
    }
  }

  showDialogResponse() {
    this.visibleResponseBox = true;
  }
  showDialogOthers() {
    this.visibleOthersBox = true;
  }
  onUploadResponseClick(): void {
    if (this.selectedFiles.length > 0) {
      this.uploadedResponseFilesToSave = [...this.uploadedResponseFilesToSave, ...this.selectedFiles.map(file => ({ name: file.name, file }))];
      this.selectedFiles = [];
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      this.visibleResponseBox = false;
      this.fileNameOC = "";
      console.log('Response files added to save:', this.uploadedResponseFilesToSave);
    } else {
      console.log('No file selected for Response.');
    }
  }

  uploadResponseFiles(): void {
    const scopeId = 3;
    const entityId = this.projectId;

    for (const file of this.uploadedResponseFilesToSave) {
      this.projectService.UploadProjectArtifact(file.file, scopeId, entityId).subscribe(
        (res: any) => {
          if (res?.message === 'Excel Upload Successfully') {
            console.log('Response file uploaded successfully:', res);
            this.uploadedResponseFiles.push({ name: file.name, file: file.file });
            console.log('uploadedResponseFiles:', this.uploadedResponseFiles);
            this.showSuccessMessage('File uploaded successfully for Response!');
          } else {
            console.log('Unexpected response for Response upload:', res);
            this.uploadedResponseFiles.push({ name: file.name, file: file.file });
            console.log('uploadedResponseFiles:', this.uploadedResponseFiles);
          }
        },
        (error) => {
          console.error('Error uploading file for Response:', error);
        }
      );
    }
    // Clear the array after uploading
    this.uploadedResponseFilesToSave = [];
  }

  onUploadOtherClick(): void {
    if (this.selectedFiles.length > 0) {
   //   this.uploadedOtherFilesToSave = [...this.uploadedOtherFilesToSave, ...this.selectedFiles.map(file => ({ name: file.name, file }))];
      this.selectedFiles = [];
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      console.log('Other files added to save:', this.uploadedOtherFilesToSave);
      this.visibleOthersBox = false;
      this.fileNameOC = "";
    } else {
      console.log('No file selected for Others.');
    }
  }

  uploadOtherFiles(): void {
    const scopeId = 4;
    const entityId = this.projectId;

    for (const file of this.uploadedOtherFilesToSave) {
      this.projectService.UploadProjectArtifact(file.file, scopeId, entityId).subscribe(
        (res: any) => {
          if (res?.message === 'Excel Upload Successfully') {
            console.log('Other file uploaded successfully:', res);
            this.uploadedOtherFiles.push({ name: file.name, file: file.file });
            console.log('uploadedOtherFiles:', this.uploadedOtherFiles);
            this.showSuccessMessage('File uploaded successfully for Others!');
          } else {
            console.log('Unexpected response for Others upload:', res);
            this.uploadedOtherFiles.push({ name: file.name, file: file.file });
            console.log('uploadedOtherFiles:', this.uploadedOtherFiles);
          }
        },
        (error) => {
          console.error('Error uploading file for Others:', error);
        }
      );
    }
    // Clear the array after uploading
    this.uploadedOtherFilesToSave = [];
  }


  onRemoveUploadedResponseFile(index: number): void {
    this.uploadedResponseFiles.splice(index, 1);
  }

  onRemoveUploadedOtherFile(index: number): void {
    this.uploadedOtherFiles.splice(index, 1);
  }

  onResponseCancelClick() {
    this.fileNameOC = "";
    this.selectedFiles = [];
    this.selectedFile = null;
    this.visibleResponseBox = false;
  }

  onOthersCancelClick() {
    this.fileNameOC = "";
    this.selectedFiles = [];
    this.selectedFile = null;
    this.visibleOthersBox = false;
  }
  //-------------------------------------------------end-----------------------------------------//


  //-------------------------------------Delete  Document By ID -----------------------------------//

  // deleteProjectArtifact(index: number): void {
  //   if (index >= 0 && index < this.uploadedFiles.length) {
  //     const documentIdToDelete = this.uploadedFiles[index].id;
  //     this.projectService.deleteProjectDocument(documentIdToDelete).subscribe(
  //       (response) => {
  //         this.uploadedFiles.splice(index, 1);
  //         console.log('Document deleted successfully:', response);
  //       },
  //       (error) => {
  //         // Handle error response
  //         console.error('Error deleting document:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Invalid index for deleting document.');
  //   }
  // }
}