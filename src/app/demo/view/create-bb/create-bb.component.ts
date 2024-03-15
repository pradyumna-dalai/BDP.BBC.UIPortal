import { Component, ViewChild } from '@angular/core';
import { AppBreadcrumbService } from '../../../app.breadcrumb.service';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { MasterTableService } from './../../../services/master-table.service';
import { CreateBuildingBlockService } from './../../../services/create-buildingBlock/create-building-block.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';


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
  
  product_scope: any = '';
  product_category: any = '';
  building_block_name: any
  charge_code: any;

  showScopingCrad: boolean = true;
  showCommercialCrad: boolean = false;
  showOperationCrad: boolean = false;
  visibleSC: boolean = false;
  visibleCC: boolean = false;
  visibleOperationBox: boolean = false;
  product_name: any;
  selected: boolean = true;

  seervice_desc: any;
  //cservice_desc: any;
  value_to_psa_bdp: any;
  customer_requirement: any;
  cvalue_to_psa_bdp: any;
  parameters: any;
  deliverables: any;
  stakeholders_audience: any;
  configurables: any;
  standard_service: any;
  sow: string = '';
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
  excelDataSheet2: any;
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
  standard_service_error: any;
  dos_error: any;
  sow_error: any;
  combined_value_error: any;
  donts_error: any;
  configurables_error: any;
  pre_requisite_info_error: any;
  service_desc_error: any;
  customer_requirement_error: any;
  cvalue_to_psa_bdp_error: any;
  blockId: any;
  operationDocId: any;
  operationDocName: any;
  showDownload: boolean = false;
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    public MasterTableservice: MasterTableService, private confirmationService: ConfirmationService,
    public CreateBuildingBlockservice: CreateBuildingBlockService, private router: Router, private httpClient: HttpClient,
    private route: ActivatedRoute, private createBuildingBlockservice: CreateBuildingBlockService, private sanitizer: DomSanitizer) {
    //  this.fetchBuildingBlockDetails('id');
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null && id !== undefined) {
      this.blockId=id;
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

    this.downloadOperationCardExcel();
  }

  onCancelClickSC() {
    this.showUploaderror = false;
    this.uploadError = "";
    this.fileNameSC = "";
    this.uploadFilesc = null;
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  onCancelClickCC() {
    this.showUploaderror = false;
    this.uploadError = "";
    this.fileNameCC = "";
    this.uploadFilecc = null;
    // Reset the file input value
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onUploadSCExcel(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileNameSC = file.name;
      const formData = new FormData();
      formData.append("file", file);
      this.uploadFilesc = file;
    }
  }
  uploadFilesc: File | null = null;
  makeScopingCardApiServiceCall() {
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
          this.seervice_desc = this.excelData['Scoping Card']['Service Description'];
          this.value_to_psa_bdp = this.excelData['Scoping Card']["Value to PSA BDP"];
          this.customer_requirement = this.excelData['Scoping Card']["Customer Requirements"];
          this.parameters = this.excelData['Scoping Card']["Parameters"];
          this.deliverables = this.excelData['Scoping Card']["Deliverables"];
          this.configurables = this.excelData['Scoping Card']["Configurable"];
          this.stakeholders_audience = this.excelData['Scoping Card']["Stakeholders / Audience"];
          // ... (similar updates for other variables)

          this.visibleSC = false;
          this.onPopupCancelSCClick();
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
          // Reset the file input value
          const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        }
        else {
        }
      },
      (error) => {

        if (error.status === 400) {
          if (error.error?.data) {
   
            if (error.error?.data['Scoping Card']?.Message === 'All Fields Are Empty') {

              this.uploadError = 'All fields are empty.';
            }
            if (error.error?.data === 'please upload scoping card excel file') {

              this.uploadError = 'Please upload scoping card excel file';
            }  
          }
          this.showUploaderror = true;
        } else {
          // Handle other errors accordingly
        }

        // Reset the upload screen
        this.resetUploadScreen();
        this.uploadInProgress = false;
      }
    );
  }
  onPopupCancelSCClick() {
    this.visibleSC = false;
    this.showUploaderror = false;
    this.uploadError = "";
    this.fileNameSC = "";
    this.uploadFilesc = null;
    // Add the following line to reset the file input
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input value
    }
  }
  uploadFilecc: File | null = null;
  onUploadCCExcel(event) {

    const file: File = event.target.files[0];
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
        this.resetErrorVariables();
        if (res?.message === 'Excel Upload Sucessfully') {
          this.excelDataSheet1 = res?.data?.['General Information']
          this.excelDataSheet2 = res?.data?.['Commercial Reference']


          this.standard_service = this.excelDataSheet2['Standard Service'];
          this.sow = this.excelDataSheet2['SOW'];
          this.pre_requisite_info = this.excelDataSheet2['Prerequisite Information'];
          this.combined_value = this.excelDataSheet2['Combined Value'];
          this.do_s = this.excelDataSheet2["Do's"];
          this.don_s = this.excelDataSheet2["Don'ts"];
          this.configurables = this.excelDataSheet2['Configurable'];

          this.seervice_desc = this.excelDataSheet1['Service Description'];
          this.customer_requirement = this.excelDataSheet1['Customer Requirements'];
          this.cvalue_to_psa_bdp = this.excelDataSheet1['PSA BDP Value Statement'];

          this.visibleCC = false;
          this.onPopupCancelCClick();
          this.resetUploadScreen();
          this.uploadInProgress = false;
          this.showUploaderror = false;
          this.messageService.add({
            key: 'successToast',
            severity: 'success',
            summary: 'Success!',
            detail: 'Excel Uploaded successfully.'
          });
          const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        } else {
      
        }
         
      },
      (error) => {
         this.resetErrorVariables();
        // Handle HTTP errors here
        if (error.status === 400) {
          if (error.error && error.error.data) {
            const commercialReferenceErrors = error.error.data['Commercial Reference'];
            const generalInformationErrors = error.error.data['General Information'];
            
            if(error.error?.data['Commercial Reference']?.Message === 'All Fields Are Empty' || error.error?.data['General Information']?.Message){
              this.uploadError = 'All Fields Are Empty';
            }
            if (error.error?.data == 'Please upload commercial card excel file') {
              this.uploadError = 'Please upload commercial card excel file';
            }
            
            

            // Display errors for Commercial Reference
            this.displayErrors(commercialReferenceErrors, 'Commercial Reference');
            
            // Display errors for General Information
            this.displayErrors(generalInformationErrors, 'General Information');
            
            // Set showUploaderror to true to display the error in the UI
            this.showUploaderror = true;
          }
          
          
        }
         else {
          // Handle other errors accordingly
        }

        // Reset the upload screen
        this.resetUploadScreen();
        this.uploadInProgress = false;
      }
    );

  }
  resetErrorVariables() {
    this.standard_service_error = '';
    this.dos_error = '';
    this.sow_error = '';
    this.combined_value_error = ''; 
    this.donts_error = '';
    this.configurables_error = '';
    this.pre_requisite_info_error = '';
    this.service_desc_error = '';
    this.customer_requirement_error = '';
    this.cvalue_to_psa_bdp_error = '';
    this.uploadError = ''; // Reset upload error as well
}
  
  displayErrors(errors: any, sheet: string) {
    if (errors) {
      Object.keys(errors).forEach(key => {
        const errorKey = `${key}_error`;
        const errorMessage = ` ${errors[key]}`;
        // Set error message for each field
        switch(key) {
          case 'Standard Service':
            this.standard_service_error = errorMessage;
            break;
          case 'Dos':
            this.dos_error = errorMessage;
            break;
          case 'SOW':
            this.sow_error = errorMessage;
            break;
          case 'Combined Value':
            this.combined_value_error = errorMessage;
            break;
          case "Don'ts":
            this.donts_error = errorMessage;
            break;
          case 'Configurable':
            this.configurables_error = errorMessage;
            break;
          case 'Prerequisite Information':
            this.pre_requisite_info_error = errorMessage;
            break;
          case 'Service Description':
            this.service_desc_error = errorMessage;
            break;
          case 'Customer Requirements':
            this.customer_requirement_error = errorMessage;
            break;
          case 'PSA BDP Value Statement':
            this.cvalue_to_psa_bdp_error = errorMessage;
            break;
          default:
            break;
        }
      });
    }
}
  onPopupCancelCClick() {
    this.visibleCC = false;
    this.showUploaderror = false;
    this.uploadError = "";
    this.fileNameCC = "";
    this.uploadFilecc = null;
    // Reset the file input value
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  downloadSampleSCExcel(event: Event) {
    event.preventDefault();

    this.createBuildingBlockservice.downloadSamplescExcel().subscribe((res: any) => {
      // Assuming the response contains the file content
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Creating an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'ScopingCard.xlsx';
      document.body.appendChild(link);

      // Triggering the download
      link.click();

      // Removing the anchor element
      document.body.removeChild(link);
      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Sample Excel Downloaded successfully.'
      });
    });
  }
  downloadSampleCCExcel(event: Event) {
    event.preventDefault();

    this.createBuildingBlockservice.downloadSampleCCExcel().subscribe((res: any) => {
      // Assuming the response contains the file content
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Creating an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'CommercialCard.xlsx';
      document.body.appendChild(link);

      // Triggering the download
      link.click();

      // Removing the anchor element
      document.body.removeChild(link);
      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Sample Excel Downloaded successfully.'
      });
    });
  }

  resetUploadScreen() {

    this.uploadedFiles = [];

  }

  showDialogScopingCard() {
    this.visibleSC = true;
    this.showUploaderror = false;
    this.onCancelClickSC();

  }
  showDialogCommercialCard() {
    this.visibleCC = true;
    this.showUploaderror = false;
    this.onCancelClickCC();
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
      this.downloadOperationCardExcel();

    }
    if (val == 'commercial') {
      this.showScopingCrad = false;
      this.showOperationCrad = false;
      this.showCommercialCrad = true;

    }

  }

  onContinueOp(){
    this.showScopingCrad = false;
    this.showOperationCrad = true;
    this.showCommercialCrad = false;
    this.downloadOperationCardExcel();
    if(!this.blockId){
      this.saveAsDraft();
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
        this.chargecodeOptions = res?.data; // Assign the chargeCode array
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
    if (this.blockId) {
      return this.updateBuildingBlock();
  }
    this.buildingBlockId = this.route.snapshot.paramMap.get('id');
    let errorMessages: string[] = [];
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
        configurable: this.configurables || ''
      },

    }
    this.CreateBuildingBlockservice.saveEditBuildingBlocks(1, body).subscribe(
      (res) => {
        this.blockId = res.data?.id;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Building block draft is saved successfully.'
        });
        setTimeout(() => {
          //    this.router.navigateByUrl('/building-block');
        }, 1000);
      },
      (error) => {
        if (error && error.status === 400) {
          const errorMessage = error.error?.message;
          const data = error.error?.data;
          if (data && data.length > 0) {
            this.formattedErrors = data.join('\n');
          }
          if (data && data.includes('Block name exist')) {
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
              detail: data || 'Failed to save building block Draft.'

            });
          }
        }
      }
    );


  }
  updateBuildingBlock() {
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
    const body = 

    {
      id: this.blockId,
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
        configurable: this.configurables || ''
      },

    }

    this.CreateBuildingBlockservice.saveEditBuildingBlocks(1, body).subscribe(
        (res) => {
            this.messageService.add({
                key: 'successToast',
                severity: 'success',
                summary: 'Success!',
                detail: 'Building block draft is updated successfully.'
            });
        },
        (error) => {
            if (error && error.status === 400) {
                const errorMessage = error.error?.message;
                const data = error.error?.data;
                // Handle errors...
            }
        }
    );
}

  private fetchBuildingBlockDetails(id: any): void {
    this.createBuildingBlockservice.getBuildingBlockDetails(id).subscribe(
      (details) => {

        this.status = details.data.status.id;
        this.building_block_name = details.data.name;
        this.product_name = details.data.product.id;
        this.product_scope = details.data.scope.id;
        this.product_category = details.data.category.id;
        this.onProductSelectbyid(details.data.product.id);
        this.onScopeSelectbyid(details.data.scope.id);
        this.charge_code = details.data.chargeCode?.id;
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
        this.configurables = details.data.commercialCard.configurable;
        this.selectedMod = details.data.modeOfTransport.map((item) => item.id);
        this.operationDocId = details.data.operationsCard?.id;
        this.operationDocName = details.data.operationsCard?.name;
        this.showDownload = details.data.operationsCard !== null; 


      },
      // (error) => {
      //   console.error('Error fetching building block details:', error);
      // }
    );
  }
  onProductSelectbyid(body) {
    //  this.procuctCategoryOptions = [];
    this.MasterTableservice.getProductScope(body, this.product_name).subscribe((res: any) => {
        if (res?.message === "success") {
            this.procuctScopesOptions = res.data;

            if (this.product_scope) {
                this.product_scope = this.procuctScopesOptions.find(scope => scope.id === this.product_scope)?.id;
                this.onScopeSelectbyid(this.product_scope);
            }
        } else {
            this.procuctScopesOptions = [];
        }
    });
}

