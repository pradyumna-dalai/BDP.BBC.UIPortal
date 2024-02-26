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
import { ActivatedRoute } from '@angular/router';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';

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
  projId: number;
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
  uploadedFiles: { id: number; name: string, file: File }[] = [];
  selectedFiles: File[] = [];
  uploadedResponseFiles: { id: number; name: string, file: File }[] = [];
  uploadedOtherFiles: { id: number; name: string, file: File }[] = [];
  projectId: number | null = null;
  visibleResponseBox: boolean = false;
  visibleOthersBox: boolean = false;
  response: any;
  uploadedFilesToSave: { id: number; name: string; file: File }[] = [];
  uploadedResponseFilesToSave: { id: number, name: string; file: File }[] = [];
  uploadedOtherFilesToSave: { id: number | null; name: string; file: File }[] = [];
  constructor(private route: ActivatedRoute, private breadcrumbService: AppBreadcrumbService, private zone: NgZone,
    private datePipe: DatePipe, private messageService: MessageService, private fb: FormBuilder, public MasterTableservice: MasterTableService,
    private createBuildingBlockservice: CreateBuildingBlockService, public projectService: ProjectsService) {
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

    //get projid
    this.route.queryParams.subscribe(params => {
      this.projId = params.projId;
      this.getProjectDetails(this.projId);
      console.log(params.projId)
    });

    if (this.projId) {
      this.breadcrumbService.setItems([
        {
          label: 'PROJECT',
          routerLink: 'project'
        },
        { label: 'Update Project' },
      ]);
    } else {
      this.breadcrumbService.setItems([
        {
          label: 'PROJECT',
          routerLink: 'project'
        },
        { label: 'Create Project' },
      ]);
    }
  }

  patchDateRangeValue(newValue: any) {
    this.myForm.get('selectedDateRange').patchValue(newValue);
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

        // Automatically select the opportunity name if it matches the response
        const selectedOpportunityId = this.response.opportunityName?.id;
        if (selectedOpportunityId) {
          const matchingOpportunity = this.opportunityNameOptions.find(opportunity => opportunity.id === selectedOpportunityId);
          if (matchingOpportunity) {
            this.myForm.get('opportunityName').setValue(matchingOpportunity.id);
          }
        }
      } else {
        this.opportunityNameOptions = [];
      }
    });
  }

  // ---------------get Industry Vertical------------------------//
  onOpportunitySelect(event) {
    const selectedOpportunityId = event.value;

    // Fetch industry vertical options based on the selected opportunity ID
    this.MasterTableservice.getIndustryVertical(selectedOpportunityId).subscribe((res: any) => {
      if (res?.message === "success") {
        this.IVOptions = res?.data;

        // Automatically select the industry vertical if it matches the response
        const selectedIVId = this.response.industryVertical?.id;
        if (selectedIVId) {
          const matchingIV = this.IVOptions.find(iv => iv.id === selectedIVId);
          if (matchingIV) {
            this.myForm.get('industryVertical').setValue(matchingIV.id);
          }
        }
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
  patchformatDate(date: Date): string {
    return dayjs(date).format('MM/DD/YYYY');
  }
  onSaveAsDraftClick() {
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
    
    let dateRange = this.dateRange
    if (typeof this.dateRange == 'string' && this.dateRange.indexOf("-") != -1) {
       dateRange = this.dateRange.split("-");
    }

    let dateRangevalEndDate = this.dateRange.endDate;

    const originProjectLocationData = this.OtableData.map((row: TableRow) => ({
      volume: row.Volume,
      originDestination: 0,
      originDestinationCode: 0,

      location: {
        id: this.locationOptions.find(loc => loc.name === row.city)?.id,
        name: row.city
      },
      uom: {
        id: row.Uom
      }
    }));

    const destinationProjectLocationData = this.tableData.map((row: TableRow) => ({
      volume: row.Volume,
      originDestination: 1,
      originDestinationCode: 1,
      location: {
        id: this.locationOptions.find(loc => loc.name === row.city)?.id,
        name: row.city
      },
      uom: {
        id: row.Uom
      }
    }));
    const body = {
      id: this.projId,
      description: "",
      projectInformation: {
        customerCode: this.myForm.get('customerCode').value,
        projectName: this.myForm.get('projectName').value,
        startDate: this.formatDate(dateRange[0]),
        endDate: this.formatDate(dateRange[1]),
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
      },
      projectLocation: [
          ...originProjectLocationData,
          ...destinationProjectLocationData
      
      ]
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
        (res: any) => {
          if (res.status === 200) {
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

  // onRemoveUploadedResponseFile(index: number): void {
  //   this.uploadedResponseFiles.splice(index, 1);
  // }

  // onRemoveUploadedOtherFile(index: number): void {
  //   this.uploadedOtherFiles.splice(index, 1);
  // }

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

  deleteResponseArtifact(index: number): void {
    if (index >= 0 && index < this.uploadedResponseFiles.length) {
      const documentIdToDelete = this.uploadedResponseFiles[index].id;
      this.projectService.deleteProjectDocument(documentIdToDelete).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.uploadedResponseFiles.splice(index, 1);
            this.showSuccessMessage('Response document deleted successfully!');
          } else {
            console.error('Unexpected response:', res);
          }
        },
        (error) => {
          console.error('Error deleting response document:', error);
        }
      );
    } else {
      console.error('Invalid index for deleting response document.');
    }
  }

  uploadOtherFiles(): void {
    const scopeId = 4;
    const entityId = this.projectId;

    for (const file of this.uploadedOtherFilesToSave) {
      this.projectService.UploadProjectArtifact(file.file, scopeId, entityId).subscribe(
        (res: any) => {
          if (res?.status === 200 && res?.message === 'success' && res?.data?.id) {
            file.id = res.data.id;
            this.uploadedOtherFiles.push({ id: file.id, name: file.name, file: file.file });
            // this.showSuccessMessage('Other file uploaded successfully!');
          } else {
            console.error('Error uploading other file. Unexpected response:', res);
          }
        },
        (error) => {
          console.error('Error uploading other file:', error);
        }
      );
    }
    // Clear the array after uploading
    this.uploadedOtherFilesToSave = [];
  }

  onUploadOtherClick(): void {
    if (this.selectedFiles.length > 0) {
      this.uploadedOtherFilesToSave = [
        ...this.uploadedOtherFilesToSave,
        ...this.selectedFiles.map(file => ({ id: null, name: file.name, file })),
      ];
      this.selectedFiles = [];
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      this.visibleOthersBox = false;
      this.fileNameOC = "";

      console.log('Other files added to save:', this.uploadedOtherFilesToSave);
    } else {
      console.log('No file selected for Others.');
    }
  }

  deleteOtherArtifact(index: number): void {
    if (index >= 0 && index < this.uploadedOtherFiles.length) {
      const documentIdToDelete = this.uploadedOtherFiles[index].id;
      this.projectService.deleteProjectDocument(documentIdToDelete).subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.uploadedOtherFiles.splice(index, 1);
            this.showSuccessMessage('Other document deleted successfully!');
          } else {
            console.error('Unexpected response:', res);
          }
        },
        (error) => {
          console.error('Error deleting other document:', error);
        }
      );
    } else {
      console.error('Invalid index for deleting other document.');
    }
  }

  uploadResponseFiles(): void {
    const scopeId = 3;
    const entityId = this.projectId;

    for (const file of this.uploadedResponseFilesToSave) {
      this.projectService.UploadProjectArtifact(file.file, scopeId, entityId).subscribe(
        (res: any) => {
          if (res?.status === 200 && res?.message === 'success' && res?.data?.id) {
            file.id = res.data.id;
            this.uploadedResponseFiles.push({ id: file.id, name: file.name, file: file.file });
            //  this.showSuccessMessage('Response file uploaded successfully!');
          } else {
            console.error('Error uploading response file. Unexpected response:', res);
          }
        },
        (error) => {
          console.error('Error uploading response file:', error);
        }
      );
    }

    this.uploadedResponseFilesToSave = [];
  }

  onUploadResponseClick(): void {
    if (this.selectedFiles.length > 0) {
      this.uploadedResponseFilesToSave = [
        ...this.uploadedResponseFilesToSave,
        ...this.selectedFiles.map(file => ({ id: null, name: file.name, file })),
      ];

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

  getProjectDetails(projectId): void {
    this.projectService.getProjectDetails(projectId).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.response = res.data.projectInformation; // Store the response data
        this.populateForm(); // Call function to populate form with response data
      } else {
        // Handle error
      }
    });
  }
  selected = [
    "2024-02-13T00:00:00.000+00:00",
    "2024-02-13T00:00:00.000+00:00"
  ];

  populateForm(): void {

console.log("ResponseEdit",this.response);
this.myForm.patchValue({
  // selectedDateRange: '01/01/2022 - 01/10/2022',
  
  selectedDateRange: `${this.patchformatDate(this.response.startDate)} - ${this.patchformatDate(this.response.endDate)}`,
});
console.log("data",this.myForm.get('selectedDateRange').value)
    // Populate other form controls with the received data
    this.myForm.patchValue({
      companyName: this.response.company?.id,
      customerCode: this.response.customerCode,
      opportunityName: this.response.opportunityName?.id,
      industryVertical: this.response.industryVertical?.id,
      region: this.response.region?.id,
      projectName: this.response.projectName,
      projectStage: this.response.projectStage?.id,
      projectStatus: this.response.projectStatus?.id,
      // opportunityManager: this.response.opportunityManager.map(manager => manager.id),
      designNotes: this.response.designNote,
      impleNotes: this.response.implementationNote,

    });
console.log("selectedPatchDate",this.myForm.get('selectedDateRange').value)
    // Automatically fetch and set opportunity names based on the selected company
    if (this.response.company) {
      this.onCompanySelect({ value: this.response.company.id });
    }
    // Automatically fetch and set industry vertical based on the selected opportunity name
    if (this.response.opportunityName) {
      this.onOpportunitySelect({ value: this.response.opportunityName.id });
    }

    // Set selected opportunity managers
    if (this.response.opportunityManager && this.response.opportunityManager.length > 0) {
      const selectedOpportunityManagers = this.response.opportunityManager.map(manager => manager.id);
      this.myForm.get('opportunityManger').setValue(selectedOpportunityManagers);
    }
    const selectedRegionIndex = this.regionOptions.findIndex(region => region.id === this.response.region?.id);
    const selectedProjectStageIndex = this.projectStageOptions.findIndex(stage => stage.id === this.response.projectStage?.id);

    if (selectedProjectStageIndex !== -1) {
      this.myForm.get('projectStage').setValue(this.projectStageOptions[selectedProjectStageIndex].id);
      // Automatically fetch and set project status based on the selected project stage
      this.OnStageSelectProjectstatus({ value: this.response.projectStage.id });
    }



    if (selectedRegionIndex !== -1) {
      this.myForm.get('region').setValue(this.regionOptions[selectedRegionIndex].id);
    }



    // const startDate = new Date(this.response.projectInformation.startDate);
    // const endDate = new Date(this.response.projectInformation.endDate);
    // this.myForm.get('selectedDateRange').setValue([startDate, endDate]);

  }
  downloadArtifactByIDOther(index: number) {
    let fileName: string | null = null;
    if (index >= 0 && index < this.uploadedOtherFiles.length) {
      const documentIdToDownload = this.uploadedOtherFiles[index].id;
      fileName = this.uploadedOtherFiles[index].name;
      this.createBuildingBlockservice.downloadUploadedOperationCard(documentIdToDownload).subscribe(
        (data: ArrayBuffer) => {
          const blob = new Blob([data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          //link.download = 'downloaded_file.xlsx';
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
    } else {
      console.error('Operation Card is null or undefined.');

    }
  }

  downloadArtifactByIDResponse(index: number) {
    let fileName: string | null = null;
    if (index >= 0 && index < this.uploadedResponseFiles.length) {
      const documentIdToDownload = this.uploadedResponseFiles[index].id;
      fileName = this.uploadedResponseFiles[index].name;
      this.createBuildingBlockservice.downloadUploadedOperationCard(documentIdToDownload).subscribe(
        (data: ArrayBuffer) => {
          const blob = new Blob([data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          //link.download = 'downloaded_file.xlsx';
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
    } else {
      console.error('Operation Card is null or undefined.');
    }
  }
  downloadArtifactByIDValue(index: number) {
    let fileName: string | null = null;
    if (index >= 0 && index < this.uploadedFiles.length) {
      const documentIdToDownload = this.uploadedFiles[index].id;
      fileName = this.uploadedFiles[index].name;
      this.createBuildingBlockservice.downloadUploadedOperationCard(documentIdToDownload).subscribe(
        (data: ArrayBuffer) => {
          const blob = new Blob([data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          //link.download = 'downloaded_file.xlsx';
          link.download = fileName;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
    } else {
      console.error('Operation Card is null or undefined.');
    }

  }
}

