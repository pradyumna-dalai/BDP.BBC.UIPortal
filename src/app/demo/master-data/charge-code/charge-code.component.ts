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

 
  editChargecode(editId) {
    const selectedItem = this.chargeCodedetails.find(item => item.id === editId);
  
    if (selectedItem) {
      this.myForm.setValue({
        id: selectedItem.id,
        chargeCode: selectedItem.chargeCode_name,
        description: selectedItem.description,
        status: selectedItem.status,
      });
  
      // Check the 'status' value and set the corresponding radio button
      const statusControl = this.myForm.get('status');
      if (statusControl.value === 'active') {
        statusControl.setValue('active');
      } else if (statusControl.value === 'inactive') {
        statusControl.setValue('inactive');
      }
  
      this.editMode = true;
      this.visibleDialog = true;
      // Set the mode and title for Edit
      this.modeTitle = 'Edit';
    }
  }
  SaveChargecode() {
    const body = {
      id: this.myForm.get('id').value || '',
      name: this.myForm.get('chargeCode').value,
      description: this.myForm.get('description').value,
      status: this.myForm.get('status').value,
      isDeleted: false
    };

    if (this.editMode) {
      // Editing an existing charge code
      this.masterDataService.editChargecode(body).subscribe(
        (res) => {
          this.visibleDialog = false;
          this.messageService.add({
            key: 'successToast',
            severity: 'success',
            summary: 'Success!',
            detail: 'Charge Code Is Updated Successfully.'
          });
          
            this.myForm.reset(); // Reset the form on success
            this.fetchAllChargeCodeDetails(); // Fetch updated data
        },
        (error) => {

          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Failed To Update Charge Code.'
          });
        }
      );
    } else {
      // Adding a new charge code
      this.masterDataService.addChargecode(body).subscribe(
        (res) => {
          this.visibleDialog = false;
          this.messageService.add({
            key: 'successToast',
            severity: 'success',
            summary: 'Success!',
            detail: 'Charge Code is saved Successfully.'
          });
          this.myForm.reset(); // Reset the form on success
          this.fetchAllChargeCodeDetails(); // Fetch updated data
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

    this.editMode = false;
  }

  // ... Other methods in your component
}
