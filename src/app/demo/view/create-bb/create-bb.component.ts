import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MenuItem, MessageService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service';
import { CreateBuildingBlockService } from './../../../services/create-buildingBlock/create-building-block.service';



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
  building_block_name: any
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
  configurables: any;
  data: any;
  procuctNames: any
  procuctNamesOptions = []
  procuctScopesOptions = []
  procuctCategoryOptions = []
  chargecodeOptions = []

  constructor(private breadcrumbService: AppBreadcrumbService, public messageService: MessageService,
    public MasterTableservice: MasterTableService, public CreateBuildingBlockservice: CreateBuildingBlockService) {
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

  onProductSelect(body) {
  //  this.product_scope = "";
    this.MasterTableservice.getProductScope(body, this.product_name).subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctScopesOptions = res?.data;
      }

    })

  }
  onScopeSelect(body) {
    this.MasterTableservice.getProductCategory(body, this.product_scope).subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctCategoryOptions = res?.data;
      }
    })

  }
  getChargeCode() {
    this.MasterTableservice.getChargeCode().subscribe((res: any) => {
      if (res?.message == "success") {
        this.chargecodeOptions = res?.data;
      }
    })

  }

  // ---------------add building blocks------------------------//

  saveAsDraft() {
    // if (this.product_name == '' || this.product_name == null || this.product_name == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product name is a required field.`, detail: '' });
    // }
    // if (this.product_scope == '' || this.product_scope == null || this.product_scope == undefined) {
    //     return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product scope is a required field.`, detail: '' });
    // }
    // if (this.product_category == '' || this.product_category == null || this.product_category == undefined) {
    //     return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product category is a required field.`, detail: '' });
    // }
    // if (this.building_block_name == '' || this.building_block_name == null || this.building_block_name == undefined) {
    //     return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Building block is a required field.`, detail: '' });
    // }

    const body =

    {
      blockName: this.building_block_name,
      product: {
        id: this.product_name
      },
      scope: {
        id: this.product_scope
      },
      category: {
        id: this.product_category
      },
      chargeCode: {
        id: this.charge_code
      },
      scopingCard: {
        serviceDescription: this.seervice_desc,
        customerRequirment: this.customer_requirement,
        deliverable: this.deliverables,
        stakeHolder: this.stakeholders_audience,
        valueToPsaBdp: this.value_to_psa_bdp,
        parameter: this.parameters,
        configurable: this.configurables,
        modeOfTransport: {
          id: this.selectedMod
        }
      },
      operationsCard: {
        card: ""
      },
      commercialCard: {
        serviceDescription: "",
        customerRequirment: "",
        psaBdpValueStatement: "",
        standardService: ""
      }
      

    }
    console.log(body);
    this.CreateBuildingBlockservice.createBuildingBlock(body).subscribe((res) => {
      console.log("okddd");
    })

  }

}
