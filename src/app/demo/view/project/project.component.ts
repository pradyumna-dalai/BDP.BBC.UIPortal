import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

//import moment from "moment";
import dayjs from 'dayjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProjectComponent {
  text: string = '';
  data: any = {};
  rowDisabledState: { [key: string]: boolean } = {};
  proejctdetails = [];
  updateTable=[]
  startDate: string;
  endDate: string;
  displayDateRangeDialog = false;
  selectedStartDate: Date;
  selectedEndDate: Date;
  //selectedPredefinedDateRange: any; 
  showDateRangeSelection = false;

  dateRange: Date[];
  endDateString: string;
  startDateString: string;
  predefinedDateRanges: SelectItem[] = [
    { label: 'Last 1 Year', value: 'last1Year' },
    { label: 'Last 2 Years', value: 'last2Years' },
    { label: 'Last 3 Years', value: 'last3Years' },
    { label: 'Custom', value: 'custom' },
  ];

  selectedPredefinedDateRange: SelectItem;
  confirmationHeader: string;
  onDateRangeSelect(event: any) { }

  formatDate(date: Date): string {
    return dayjs(date).format('DD.MM.YY');
  }
  constructor(private datePipe: DatePipe, private breadcrumbService: AppBreadcrumbService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router, private projectsService: ProjectsService) {
    this.breadcrumbService.setItems([
      { label: 'Project' }
    ]);
  }

  ngOnInit() {
    this.fetchAllProjectDetails();
    this.selectedPredefinedDateRange = this.predefinedDateRanges[0];
    this.projectsService.data$.subscribe((res)=> {
      if (res && res.length) {
        this.getDataFromFilter();
      }
    })
    this.getDataFromFilter()
  }
  isloader:boolean= false;
  getDataFromFilter(){
    this.isloader = true
    this.projectsService.data$.pipe(
      finalize(()=> this.isloader = false)
    ).subscribe((res:any)=>{
      if(Array.isArray(res)){
        this.updateTable =res?.map((item: any) => {
          const opportunityManagers = item.projectInformation?.opportunityManager?.map(manager => manager?.name).join(', ');
          //console.log('opp',opportunityManagers);
          const formattedStartDate = this.datePipe.transform(item.projectInformation?.startDate, 'dd-MM-yyyy');
          const formattedEndDate = this.datePipe.transform(item.projectInformation?.endDate, 'dd-MM-yyyy');
          return {
            comp_name: item.projectInformation?.company?.name,
            proj_id: item?.id,
            proj_name: item.projectInformation?.projectName,
            oppourtunity_name: item.projectInformation?.opportunityName?.name,
            proj_stage: item.projectInformation?.projectStage?.name,
            proj_status: item.projectInformation?.projectStatus?.name,
            oppourtunity_manager: opportunityManagers,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          };
        });
        if (res.length >0) {
          console.log("dataUpdate",res);
          this.proejctdetails = this.updateTable
        } else {
          this.fetchAllProjectDetails();
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'No Data' 
          });
        }
      }
      
  })
  }


  toggleDateRangeSelection(): void {
    this.showDateRangeSelection = !this.showDateRangeSelection;
  }
  confirm(action: string, itemId?: string): void {
    let confirmationMessage: string;
    let header: string;

    if (action === 'copy') {
      confirmationMessage = 'Are you sure that you want to copy this project?';
      header = 'Copy Project';
    } else if (action === 'delete') {
      confirmationMessage = 'Are you sure that you want to delete this project?';
      header = 'Delete Project';
    }

    this.confirmationHeader = header;
    this.confirmationService.confirm({
      message: confirmationMessage,
      accept: () => {
        if (action === 'copy') {
          this.router.navigateByUrl('/create-project');
        } else if (action === 'delete') {
          this.rowDisabledState[itemId] = true;
        }
      },
      header: this.confirmationHeader,
    });
  }

  cancelDateRange() {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.showDateRangeDialog();
    this.showDateRangeSelection = false;
  }

  setPredefinedDateRange(label: string) {
    switch (label) {
      case 'Last 1 Year':
        this.selectedEndDate = new Date(); // Set to the current date
        this.selectedStartDate = new Date(this.selectedEndDate);
        this.selectedStartDate.setFullYear(this.selectedStartDate.getFullYear() - 1);
        break;
      case 'Last 2 Years':
        this.selectedEndDate = new Date(); // Set to the current date
        this.selectedStartDate = new Date(this.selectedEndDate);
        this.selectedStartDate.setFullYear(this.selectedStartDate.getFullYear() - 2);
        break;
      case 'Last 3 Years':
        this.selectedEndDate = new Date(); // Set to the current date
        this.selectedStartDate = new Date(this.selectedEndDate);
        this.selectedStartDate.setFullYear(this.selectedStartDate.getFullYear() - 3);
        break;

      default:
        break;
    }

    this.selectedPredefinedDateRange = this.predefinedDateRanges.find((option) => option.label === label);
  }


  fetchAllProjectDetails() {
    this.projectsService.getAllProjectDetails().subscribe((res: any) => {
      if (res?.message == "success") {
        this.proejctdetails = res?.data.map((item: any) => {
          const opportunityManagers = item.projectInformation?.opportunityManager?.map(manager => manager?.name).join(', ');
          //console.log('opp',opportunityManagers);
          const formattedStartDate = this.datePipe.transform(item.projectInformation?.startDate, 'dd-MM-yyyy');
          const formattedEndDate = this.datePipe.transform(item.projectInformation?.endDate, 'dd-MM-yyyy');
          return {
            comp_name: item.projectInformation?.company?.name,
            proj_id: item?.id,
            proj_name: item.projectInformation?.projectName,
            oppourtunity_name: item.projectInformation?.opportunityName?.name,
            proj_stage: item.projectInformation?.projectStage?.name,
            proj_status: item.projectInformation?.projectStatus?.name,
            oppourtunity_manager: opportunityManagers,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          };
        });
        //console.log('fbggf', this.proejctdetails);
      } else {
        this.proejctdetails = [];
      }
    });
  }


  exportData() {
    this.startDateString = this.selectedStartDate.toISOString();
    this.endDateString = this.selectedEndDate.toISOString();

    if (this.selectedStartDate && this.selectedEndDate) {
      this.projectsService.downloadProjectData(this.startDateString, this.endDateString).subscribe(
        (response: HttpResponse<Blob>) => {
          // Check if the response content type is 'application/json'
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            // The server returned an error message in JSON format
            const reader = new FileReader();
            reader.onloadend = () => {
              const errorResponse = JSON.parse(reader.result as string);
              console.error('Download error:', errorResponse);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File download failed!' });
            };
            reader.readAsText(response.body);
          } else {
            // The server provided the correct Excel file
            const blob = new Blob([response.body], { type: response.body.type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'BBC_Project_List.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.messageService.add({ key: 'successToast', severity: 'success', summary: 'Success', detail: 'File downloaded successfully!' });
          }
        },
        (error) => {
          console.error('Download error', error);
          this.messageService.add({ key: 'error', severity: 'error', summary: 'Error', detail: 'File download failed!' });
        }
      );
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.showDateRangeSelection = false;
    } else {
      console.warn('Please select a date range before exporting.');
    }
  }


  showDateRangeDialog() {
    this.selectedPredefinedDateRange = this.predefinedDateRanges[0]; // Set default to 'Last 1 Year'
    this.setPredefinedDateRange('1'); // Set the default date range
    this.displayDateRangeDialog = true;
  }

  applyDateRange() {
    if (this.selectedStartDate && this.selectedEndDate) {
      this.exportData();
      this.displayDateRangeDialog = false;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select both start and end dates.',
      });
    }
  }
  onPredefinedDateRangeChange() {
    if (this.selectedPredefinedDateRange?.value !== 'custom') {
      // Set the dates based on the predefined range
      this.setPredefinedDateRange(this.selectedPredefinedDateRange?.label);
    }
  }

}
