import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service';
import { CreateBuildingBlockService } from './../../../services/create-buildingBlock/create-building-block.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';


@Component({
  selector: 'app-create-bb',
  templateUrl: './create-bb.component.html',
  styleUrls: ['./create-bb.component.scss'],
  providers: [MessageService, ConfirmationService]
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
  visibleSC: boolean = false;
  visibleCC: boolean = false;
  product_name: any;
  selected: boolean = true;

  seervice_desc: any;
  //cservice_desc: any;
  value_to_psa_bdp: any;
  customer_requirement: any;
  cvalue_to_psa_bdp: any;
  cconfigurables: any;
  parameters: any;
  deliverables: any;
  stakeholders_audience: any;
  configurables: any;
  standard_service: any;
  sow: string='';
  pre_requisite_info: any;
  combined_value: any;
  do_s: any;
  don_s: any;
  status: any;
  data: any;
  procuctNames: any
  procuctNamesOptions = []
  procuctScopesOptions = []
  procuctCategoryOptions = []
  chargecodeOptions = []
  activeIndex: number = 0;
  isEditMode: boolean = false;
  buildingBlockId: string | null = null;
  formattedErrors: any;

  uploadedFiles: any[] = [];
  uploadInProgress: boolean = false;
  excelData: any;
  excelDataSheet2:any;
  excelDataSheet1: any;
  showUploaderror: boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    public MasterTableservice: MasterTableService, private confirmationService: ConfirmationService,
    public CreateBuildingBlockservice: CreateBuildingBlockService, private router: Router,private httpClient: HttpClient,
    private route: ActivatedRoute, private createBuildingBlockservice: CreateBuildingBlockService, private sanitizer: DomSanitizer) {
      this.fetchBuildingBlockDetails('id');
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null && id !== undefined) {
      this.breadcrumbService.setItems([
        {
          label: 'Building Blocks',
          routerLink: 'building-block'
        },
        { label: 'Edit Building Blocks' },
      ]);
      this.fetchBuildingBlockDetails(id);
    } else {
      this.breadcrumbService.setItems([
        {
          label: 'Building Blocks',
          routerLink: 'building-block'
        },
        { label: 'Create Building Blocks' },
      ]);
    }

  }


  ngOnInit() {

    this.getProdname();
    this.getChargeCode();
    this.getModeOfTransport();

  }
 
onUploadSCExcel(event: any) {
  for (const file of event.files) {
    this.uploadedFiles.push(file);
  }
  this.makeScopingCardApiServiceCall();
}
  onUploadCCExcel(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
   this.makeCommercialCardApiServiceCall();
}

makeScopingCardApiServiceCall() {
  this.uploadInProgress = true;
  const formData: FormData = new FormData();
  formData.append('file', this.uploadedFiles[0]);
  this.createBuildingBlockservice.scopingCradImportExcel(formData).subscribe(
    (res: any) => {
      if (res?.message === 'Excel Upload Successfully') {
        // Process successful response

        // Update UI variables with the response data
        this.seervice_desc = this.excelData['Service Description'];
        this.value_to_psa_bdp = this.excelData["Value to PSA BDP"];
        this.customer_requirement = this.excelData["Customer Requirements"];
        this.parameters = this.excelData["Parameters"];
        this.deliverables = this.excelData["Deliverables"];
        this.configurables = this.excelData["Configurable"];
        this.stakeholders_audience = this.excelData["Stakeholders / Audience"];
        // ... (similar updates for other variables)

        this.visibleSC = false;
        // Reset the upload screen
        this.resetUploadScreen();
        this.uploadInProgress = false;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Excel Uploaded successfully.'
        });
      } else {
        console.log('Unexpected response:', res);
      }
    },
    (error) => {
      // Handle HTTP errors here
      if (error.status === 400) {
        console.log('Bad Request Error:', error);
        // Additional handling or user feedback for 400 errors
        this.uploadInProgress = false;
        this.showUploaderror = true;
        this.messageService.add({
          key: 'errorToast',
          severity: 'error',
          summary: 'Error!',
          detail: 'Maximum field length exceeding 1000 character.'
        });
        return; 
      } else {
        console.log('Unexpected Error:', error);
        // Handle other errors accordingly
      }

      // Reset the upload screen
      this.resetUploadScreen();
      this.uploadInProgress = false;
    }
  );
}


