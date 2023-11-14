import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../../../app.breadcrumb.service';
import { MenuItem, MessageService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service'

interface City {
  name: string,
  code: string
}
@Component({
  selector: 'app-create-bb',
  templateUrl: './create-bb.component.html',
  styleUrls: ['./create-bb.component.scss'],
  providers: [MessageService]
})

export class CreateBbComponent {
  items: MenuItem[];
  routeItems: MenuItem[];
  // text: string = '';
  cities: City[];
  selectedCities: City[];
  product_category: any;
  showScopingCrad: boolean = true;
  showCommercialCrad: boolean = false;
  showOperationCrad:boolean = false;
  visible: boolean = false;
  product_name: any;

  constructor(private breadcrumbService: AppBreadcrumbService,public messageService: MessageService, public MasterTableservice: MasterTableService) {
    this.breadcrumbService.setItems([
        {label: 'Building Blocks'},
        {label: 'Create Building Blocks'},
    ]);
    this.cities = [
      {name: 'Ocean', code: 'NY'},
      {name: 'Air', code: 'RM'},
      {name: 'Rail', code: 'LDN'},
      {name: 'Road', code: 'IST'},
  ];
}
ngOnInit() {
  this.routeItems = [
      {
          label: 'General Information',
          routerLink: 'general-info'
      },
      {
          label: 'Commercial Reference',
          routerLink: 'create-buildingblocks/commercial-ref'
      }
  ];
  this.getmasterData(this.product_name);
}

showDialog() {
    this.visible = true;
}
onScopingCardClick()
{
  this.showScopingCrad = true;
  this.showOperationCrad = false;
  this.showCommercialCrad = false;
}
onOperationCardClick(){
  this.showScopingCrad = false;
  this.showOperationCrad = true;
  this.showCommercialCrad = false;
}
onCommercialCardClick(){
  this.showScopingCrad = false;
  this.showOperationCrad = false;
  this.showCommercialCrad = true;
}

getmasterData(body) {
  this.MasterTableservice.getProductName(body).subscribe((res: any) => {
    console.log(res+"kk");
      if (res?.success == true) {
          // this.succes = res.success
          // this.data = res?.result?.data;
          // this.totalRecords = res?.result?.total;
          // res?.result.data?.map((item, i) => {
          //     if (item.is_top_port == 1) {
          //         item.is_top_port = true
          //     } else {
          //         item.is_top_port = false
          //     }
          // })
          // setTimeout(() => { this.loading = false }, 300);
      }
  })
}

}
