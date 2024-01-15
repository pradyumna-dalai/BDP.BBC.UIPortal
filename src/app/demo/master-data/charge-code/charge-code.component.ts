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
  editMode: boolean = false;
  modeTitle: string = 'Add';

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,private fb: FormBuilder,
     private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'ChargeCode' }
    ]);
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      // Define your form controls here
      id: [''],
      chargeCode: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
    this.fetchAllChargeCodeDetails();
  }
  showDialog() {
    this.visibleDialog = true;
    this.myForm.reset({
      status: 'inactive' // Set default value for 'status' on form reset
  });
    this.editMode= false;
    this.modeTitle = 'Add';
  }
  onCancel(){
    this.visibleDialog = false;
    this.myForm.reset({
      status: 'inactive' // Set default value for 'status' on form reset
  });
    this.editMode= false;
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

 
  editChargecode(editId) {
    const selectedItem = this.chargeCodedetails.find(item => item.id === editId);

    if (selectedItem) {
        this.myForm.setValue({
            id: selectedItem.id,
            chargeCode: selectedItem.chargeCode_name,
            description: selectedItem.description,
            status: selectedItem.status ? 'active' : 'inactive',
        });

        // Set the mode and title for Edit
        this.modeTitle = 'Edit';

        // Set editMode to true before opening the dialog
        this.editMode = true;

        // Use a timeout to ensure that the form value is set before opening the dialog
        setTimeout(() => {
            this.visibleDialog = true;
        });
    }
}
SaveChargecode() {
  const statusValue = this.myForm.get('status').value;
  const isStatusActive = statusValue === 'active';
  const body = {
      id: this.myForm.get('id').value || '',
      name: this.myForm.get('chargeCode').value,
      description: this.myForm.get('description').value,
      status: isStatusActive,
      isDeleted: false
  };

  if (this.editMode) {
      // Editing an existing charge code
      this.masterDataService.editChargecode(body).subscribe(
          (res) => {
              this.handleSuccess();
          },
          (error) => {
              this.handleError();
          }
      );
  } else {
    this.modeTitle = 'Add';
      // Adding a new charge code
      this.masterDataService.addChargecode(body).subscribe(
          (res) => {
              this.handleSuccess();
          },
          (error) => {
              this.handleError();
          }
      );
  }
}
private handleSuccess() {
  const successMessage = this.editMode ? 'Charge Code Updated Successfully.' : 'Charge Code Added Successfully.';
  
  this.messageService.add({
      key: 'successToast',
      severity: 'success',
      summary: 'Success!',
      detail: successMessage
  });

  this.myForm.reset({
      status: 'inactive' // Set default value for 'status' on form reset
  });
  this.editMode= false;

  this.visibleDialog = false;
  this.fetchAllChargeCodeDetails(); // Fetch updated data
}

private handleError() {
  this.messageService.add({
      key: 'errorToast',
      severity: 'error',
      summary: 'Error!',
      detail: this.editMode ? 'Failed To Update Charge Code.' : 'Failed to save Charge Code.'
  });
}

  // ... Other methods in your component
}
