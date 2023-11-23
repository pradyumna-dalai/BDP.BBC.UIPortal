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
  product_scope: any;
  building_block_name:any
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
  procuctScopesOptions = []
  procuctCategoryOptions = []
  chargecodeOptions = []

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
    this.getProdname();
    this.getChargeCode();
  

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

  getProdname() {
    this.MasterTableservice.getProductName().subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctNamesOptions = res?.data;
      }
    })
  }

  onProductSelect(body)
  {
    
      this.MasterTableservice.getProductScope(body,this.product_name).subscribe((res: any) => {
        if (res?.message == "success") {
          this.procuctScopesOptions = res?.data;
        }
        
      })
      
  }
  onScopeSelect(body)
  {
      this.MasterTableservice.getProductCategory(body,this.product_scope).subscribe((res: any) => {
        if (res?.message == "success") {
          this.procuctCategoryOptions = res?.data;
        }
      })
    
  }
  getChargeCode(){
    this.MasterTableservice.getChargeCode().subscribe((res: any) => {
      if (res?.message == "success") {
        this.chargecodeOptions = res?.data;
      }
    })

  }

}
