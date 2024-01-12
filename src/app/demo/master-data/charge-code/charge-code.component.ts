import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-charge-code',
  templateUrl: './charge-code.component.html',
  styleUrls: ['./charge-code.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ChargeCodeComponent {

  visibleDialog: boolean = false;
  chargeCode: string = '';
  description: string = '';
  status: string = '';
  myForm: FormGroup;
  ingredient!: string;
  chargeCodedetails: any;
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,private fb: FormBuilder,
     private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'ChargeCode' }
    ]);
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      // Define your form controls here
      chargeCode: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
    });
    this.fetchAllChargeCodeDetails();
  }
  showDialog() {
    this.visibleDialog = true;
  }
  onCancel(){
    this.visibleDialog = false;
  }
  fetchAllChargeCodeDetails() {
    this.masterDataService.getAllChargecode().subscribe((res: any) => {
      if (res?.message == "success") {
        this.chargeCodedetails = res.data.chargeCode.map((item: any) => {
          return {
            id: item.id, 
            chargeCode_name: item.name,
            description: item.description,
            status: item.status

          };
        });
       // console.log("djdsf",this.locationdetails);
      } else {
        this.chargeCodedetails = [];
      }
    });
  }

  SaveChargecode() { 
    const body = 
    {
      id: "",
      name: this.myForm.get('chargeCode').value,
      description: this.myForm.get('description').value, 
      status: this.myForm.get('status').value,
      isDeleted: false
    }
      this.masterDataService.addChargecode(body).subscribe(
      (res) => {
        this.visibleDialog = false;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Charge Code is saved Successfully.'
        });
      },
      (error) => {
        console.error('Error saving draft:', error);

        this.messageService.add({
          key: 'errorToast',
          severity: 'error',
          summary: 'Error!',
          detail: 'Failed to save Charge Code.'
        });
      }
    );
  }
  editChargecode(editId) {
    // Retrieve details of the selected item using editId
    const selectedItem = this.chargeCodedetails.find(item => item.id === editId);
  
    // Check if the item is found
    if (selectedItem) {
      // Populate form fields with retrieved values
      this.myForm.setValue({
        chargeCode: selectedItem.chargeCode_name,
        description: selectedItem.description,
        status: selectedItem.status
      });
  
      // Open the dialog
      this.visibleDialog = true;
    }
  }
}
