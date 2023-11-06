import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../../../app.breadcrumb.service';
import { MenuItem, MessageService } from 'primeng/api';
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
  text: string = '';
  cities: City[];
  selectedCities: City[];
  product_category: any;
  showScopingCrad: boolean = true;
  showCommercialCrad: boolean = false;
  showOperationCrad:boolean = false;
  constructor(private breadcrumbService: AppBreadcrumbService,public messageService: MessageService) {
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

}