makeCommercialCardApiServiceCall() {
  this.uploadInProgress = true;
  const formData: FormData = new FormData();
  formData.append('file', this.uploadedFiles[0]);
  this.createBuildingBlockservice.commercialCradImportExcel(formData).subscribe(
    (res: any) => {
      if (res?.message === 'Excel Upload Successfully') {
        // Process successful response

        this.excelDataSheet2 = res?.data.Sheet2;
        this.excelDataSheet1 = res?.data.Sheet1;

        // Update UI variables with the response data for Sheet2
        this.standard_service = this.excelDataSheet2['Standard Service'];
        this.sow = this.excelDataSheet2['SOW'];
        this.pre_requisite_info = this.excelDataSheet2['Pre-requsites information'];
        this.combined_value = this.excelDataSheet2['Combined Value'];
        this.do_s = this.excelDataSheet2['Dos'];
        this.don_s = this.excelDataSheet2["Don'ts"];
        this.cconfigurables = this.excelDataSheet2['Configurable'];

        // Update UI variables with the response data for Sheet1
        this.seervice_desc = this.excelDataSheet1['Service Description'];
        this.customer_requirement = this.excelDataSheet1['Customer Requirements'];
        this.cvalue_to_psa_bdp = this.excelDataSheet1['PSA BDP Value Statement'];

        this.visibleCC = false;
        // Reset the upload screen
        this.resetUploadScreen();
        this.uploadInProgress = false;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Excel Uploaded successfully.'
        });
      } else {
        console.log('Unexpected response:', res);
      }
    },
    (error) => {
      // Handle HTTP errors here
      if (error.status === 400) {
        console.log('Bad Request Error:', error);
        // Additional handling or user feedback for 400 errors
        this.uploadInProgress = false;
        this.messageService.add({
          key: 'errorToast',
          severity: 'error',
          summary: 'Error!',
          detail: 'Maximum field length exceeding 1000 character.'
        });
        return; 
      } else {
        console.log('Unexpected Error:', error);
        // Handle other errors accordingly
      }

      // Reset the upload screen
      this.resetUploadScreen();
      this.uploadInProgress = false;
    }
  );
}

resetUploadScreen() {

  this.uploadedFiles = [];
  
}

showDialogScopingCard() {
    this.visibleSC = true;
  }
