import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MenuItem, MessageService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service'
import { environment } from "../../../../environments/environment"

interface modeOfTrans {
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
  mot: modeOfTrans[];
  selectedMod: modeOfTrans[];
  product_category: any;
  charge_code: any;
  showScopingCrad: boolean = true;
  showCommercialCrad: boolean = false;
  showOperationCrad: boolean = false;
  visible: boolean = false;
  product_name: any;
  selected: boolean = true;
  seervice_desc: any;
  value_to_psa_bdp: any;
  customer_requirement: any;
  parameters: any;
  deliverables: any;
  stakeholders_audience: any;
  data: any;
  procuctNames: any
  procuctNamesOptions = []

  constructor(private breadcrumbService: AppBreadcrumbService, public messageService: MessageService, public MasterTableservice: MasterTableService) {
    this.breadcrumbService.setItems([
      {
        label: 'Building Blocks',
        routerLink: 'building-block'
      },
      { label: 'Create Building Blocks' },
    ]);
    this.mot = [
      { name: 'Ocean', code: 'NY' },
      { name: 'Air', code: 'RM' },
      { name: 'Rail', code: 'LDN' },
      { name: 'Road', code: 'IST' },
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
  onScopingCardClick() {
    this.showScopingCrad = true;
    this.showOperationCrad = false;
    this.showCommercialCrad = false;
  }
  onOperationCardClick() {
    this.showScopingCrad = false;
    this.showOperationCrad = true;
    this.showCommercialCrad = false;
  }
  onCommercialCardClick() {
    this.showScopingCrad = false;
    this.showOperationCrad = false;
    this.showCommercialCrad = true;
  }
  clear() {
    this.seervice_desc = "";
    this.value_to_psa_bdp = "";
    this.customer_requirement = "";
    this.parameters = "";
    this.deliverables = "";
    this.stakeholders_audience = "";
    this.selectedMod = [];
  }

  getmasterData(body) {
    this.MasterTableservice.getProductName(body).subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctNamesOptions = res?.data;
      }
    })
  }

  onProductSelect(body)
  {
    
      this.MasterTableservice.getProductScope(body,this.product_name).subscribe((res: any) => {
        console.log("ok");
        
      })
    
  }

}
