import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-project-cost',
  templateUrl: './project-cost.component.html',
  styleUrls: ['./project-cost.component.scss']
})
export class ProjectCostComponent {
  projectInfo: any;
  showOriginVolume: boolean = true;
  showDestinationVolume: boolean = false;
  originButtonColor: string = 'white';
  destinationButtonColor: string = 'rgb(0, 110, 255)';
  originButtonBorder: string = '1px solid rgb(0, 110, 255)';
  destinationButtonBorder: string = '1px solid rgb(0, 110, 255)';
  originButtonBorderRadius: string = '5px';
  destinationButtonBorderRadius: string = '5px';
  showOriginCLI: boolean = true;
  showDestinationCLI: boolean = false;
  projectId: any;
  getSavedBlocksDetails: any;
  getSavedBlockslist: any;
  @Input() projectIdOC: number | null;
  private _isExpanded = false;
  visiblePandLBox: boolean;
  selectedFile: any;
  fileNameOC: string;
  operationDocName: string;
  showUploaderror: boolean = false;

  constructor(private projectService: ProjectsService, private messageService: MessageService, private appMain: AppMainComponent) {

  }

  ngOnInit() {
    // this.projectService.draftData$.subscribe(data => {
    //   this.projectId = data?.data?.id;
    //   if(this.projectId != null || this.projectId != undefined){
    //   this.fetchProjectInfomation(this.projectId);
    //   this.fetchAllProjectBuildingBlock(this.projectId);
    //   }
    // });
    if (this.projectIdOC != null || this.projectIdOC != undefined) {
      this.fetchProjectInfomation(this.projectIdOC);
      this.fetchAllProjectBuildingBlock(this.projectIdOC);
    }

  }
  public get isExpanded() {
    return this._isExpanded;
  }

  public set isExpanded(value: boolean) {
    this._isExpanded = value;
  }
  shoSOWSection() {
    this.showOriginVolume = true;
    this.showDestinationVolume = false;
    this.originButtonColor = 'white';
    this.destinationButtonColor = 'rgb(0, 110, 255)';
    this.originButtonBorder = '1px solid rgb(0, 110, 255)';
    this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
    this.originButtonBorderRadius = '5px';
    this.destinationButtonBorderRadius = '5px';
  }

  showplStatement() {
    this.showOriginVolume = false;
    this.showDestinationVolume = true;
    this.originButtonColor = 'rgb(0, 110, 255)';
    this.destinationButtonColor = 'white';
    this.originButtonBorder = '1px solid rgb(0, 110, 255)';
    this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
    this.originButtonBorderRadius = '5px';
    this.destinationButtonBorderRadius = '5px';
  }
  //---------------------------------------------------get Project Info---------------------------------------------//
  fetchProjectInfomation(projectIdOC): void {
    this.projectService.getProjectDetails(projectIdOC).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.projectInfo = res.data.projectInformation;
        console.log('InfoOf Project', this.projectInfo);
      } else {
        console.log('Project Information is Not Found');
      }
    });
  }

  getOpportunityManagerNames(opportunityManagers: any[]): string {
    if (!opportunityManagers || opportunityManagers.length === 0) {
      return '';
    }
    const managerNames = opportunityManagers.map(manager => manager.name);
    return managerNames.join(', ');
  }

  //---------------------------------------------get Buidling Block Info--------------------------------------------//
  fetchAllProjectBuildingBlock(projectIdOC: any) {
    if (this.projectIdOC != null) {
      this.projectService.getSOWInformations(projectIdOC).subscribe({
        next: (response: any) => {
          this.getSavedBlockslist = response.data;
          // console.log("Table BB", this.getSavedBlockslist)
          // this.getSavedBlocksDetails = response.data.buildingBlocks.map((block: any) => ({
          //   // buildingBlockId: block.buildingBlockId,
          //   // buildingBlockName: block.buildingBlockName
          // }));
          // console.log("Table BB2",  this.getSavedBlocksDetails);
        }
      });
    }
  }



  //------------------------------------------------Download Pdf--------------------------------------------------//
  // downloadAsPdf() {
  //   const element = document.getElementById('pdf-content');
  //   const opt = {
  //     margin: 1,
  //     filename: 'BBC_SOW.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  //   };
  //   html2pdf().from(element).set(opt).save();
  // }

  downloadAsPdf() {

    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0.1,
      filename: 'BBC_SOW.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Set the expanded property of all accordion tabs to true
    const accordionTabs = element.querySelectorAll('p-accordionTab');
    accordionTabs.forEach(tab => {
      tab.setAttribute('selected', 'true');
    });

    // Hide "Expand All" and "Collapse All" buttons only during PDF generation
    const buttons = element.querySelectorAll('button[pButton]');
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'none';
    });

    // Prepend the HTML content with image and logo
    const headerImage = '<img src="assets/layout/images/sowheaderLog.jpg" style="width:100%;height: 140px;">';
    const logoImage = '<img src="assets/layout/images/PSABDPLOGO.png" style="width:20%;float:right">';
    const htmlContent = headerImage + logoImage + element.innerHTML;

    // Convert HTML to PDF
    html2pdf().from(htmlContent).set(opt).save();

    // Restore buttons visibility after conversion
    buttons.forEach(button => {
      (button as HTMLElement).style.display = 'block';
    });
  }

  goToNextTab() {
  }


  //#region P & L Tab Code for Upload
  showDialogOthers() {
    this.visiblePandLBox = true;
  }
  onOperarationCancelClick() {
    this.visiblePandLBox = false;
  }
  onUploadClick(event: any): void {
    if (this.selectedFile) {
      const fileName: string = this.selectedFile.name;
      const fileExtension: string = fileName.split('.').pop()?.toLowerCase() || '';
      // Check if the file extension is Excel
      if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        const scopeId = 7;
        const entityId = this.projectIdOC;
        //    this.readExcelFile(this.selectedFile);
        this.visiblePandLBox = false;
        this.projectService.UploadProjectArtifact(this.selectedFile, scopeId, entityId).subscribe(
          (res: any) => {
            if (res?.message === 'success') {
            //  this.fileNameOC = "";
            //  this.selectedFile = null;
              this.fileNameOC = this.selectedFile.name;
              this.messageService.add({
                key: 'successToast',
                severity: 'success',
                summary: 'Success!',
                detail: 'Project P & L Statement is uploaded Successfully.'
              });
              const fileInput = document.getElementById('fileInput') as HTMLInputElement;
              if (fileInput) {
                fileInput.value = '';
              }

            } else {
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Project P & L Statement can not be Upload.'
              });
            }
          },
          (error) => {
            console.error('Error uploading file:', error);
          }
        );
      } else {
        // this.showErrorMessage('Only Excel files (.xlsx) are allowed!');
      }
    } else {
    }
  }
  onRemoveOperationClick() {
    this.showUploaderror = false;
    this.fileNameOC = "";
    this.selectedFile = null;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileNameOC = this.selectedFile.name;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.fileNameOC = this.operationDocName;
    }
  }
  //#endregion
}
