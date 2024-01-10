import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';

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

  constructor(private datePipe: DatePipe, private breadcrumbService: AppBreadcrumbService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Location' }
    ]);
  }

  ngOnInit() {
    this.fetchAllLocationDetails();

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
            status: item.status

          };
        });
       // console.log("djdsf",this.locationdetails);
      } else {
        this.locationdetails = [];
      }
    });
  }




}
