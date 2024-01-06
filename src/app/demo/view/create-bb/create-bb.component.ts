import { Component, ViewChild } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service';
import { CreateBuildingBlockService } from './../../../services/create-buildingBlock/create-building-block.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-bb',
  templateUrl: './create-bb.component.html',
  styleUrls: ['./create-bb.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class CreateBbComponent {

  isloading: boolean = false;
  routeItems: MenuItem[];
  @ViewChild('fileInput') fileInput: any;
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
  visibleOperationBox:boolean=false;
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
  excelDataOpration: any;
  isDataUploaded = false;

  uploadedFiles: any[] = [];
  uploadInProgress: boolean = false;
  excelData: any;
  excelDataSheet2:any;
  excelDataSheet1: any;
  showUploaderror: boolean = false;
  selectedFile: any;
 
  fileNameSC: string;
  fileNameCC: string;
  fileNameOC: string;
  uploadFileOC: null;
  deliverablesError: string;
  valueToPSABDPError: string;
  parametersError: string;
  serviceDescriptionError: string;
  stakeholdersAudienceError: string;
  customerRequirementsError: string;
  configurableError: string;
  uploadError: string;

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
 



onCancelClickSC() {
  this.showUploaderror = false;
  this.uploadError = "";
  this.fileNameSC = "";
  this.uploadFilesc = null;
  
}
onCancelClickCC(){
  this.showUploaderror = false;
  this.uploadError = "";
  this.fileNameCC = "";
  this.uploadFilecc = null;
}

onUploadSCExcel(event: any) {
  const file:File = event.target.files[0];
  if (file) {
      this.fileNameSC = file.name;
      const formData = new FormData();
      formData.append("file", file);
      this.uploadFilesc = file;
  }
}
uploadFilesc: File | null = null;
makeScopingCardApiServiceCall()
 {
  this.fileNameSC = this.uploadFilesc.name;
  const formData = new FormData();
  formData.append("file", this.uploadFilesc);
  this.uploadInProgress = true;
  this.createBuildingBlockservice.scopingCradImportExcel(formData).subscribe(
    (res: any) => {
      
      if (res?.message === 'Excel Upload Sucessfully') {
        // Process successful response
        this.excelData = res?.data;
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
        this.showUploaderror = false;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Excel Uploaded successfully.'
        });
      }
       else {
        console.log('Unexpected response:', res);
      }
    },
    (error) => {
      // Handle HTTP errors here
      if (error.status === 400) {

      console.log('Bad Request Error:', error);
       if (error.error?.data?.message === 'All Field Are Empty') {
          // Handle case where all fields are empty in the uploaded Excel file
          this.showUploaderror = true;
          this.uploadInProgress = false;
          this.uploadError = 'All fields are empty.';
        } else if (error.error?.data) {
          Object.keys(error.error.data).forEach((key) => {
            const maxLength = error.error.data[key];
            switch (key) {
              case 'Deliverables':
                this.deliverablesError = `Deliverables: ${maxLength}`;
                break;
              case 'Value to PSA BDP':
                this.valueToPSABDPError = `Value to PSA BDP: ${maxLength}`;
                break;
              case 'Parameters':
                this.parametersError = `Parameters: ${maxLength}`;
                break;
              case 'Service Description':
                this.serviceDescriptionError = `Service Description: ${maxLength}`;
                break;
              case 'Stakeholders / Audience':
                this.stakeholdersAudienceError = `Stakeholders / Audience: ${maxLength}`;
                break;
              case 'Customer Requirements':
                this.customerRequirementsError = `Customer Requirements: ${maxLength}`;
                break;
              case 'Configurable':
                this.configurableError = `Configurable: ${maxLength}`;
                break;
              // Add additional cases for other fields as needed
              default:
                console.log(`Unhandled field: ${key}`);
                break;
            }
          });
        }

        // Set flag to show error message
        this.showUploaderror = true;
       
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
onPopupCancelSCClick(){
  this.visibleSC = false;
}
uploadFilecc: File | null = null;
onUploadCCExcel(event) 
{

    const file:File = event.target.files[0];
    if (file) {
        this.fileNameCC = file.name;
        const formData = new FormData();
        formData.append("file", file);
        this.uploadFilecc = file;
    }
}
makeCommercialCardApiServiceCall() {

  this.fileNameCC = this.uploadFilecc.name;
  const formData = new FormData();
  formData.append("file", this.uploadFilecc);
  this.uploadInProgress = true;

  this.createBuildingBlockservice.commercialCradImportExcel(formData).subscribe(
    (res: any) => {
      if (res?.message === 'Excel Upload Sucessfully') {
        // Process successful response
        this.excelDataSheet1 = res?.data.sheet1;
        this.excelDataSheet2 = res?.data.sheet2;

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
        this.showUploaderror = false;
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
        this.showUploaderror = true;
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
onPopupCancelCClick(){
  this.visibleCC = false;
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
      if (res?.message === "success") {
        this.chargecodeOptions = res?.data.chargeCode; // Assign the chargeCode array
      } else {
        this.chargecodeOptions = [];
      }
    });
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
    this.CreateBuildingBlockservice.saveEditBuildingBlocks(1, body).subscribe(
      (res) => {
        console.log('Draft saved successfully:', res);

        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Building block draft is saved successfully.'
        });
        setTimeout(() => {
          this.router.navigateByUrl('/building-block');
        }, 1000); 
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
        this.charge_code = details.data.chargeCode?.id;
        this.seervice_desc = details.data.scopingCard.serviceDescription;
    //    console.log("service",this.seervice_desc);
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
      // (error) => {
      //   console.error('Error fetching building block details:', error);
      // }
    );
  }

  saveAsBuildingBlock() {
    this.buildingBlockId = this.route.snapshot.paramMap.get('id');
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
    if (!this.isEditorContentValid(body.scopingCard.serviceDescription) ||
    !this.isEditorContentValid(body.scopingCard.customerRequirement) ||
    !this.isEditorContentValid(body.scopingCard.deliverable) ||
    !this.isEditorContentValid(body.scopingCard.stakeHolder) ||
    !this.isEditorContentValid(body.scopingCard.valueToPsaBdp) ||
    !this.isEditorContentValid(body.scopingCard.parameter) ||
    !this.isEditorContentValid(body.scopingCard.configurable) ||
    !this.isEditorContentValid(body.commercialCard.psaBdpValueStatement) ||
    !this.isEditorContentValid(body.commercialCard.standardService) ||
    !this.isEditorContentValid(body.commercialCard.sow) ||
    !this.isEditorContentValid(body.commercialCard.prerequisiteInfo) ||
    !this.isEditorContentValid(body.commercialCard.combinedValue) ||
    !this.isEditorContentValid(body.commercialCard.dos) ||
    !this.isEditorContentValid(body.commercialCard.donts)) {
  
  this.messageService.add({
    key: 'errorToast',
    severity: 'error',
    summary: 'Error!',
    detail: 'Invalid content. Please enter meaningful content for all fields.'
  });
  return;
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
        setTimeout(() => {
          this.router.navigateByUrl('/building-block');
        }, 1000); 
     
      },
      (error) => {
        console.error('Error saving draft:', error);

        if (error && error.status === 400) {
          const errorMessage = error.error?.message;
          const data = error.error?.data;
          console.log('error', errorMessage)
          console.log('error', data)
          if (data && data.length > 0) {
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
      //    console.log('d',data);
        } 
      }
    );
    // if (!this.isEditorContentValid(body.scopingCard.serviceDescription)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid service description. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.scopingCard.customerRequirement)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Customer Requirement. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.scopingCard.deliverable)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Deliverable. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.scopingCard.stakeHolder)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid StakeHolder. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.scopingCard.valueToPsaBdp)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid valueToPsaBdp. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    // if (!this.isEditorContentValid(body.scopingCard.parameter)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Parameter. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.scopingCard.configurable)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Parameter. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.commercialCard.psaBdpValueStatement)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid PsaBdpValueStatement in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.commercialCard.standardService)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Standard Service in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    // if (!this.isEditorContentValid(body.commercialCard.sow)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid SOW in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.commercialCard.prerequisiteInfo)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid PrerequisiteInfo in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.commercialCard.combinedValue)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid CombinedValue in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    //  if (!this.isEditorContentValid(body.commercialCard.dos)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Dos in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // }
    // if (!this.isEditorContentValid(body.commercialCard.donts)) {                                                  
    //   this.messageService.add({
    //     key: 'errorToast',
    //     severity: 'error',
    //     summary: 'Error!',
    //     detail: 'Invalid Donts in Commercial Card. Please enter meaningful content.'
    //   });
    //   return; 
    // };
  }

  isSaveAsDraftDisabled(): boolean {
    return this.status === 2;
  }


//--------------------operation Card Details----------------//

showDialogOperationCard() {
  this.visibleOperationBox = true;
}

onOperarationCancelClick() {
  this.visibleOperationBox = false;
}

readExcelFile(file: File) {
  const reader: FileReader = new FileReader();
  reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.excelDataOpration = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  };
  reader.readAsArrayBuffer(file);
}

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];

  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileNameOC = this.selectedFile.name;
    };
    reader.readAsDataURL(this.selectedFile);
  } else {
    this.fileNameOC = ""; 
  }
}

onUploadClick() {
  if (this.selectedFile) {
      this.readExcelFile(this.selectedFile);
      this.visibleOperationBox = false;
      console.log('Uploaded Excel Data:', this.excelDataOpration);
      this.isDataUploaded = true;
      this.fileNameOC = "";
      this.showSuccessMessage('File uploaded successfully!');
  } else {
      console.log('No file selected.');
  }
}
onRemoveOperationClick(){
  this.showUploaderror = false;
  this.fileNameOC = "";
 // this.uploadFileOC = null;
 this.selectedFile = null;
}
showSuccessMessage(message: string) {
  this.messageService.add({ key: 'successToast', severity: 'success', summary: 'Success', detail: message });
}

  //---end-----------------------------------------------//
}
