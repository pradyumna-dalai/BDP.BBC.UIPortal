import { Component,Input,Output, EventEmitter } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-cost-line-item',
  templateUrl: './cost-line-item.component.html',
  styleUrls: ['./cost-line-item.component.scss']
})
export class CostLineItemComponent {
  editing:boolean

showOriginVolume: boolean = true;
showDestinationVolume: boolean = false;
originButtonColor: string = 'white';
destinationButtonColor: string = 'rgb(0, 110, 255)';
originButtonBorder: string = '1px solid rgb(0, 110, 255)';
destinationButtonBorder: string = '1px solid rgb(0, 110, 255)';
originButtonBorderRadius: string = '5px';
destinationButtonBorderRadius: string = '5px';
showOriginCLI: boolean = true;
showDestinationCLI:boolean = false;

visible:boolean = false;
private _isExpanded = true;
  costLineItemDetails: any;
  buildingBlockNames: any;
  originProcesses: any[] = [];
  buildingBlocks: any;
  allLines: any;
  costLineItemDetailsResponse: any;
  projectId: any;
  projectName: any;
  @Input() projectidVolume: number | null;
  @Input() projStatus: any | null;
  projectIdCLI: any;
  draftSavedCLI: boolean = false;
  @Output() continueClickedToCLI: EventEmitter<any> = new EventEmitter();
  fileName: string;
  uploadInProgress: boolean = false;
  originalLineData: any;

constructor(private router: Router,private sharedService: SharedServiceService,private projectService:ProjectsService, private messageService: MessageService){
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      // Set setDraftSavedCLI to false when navigating away
      this.sharedService.setDraftSavedCLI(false);
    }
  });
}

ngOnInit(){
  this.getCostLineItemDetails(this.projectidVolume);
  this.projStatus = this.projStatus;
  }

  onClickContinue() {
    // Emit event to notify parent component to move to next tab
    this.continueClickedToCLI.emit();
}
isFteProductivityExceedsMax = false;

onFteProductivityChange(newValue: number) {
  const maxValue = 100;
  if (newValue > maxValue) {
    this.isFteProductivityExceedsMax = true;
    // You can also choose to reset the value to the max here if needed
    // this.line.fteProductivity = maxValue;
  } else {
    this.isFteProductivityExceedsMax = false;
  }
}
showOriginSectionCLI() {
  this.showOriginCLI = true;
  this.showDestinationCLI = false;
  this.originButtonColor = 'white';
  this.destinationButtonColor = 'rgb(0, 110, 255)';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}

showDestinationSectionCLI() {
  this.showOriginCLI = false;
  this.showDestinationCLI = true;
  this.originButtonColor = 'rgb(0, 110, 255)';
  this.destinationButtonColor = 'white';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}
//---------------------------------End--------------------------------------------//
public get isExpanded() {
  return this._isExpanded;
}

showUploadDialog() {
  this.visible = true;
}
onRemoveClick(){
  this.fileName = "";
  this.uploadFile = null;
  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}
onPopupCancelClick(){
  this.visible = false;
    this.fileName = "";
    this.uploadFile = null;
    // Add the following line to reset the file input
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input value
    }
}
uploadFile: File | null = null;
onUploadExcel(event: any){
  const file: File = event.target.files[0];
  if (file) {
    this.fileName = file.name;
    const formData = new FormData();
    formData.append("file", file);
    this.uploadFile = file;
  }
}
onSubmitUploadClick(projId){
  if (!this.uploadFile) {
    // Handle case when no file is selected
    return;
  }

  this.fileName = this.uploadFile.name;
  const formData = new FormData();
  formData.append("file", this.uploadFile);
  this.uploadInProgress = true;
  this.projectService.uploadCLIExcel(formData, projId).subscribe(
    (res: any) => {
      if(res.message == 'success'){
        this.costLineItemDetails = res.data.buildingBlocks;
    
        this.projectId = res.data.projectId;
        this.projectName = res.data.projectName;
        this.buildingBlockNames = this.costLineItemDetails.map(block => block.buildingBlockName);
        if (res && res.data.buildingBlocks && res.data.buildingBlocks.length > 0) {
          this.buildingBlocks = res.data.buildingBlocks;
        }
        this.uploadInProgress = false;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Excel Uploaded successfully.'
        });
      }
      this.visible = false;
      this.onPopupCancelClick();
    },
    (error) => {
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Failed to upload file.'
      });
    
      this.uploadInProgress = false;
    }
  );
}
public set isExpanded(value: boolean) {
  this._isExpanded = value;
}