showDialogCommercialCard() {
  this.visibleCC = true;
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

  // Use a regular expression to check if the content contains only spaces or empty <p> tags
  isEditorContentValid(content: string): boolean {
    const onlySpacesOrEmptyPTag = /^(\s*<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>\s*)*$/;
    return !onlySpacesOrEmptyPTag.test(content);
  }
  
  

  // ---------------get product data------------------------//
  getProdname() {
    this.procuctCategoryOptions = [];
    this.MasterTableservice.getProductName().subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctNamesOptions = res?.data;
      } else {
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
      } else {
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
      } else {
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
      else {
        this.chargecodeOptions = [];
      }
    })

  }
  // ---------------get mode of transport data------------------------//
  getModeOfTransport() {
    this.MasterTableservice.getModeOfTransport().subscribe((res: any) => {
      if (res?.message == "success") {
        this.mot = res?.data;
      } else {
        this.mot = [];
      }
    })
  }

  // ---------------add building blocks------------------------//

  saveAsDraft() {
    this.buildingBlockId = this.route.snapshot.paramMap.get('id');
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
    if (this.selectedMod == "" || this.selectedMod == undefined || this.selectedMod == null) {
      var mod = []
    } else {
      mod = this.selectedMod.map(id => ({ id }))
    }
    this.isloading = true
    const body =

    {
      id: this.buildingBlockId,
      name: this.building_block_name,
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
        customerRequirement: this.customer_requirement,
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
        serviceDescription: this.seervice_desc,
        customerRequirement: this.customer_requirement,
        psaBdpValueStatement: this.cvalue_to_psa_bdp,
        standardService: this.standard_service,
        sow: this.sow,
        prerequisiteInfo: this.pre_requisite_info,
        combinedValue: this.combined_value,
        dos: this.do_s,
        donts: this.don_s,
        configurable: this.cconfigurables
      }

    }
    if (!this.isEditorContentValid(body.scopingCard.serviceDescription)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid service description. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.scopingCard.customerRequirement)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Customer Requirement. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.scopingCard.deliverable)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Deliverable. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.scopingCard.stakeHolder)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid StakeHolder. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.scopingCard.valueToPsaBdp)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid valueToPsaBdp. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.scopingCard.parameter)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Parameter. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.scopingCard.configurable)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Parameter. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.psaBdpValueStatement)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid PsaBdpValueStatement in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.standardService)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Standard Service in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.sow)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid SOW in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.prerequisiteInfo)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid PrerequisiteInfo in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.combinedValue)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid CombinedValue in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.dos)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Dos in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    if (!this.isEditorContentValid(body.commercialCard.donts)) {                                                  
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Invalid Donts in Commercial Card. Please enter meaningful content.'
      });
      return; 
    }
    this.CreateBuildingBlockservice.saveEditBuildingBlocks(1, body).subscribe(
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

        if (error && error.status === 400) {
          const errorMessage = error.error?.message;
          const data = error.error?.data;
          console.log('error', errorMessage)
          console.log('error', data)
          if (data && data.includes('Block name exist')) {
            // Handle the case where the block name already exists
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Building block name already exists. Please choose a different name.'
            });
          } else if (errorMessage === 'Fill required field(s)') {
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Fill required field(s).'
            });
          } else {
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Failed to save building block draft.'
            });
          }
        } else {
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Failed to save building block draft.'
          });
        }
      }
    );


  }


  private fetchBuildingBlockDetails(id: any): void {
    this.createBuildingBlockservice.getBuildingBlockDetails(id).subscribe(
      (details) => {
        // Assign details to component properties
        this.status = details.data.status.id;
        this.building_block_name = details.data.name;
        this.product_name = details.data.product.id;
        this.product_scope = details.data.scope.id;
        this.product_category = details.data.category.id;
        this.onProductSelect(details.data.product.id);
        this.onScopeSelect(details.data.scope.id);
        this.charge_code = details.data?.chargeCode?.id;
        this.seervice_desc = details.data.scopingCard.serviceDescription;
        this.customer_requirement = details.data.scopingCard.customerRequirement;
        this.deliverables = details.data.scopingCard.deliverable;
        this.stakeholders_audience = details.data.scopingCard.stakeHolder;
        this.value_to_psa_bdp = details.data.scopingCard.valueToPsaBdp;
        this.parameters = details.data.scopingCard.parameter;
        this.configurables = details.data.scopingCard.configurable;
        this.cvalue_to_psa_bdp = details.data.commercialCard.psaBdpValueStatement;
        this.standard_service = details.data.commercialCard.standardService;
        this.sow = details.data.commercialCard.sow;
        this.pre_requisite_info = details.data.commercialCard.prerequisiteInfo;
        this.combined_value = details.data.commercialCard.combinedValue;
        this.do_s = details.data.commercialCard.dos;
        this.don_s = details.data.commercialCard.donts;
        this.cconfigurables = details.data.commercialCard.configurable;
        this.selectedMod = details.data.modeOfTransport.map((item) => item.id);

      },
      (error) => {
        console.error('Error fetching building block details:', error);
      }
    );
  }

  saveAsBuildingBlock() {
    this.buildingBlockId = this.route.snapshot.paramMap.get('id');
    // if (this.product_name == '' || this.product_name == null || this.product_name == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product name is a required field.`, detail: '' });
    // }
    // if (this.product_scope == '' || this.product_scope == null || this.product_scope == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product scope is a required field.`, detail: '' });
    // }
    // if (this.product_category == '' || this.product_category == null || this.product_category == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Product category is a required field.`, detail: '' });
    // }
    // if (this.building_block_name == '' || this.building_block_name == null || this.building_block_name == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Building block is a required field.`, detail: '' });
    // }
    // if (this.seervice_desc == '' || this.seervice_desc == null || this.seervice_desc == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Service Description in Scoping Card is a required field.`, detail: '' });
    // }
    // if (this.customer_requirement == '' || this.customer_requirement == null || this.customer_requirement == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Customer Requirement  in Scoping Card is a required field.`, detail: '' });
    // }
    // if (this.deliverables == '' || this.deliverables == null || this.deliverables == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Deliverables in Scoping Card is a required field.`, detail: '' });
    // }
    // if (this.stakeholders_audience == '' || this.stakeholders_audience == null || this.stakeholders_audience == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Stakeholders Audience in Scoping Card is a required field.`, detail: '' });
    // }
    // if (this.value_to_psa_bdp == '' || this.value_to_psa_bdp == null || this.value_to_psa_bdp == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Value to PSA BDP in Scoping Card is a required field.`, detail: '' });
    // }
    // if (this.parameters == '' || this.parameters == null || this.parameters == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Parameter in Scoping Card  is a required field.`, detail: '' });
    // }
    // if (this.configurables == '' || this.configurables == null || this.configurables == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Configurables in Scoping Card is a required field.`, detail: '' });
    // }
    // if (this.standard_service == '' || this.standard_service == null || this.standard_service == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Standard Service in Commercial Card is a required field.`, detail: '' });
    // }
    // if (this.sow == '' || this.sow == null || this.sow == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Sow in Commercial Card is a required field.`, detail: '' });
    // }
    // if (this.pre_requisite_info == '' || this.pre_requisite_info == null || this.pre_requisite_info == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `PreRequisite Information in Commercial Card is a required field.`, detail: '' });
    // }
    // if (this.combined_value == '' || this.combined_value == null || this.combined_value == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Combined Value in Commercial Card is a required field.`, detail: '' });
    // }
    // if (this.do_s == '' || this.do_s == null || this.do_s == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Do in Commercial Card is a required field.`, detail: '' });
    // }
    // if (this.don_s == '' || this.don_s == null || this.don_s == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Dont's in Commercial Card is a required field.`, detail: '' });
    // }
    // if (this.cconfigurables == '' || this.cconfigurables == null || this.cconfigurables == undefined) {
    //   return this.messageService.add({ key: 'emptyToster', life: 2000, severity: 'error', summary: `Configurables in Commercial Card is a required field.`, detail: '' });
    // }
     if (this.selectedMod == "" || this.selectedMod == undefined || this.selectedMod == null) {
      var mod = []
    } else {
      mod = this.selectedMod.map(id => ({ id }))
    }
    this.isloading = true
    const body =

    {
      id: this.buildingBlockId,
      name: this.building_block_name || '',
      product: {
        id: this.product_name || ''
      },
      scope: {
        id: this.product_scope || ''
      },
      category: {
        id: this.product_category || ''
      },
      chargeCode: {
        id: this.charge_code || ''
      },
      modeOfTransport: mod || []
      ,
      scopingCard: {
        serviceDescription: this.seervice_desc || '',
        customerRequirement: this.customer_requirement || '',
        deliverable: this.deliverables || '',
        stakeHolder: this.stakeholders_audience || '',
        valueToPsaBdp: this.value_to_psa_bdp || '',
        parameter: this.parameters || '',
        configurable: this.configurables || '',
      },
      // operationsCard: {
      //   card: ""
      // },
      commercialCard: {
        serviceDescription: this.seervice_desc || '',
        customerRequirement: this.customer_requirement || '',
        psaBdpValueStatement: this.cvalue_to_psa_bdp || '',
        standardService: this.standard_service || '',
        sow: this.sow || '',
        prerequisiteInfo: this.pre_requisite_info || '',
        combinedValue: this.combined_value || '',
        dos: this.do_s || '',
        donts: this.don_s || '',
        configurable: this.cconfigurables || ''
      },

    }

    this.CreateBuildingBlockservice.saveEditBuildingBlocks(2, body).subscribe(
      (res) => {
        console.log('Building Block saved successfully:', res);

        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'New Building block is saved successfully.'
        });
      },
      (error) => {
        console.error('Error saving draft:', error);

        if (error && error.status === 400) {
          const errorMessage = error.error?.message;
          const data = error.error?.data;
          console.log('error', errorMessage)
          console.log('error', data)
          if (data && data.length > 0) {
            // Join the array of error messages into a formatted string
            this.formattedErrors = data.join('\n');
          }
          if (data && data.includes('Block name exist')) {
            // Handle the case where the block name already exists
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Building block name already exists. Please choose a different name.'
            });
          } else if (errorMessage === 'Fill required field(s)') {
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: this.formattedErrors 
            });
          } else {
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: data || 'Failed to save building block .'
             
            });
          }
          console.log('d',data);
        } 
         else  if (!this.isEditorContentValid(body.scopingCard.serviceDescription)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid service description. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.scopingCard.customerRequirement)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Customer Requirement. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.scopingCard.deliverable)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Deliverable. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.scopingCard.stakeHolder)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid StakeHolder. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.scopingCard.valueToPsaBdp)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid valueToPsaBdp. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.scopingCard.parameter)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Parameter. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.scopingCard.configurable)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Parameter. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.psaBdpValueStatement)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid PsaBdpValueStatement in Commercial Card. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.standardService)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Standard Service in Commercial Card. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.sow)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid SOW in Commercial Card. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.prerequisiteInfo)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid PrerequisiteInfo in Commercial Card. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.combinedValue)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid CombinedValue in Commercial Card. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.dos)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Dos in Commercial Card. Please enter meaningful content.'
          });
          return; 
        }
        else if (!this.isEditorContentValid(body.commercialCard.donts)) {                                                  
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Invalid Donts in Commercial Card. Please enter meaningful content.'
          });
          return; 
        };
      }
    );

  }

  isSaveAsDraftDisabled(): boolean {
    return this.status === 2;
  }

}