onScopeSelectbyid(body) {
  // this.procuctCategoryOptions = [];
  this.MasterTableservice.getProductCategory(body, this.product_scope).subscribe((res: any) => {
      if (res?.message === "success") {
          this.procuctCategoryOptions = res.data;
          // Auto-select the category if available
          if (this.product_category) {
              const selectedCategory = this.procuctCategoryOptions.find(category => category.id === this.product_category);
              this.product_category = selectedCategory ? selectedCategory.id : null;
             
          }
      } else {
          this.procuctCategoryOptions = [];
      }
  });
}

  saveAsBuildingBlock() {
  if(this.blockId == null || this.blockId == undefined){
    this.buildingBlockId = this.route.snapshot.paramMap.get('id');
  }else{
    this.buildingBlockId = this.blockId;
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
        configurable: this.configurables || ''
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

        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Building block is saved successfully.'
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
         
        }
      }
    );

  }

  isSaveAsDraftDisabled(): boolean {
    return this.status === 2;
  }


  //--------------------operation Card Details----------------//
  downloadSampleOpExcel(event: Event) {
    event.preventDefault();

    this.createBuildingBlockservice.downloadSampleOPExcel().subscribe((res: any) => {
      // Assuming the response contains the file content
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Creating an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'OperationCard.xlsx';
      document.body.appendChild(link);

      // Triggering the download
      link.click();

      // Removing the anchor element
      document.body.removeChild(link);
      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Sample Excel Downloaded successfully.'
      });
    });
  }
  showDialogOperationCard() {
    this.visibleOperationBox = true;
    this.showUploaderror = false;
    this.onRemoveOperationClick();

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
      this.fileNameOC = this.operationDocName;
    }
  }

  onRemoveOperationClick() {
    this.showUploaderror = false;
    this.fileNameOC = "";
    this.selectedFile = null;
  }
  showSuccessMessage(message: string) {
    this.messageService.add({ key: 'successToast', severity: 'success', summary: 'Success', detail: message });
  }

  showErrorMessage(message: string) {
    this.messageService.add({ key: 'errorToast', severity: 'error', summary: 'Error', detail: message });
}

  onUploadClick(event: any): void {
    if (this.selectedFile) {
        const fileName: string = this.selectedFile.name;
        const fileExtension: string = fileName.split('.').pop()?.toLowerCase() || '';

        // Check if the file extension is Excel
        if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            const scopeId = 1;
            const entityId = this.blockId;
            this.readExcelFile(this.selectedFile);
            this.visibleOperationBox = false;

            this.createBuildingBlockservice.operationCardUploadExcel(this.selectedFile, scopeId, entityId).subscribe(
                (res: any) => {
                    if (res?.message === 'success') {
                        this.fileNameOC = "";
                        this.selectedFile = null;
                        this.showSuccessMessage('File uploaded successfully!');

                        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
                        if (fileInput) {
                          fileInput.value = '';
                        }
                    } else {
                        // Handle other responses if needed
                    }
                },
                (error) => {
                    console.error('Error uploading file:', error);
                }
            );
        } else {
            this.showErrorMessage('Only Excel files (.xlsx) are allowed!');
        }
    } else {
    }
}

  //----------------------------------------------------------------------------------//
  downloadOperationCardExcelFile() {
    if (this.operationDocId != null) {
      this.createBuildingBlockservice.downloadUploadedOperationCard(this.operationDocId).subscribe(
        (data: ArrayBuffer) => {
          const blob = new Blob([data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          //link.download = 'downloaded_file.xlsx';
          link.download = this.operationDocName;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
    } else {
      console.error('Operation Card is null or undefined.');
    }
  }

  //-----------------------------------download for view of files-------------------------//
  downloadOperationCardExcel() {
    if (this.operationDocId != null && this.operationDocName != null) {
      this.createBuildingBlockservice.downloadUploadedOperationCard(this.operationDocId).subscribe(
        (data: ArrayBuffer) => {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          this.excelDataOpration = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
    } else {
   //   console.error('Operation Card ID or Name is null or undefined.');
    }
  }

  //-----------------------------------end--------------------------------------------//
}  