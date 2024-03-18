import { Component,Input } from '@angular/core';
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
    if(this.projectIdOC != null || this.projectIdOC != undefined){
      this.fetchProjectInfomation(this.projectIdOC);
      this.fetchAllProjectBuildingBlock(this.projectIdOC);
    }

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
        console.log('InfoOf Project',this.projectInfo);
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

    // Prepend the HTML content with image and logo
    const headerImage = '<img src="assets/layout/images/sowheaderLog.jpg" style="width:100%;height: 140px;">';
    const logoImage = '<img src="assets/layout/images/PSABDPLOGO.png" style="width:20%;>'; 
    const htmlContent = headerImage + logoImage + element.innerHTML;
    html2pdf().from(htmlContent).set(opt).save();
  }


  // downloadAsPdf() {
  //   const element = document.getElementById('pdf-content');
  //   const opt = {
  //     margin: 0.1,
  //     filename: 'BBC_SOW.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  //   };
  
  //   // Prepend the HTML content with image and logo
  //   const headerImage = '<img src="assets/layout/images/sowheaderLog.jpg" style="width:100%;height: 140px;">';
  //   const logoImage = '<img src="assets/layout/images/PSABDPLOGO.png" style="width:20%;">'; 
  //   const htmlContent = headerImage + logoImage + element.innerHTML;
  
  //   // Wrap the HTML content in a div with a fixed height
  //   const wrapper = document.createElement('div');
  //   wrapper.style.height = '100vh';
  //   wrapper.style.overflow = 'auto';
  //   wrapper.innerHTML = htmlContent;
  
  //   // Set a fixed height for the table rows and cells
  //   const rows = wrapper.querySelectorAll('tr');
  //   rows.forEach((row: HTMLElement) => {
  //     row.style.height = 'auto';
  //     const cells = row.querySelectorAll('td, th');
  //     cells.forEach((cell: HTMLElement) => {
  //       cell.style.height = 'auto';
  //       cell.style.overflow = 'hidden';
  //     });
  //   });
  
  //   html2pdf().from(wrapper).set(opt).save();
  // }
  goToNextTab() {
  }
}
