import { Component  } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MenuItem, MessageService,ConfirmationService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service';
import { CreateBuildingBlockService } from './../../../services/create-buildingBlock/create-building-block.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-create-bb',
  templateUrl: './create-bb.component.html',
  styleUrls: ['./create-bb.component.scss'],
  providers: [MessageService,ConfirmationService]
})

export class CreateBbComponent {


  isloading: boolean = false;
  routeItems: MenuItem[];

  mot: any;
  selectedMod: any;
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
  standard_service: any;
  sow: any;
  pre_requisite_info:any;
  combined_value:any;
  do_s:any;
  don_s:any;
  


  data: any;
  procuctNames: any
  procuctNamesOptions = []
  procuctScopesOptions = []
  procuctCategoryOptions = []
  chargecodeOptions = []
  activeIndex: number = 0;


  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    public MasterTableservice: MasterTableService,private confirmationService: ConfirmationService,
     public CreateBuildingBlockservice: CreateBuildingBlockService,private router: Router) {
    this.breadcrumbService.setItems([
      {
        label: 'Building Blocks',
        routerLink: 'building-block'
      },
      { label: 'Create Building Blocks' },
    ]);
  }
  ngOnInit() {
  
    this.getProdname();
    this.getChargeCode();
    this.getModeOfTransport();

  }

  showDialog() {
    this.visible = true;
  }
  confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to cancel this page?',
        accept: () => {
         this.router.navigateByUrl('/');
        }
    });
}
  
  onCardClick(val) {
    if (val == 'scoping') {
      this.showScopingCrad = true;
      this.showOperationCrad = false;
      this.showCommercialCrad = false;
    }
    if (val == 'operation') {
      this.showScopingCrad = false;
      this.showOperationCrad = true;
      this.showCommercialCrad = false;

    }
    if (val == 'commercial') {
      this.showScopingCrad = false;
      this.showOperationCrad = false;
      this.showCommercialCrad = true;

    }

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
 

// ---------------get product data------------------------//
  getProdname() {
    this.procuctCategoryOptions = [];
    this.MasterTableservice.getProductName().subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctNamesOptions = res?.data;
      }else{
        this.procuctNamesOptions = [];
      }
    })
  }
// ---------------get scope data on product select------------------------//
  onProductSelect(body) {
    this.procuctCategoryOptions = [];
    this.procuctScopesOptions = [];
    this.MasterTableservice.getProductScope(body, this.product_name).subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctScopesOptions = res?.data;
      }else{
        this.procuctScopesOptions = [];
      }

    })

  }
  // ---------------get category data on scope selection------------------------//
  onScopeSelect(body) {
    this.procuctCategoryOptions = [];
    this.MasterTableservice.getProductCategory(body, this.product_scope).subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctCategoryOptions = res?.data;
      }else{
        this.procuctCategoryOptions = [];
      }
    })

  }
  // ---------------get charge code data------------------------//
  getChargeCode() {
    this.MasterTableservice.getChargeCode().subscribe((res: any) => {
      if (res?.message == "success") {
        this.chargecodeOptions = res?.data;
      }
      else{
        this.chargecodeOptions = [];
      }
    })

  }
  // ---------------get mode of transport data------------------------//
  getModeOfTransport(){
    this.MasterTableservice.getModeOfTransport().subscribe((res: any) => {
      if (res?.message == "success") {
        this.mot = res?.data;
      }else{
        this.mot = [];
      }
    })
  }

  // ---------------add building blocks------------------------//

  saveAsDraft() {
    if (this.product_name == '' || this.product_name == null || this.product_name == undefined) {
      return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product name is a required field.`, detail: '' });
    }
    if (this.product_scope == '' || this.product_scope == null || this.product_scope == undefined) {
        return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product scope is a required field.`, detail: '' });
    }
    if (this.product_category == '' || this.product_category == null || this.product_category == undefined) {
        return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product category is a required field.`, detail: '' });
    }
    if (this.building_block_name == '' || this.building_block_name == null || this.building_block_name == undefined) {
        return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Building block is a required field.`, detail: '' });
    }
    if(this.selectedMod == "" || this.selectedMod == undefined || this.selectedMod == null){
    var mod = []
    }else{
      mod = this.selectedMod.map(id => ({ id }))
    }
    this.isloading = true
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
      modeOfTransport: mod
      ,
      scopingCard: {
        serviceDescription: this.seervice_desc,
        customerRequirment: this.customer_requirement,
        deliverable: this.deliverables,
        stakeHolder: this.stakeholders_audience,
        valueToPsaBdp: this.value_to_psa_bdp,
        parameter: this.parameters,
        configurable: this.configurables,
      },
      operationsCard: {
        card: ""
      },
      commercialCard: {
        serviceDescription: this.configurables,
        customerRequirment: this.configurables,
        psaBdpValueStatement: this.value_to_psa_bdp,
        standardService: this.standard_service
      }
      

    }
    this.CreateBuildingBlockservice.createBuildingBlock(body).subscribe(
      (res) => {
        console.log('Draft saved successfully:', res);
  
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Building block draft is saved successfully.'
        });
      },
      (error) => {
        console.error('Error saving draft:', error);
  
        this.messageService.add({
          key: 'errorToast',
          severity: 'error',
          summary: 'Error!',
          detail: 'Failed to save building block draft.'
        });
      }
    );
  

  }

}