getCostLineItemDetails(projectId) {
  this.projectService.getCostLineItemDetails(projectId).subscribe((res: any) => {
    this.costLineItemDetails = res.data.buildingBlocks;
    
    this.projectId = res.data.projectId;
    this.projectName = res.data.projectName;
    this.buildingBlockNames = this.costLineItemDetails.map(block => block.buildingBlockName);
    if (res && res.data.buildingBlocks && res.data.buildingBlocks.length > 0) {
      this.buildingBlocks = res.data.buildingBlocks;
    }
  });
}
getConfigurableName(configurableId: number): string {
  switch(configurableId) {
    case 1:
      return 'EDI';
    case 2:
      return 'Manual';
    case 3:
      return 'Others';
    default:
      return 'Unknown';
  }
}
downloadCLISCExcel(event: Event,projectId) {
  event.preventDefault();

  this.projectService.downloadCLIExcel(projectId).subscribe((res: any) => {
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'CostLineItem.xlsx';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    this.messageService.add({
      key: 'successToast',
      severity: 'success',
      summary: 'Success!',
      detail: 'Excel Downloaded successfully.'
    });
  });
}
saveCostLineItemDetails() {
  if (this.costLineItemDetails && this.costLineItemDetails.length > 0) {
    const body = {
      projectId: this.projectId,
      projectName: this.projectName,
      buildingBlocks: this.costLineItemDetails
    }; 

    this.projectService.saveCostLineItemDetails(body).subscribe(
      (res) => {
        this.sharedService.setProjectIdCLI(res?.data?.projectId);
        this.sharedService.setDraftSavedCLI(true);
        this.getCostLineItemDetails(res?.data?.projectId);
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Data saved successfully.'
        });
        // setTimeout(() => {
        //   this.onClickContinue();
        // }, 2000);  
      },
      (error) => {
        this.messageService.add({
          key: 'errorToast',
          severity: 'error',
          summary: 'Error!',
          detail: 'Failed to save data.'
        });
      }
    );
  }
}
recalculateCLI(projectId){
  const body = [{

  }]
  this.projectService.getCostLineItemDetailsReCalc(projectId,body).subscribe((res: any) => {
   if(res.data == 'Success'){
    this.getCostLineItemDetails(projectId);
    this.messageService.add({
      key: 'successToast',
      severity: 'success',
      summary: 'Success!',
      detail: 'Recalculated successfully.'
    });
   }else{
    this.messageService.add({
      key: 'errorToast',
      severity: 'error',
      summary: 'Error!',
      detail: 'Failed to recalculate data.'
    });
   }
  });
}
goToNextTab(){

}
onRowEditInit(line: any) {
  line.editing = true;
  // Keep a copy of the original data
  this.originalLineData = { ...line };
}

onRowEditSave(line: any) {
  // Save the edited data
  line.editing = false; // Exit editing mode
  
}

onRowEditCancel(line: any, ri: number) {
  // Restore the original data
  Object.assign(line, this.originalLineData);
  line.editing = false;
}
onRowEditInitDL(line: any) {
  line.editing = true;
  // Keep a copy of the original data
  this.originalLineData = { ...line };
}
onRowEditSaveDL(line: any) {
  // Save the edited data
  line.editing = false; // Exit editing mode
}

onRowEditCancelDL(line: any, ri: number) {
  // Restore the original data
  Object.assign(line, this.originalLineData);
  line.editing = false;
}

}
