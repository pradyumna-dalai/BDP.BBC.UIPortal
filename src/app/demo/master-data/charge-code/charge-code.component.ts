import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { MomentService } from 'src/app/FormateDate/moment.service';


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
  searchTimeout: any;


  constructor(private momentService: MomentService,private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,private fb: FormBuilder,
     private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Charge Code' }
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
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger'; 
  }
  getSeverityLabel(status: boolean): string {
    return status ? 'Active' : 'Inactive';
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
 
  fetchAllChargeCodeDetails(keyword: string = ''): void {
   

    this.masterDataService.getAllChargecode().subscribe((res: any) => {
        if (res?.message === "success") {
            this.chargeCodedetails = res.data

            
        } else {
            this.chargeCodedetails = [];
        }
    });
}
  onGlobalSearch(keyword: string): void {
   // Clear any existing timeout
   if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
}

// Set a new timeout to trigger the search after 500 milliseconds (adjust as needed)
this.searchTimeout = setTimeout(() => {
    this.fetchAllChargeCodeDetails(keyword);
}, 500);
}


clear(table: Table) {
  table.clear(); 

  this.clearSearchInput();

  this.fetchAllChargeCodeDetails();


}
clearSearchInput(): void {
  // Assuming you have a reference to the input element, you can clear its value
  const searchInput = document.getElementById('gSearch') as HTMLInputElement;
  console.log(searchInput,"ssdsss");
  // Or if you are using a framework like Angular, you can use a ViewChild or ngModel to get the reference

  if (searchInput) {
    searchInput.value = '';
  }
}

  onPageChange(event: any) {
    this.fetchAllChargeCodeDetails();
  }

 
  editChargecode(editId) {
    const selectedItem = this.chargeCodedetails.find(item => item.id === editId);

    if (selectedItem) {
        this.myForm.setValue({
            id: selectedItem.id,
            chargeCode: selectedItem.name,
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
            if(error.error.data[0] == 'Name should not be more than 50 words'){
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Name should not be more than 50 words.'
              });
            }
            else if(error.error.data[0] == 'Description should not be more than 1000 words'){
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Description should not be more than 1000 words'
            });
            }
            else if(error.error.data[0] == 'Charge code name exists\nDescription should not be more than 1000 words'){
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Charge code name exists.\nDescription should not be more than 1000 words.'
              });
            }
            else if(error.error.data[0] == 'Charge code name exists'){
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Charge code name exists'
              });
            }
            else if(error.error.data[0] == 'Name should not be more than 50 words\nDescription should not be more than 1000 word'){
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Name should not be more than 50 words\nDescription should not be more than 1000 word'
            });
            }
        else{
          this.handleError();
        }
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
            if(error.error.data[0] == 'Name should not be more than 50 words'){
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Name should not be more than 50 words.'
              });
            }
            else if(error.error.data[0] == 'Description should not be more than 1000 words'){
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Description should not be more than 1000 words'
            });
            }
            else if(error.error.data[0] == 'Charge code name exists\nDescription should not be more than 1000 words'){
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Charge code name exists.\nDescription should not be more than 1000 words.'
              });
            }
            else if(error.error.data[0] == 'Charge code name exists'){
              this.messageService.add({
                key: 'errorToast',
                severity: 'error',
                summary: 'Error!',
                detail: 'Charge code name exists'
              });
            }
            else if(error.error.data[0] == 'Name should not be more than 50 words\nDescription should not be more than 1000 word'){
            this.messageService.add({
              key: 'errorToast',
              severity: 'error',
              summary: 'Error!',
              detail: 'Name should not be more than 50 words\nDescription should not be more than 1000 word'
            });
            }
          else{
            this.handleError();
          }
          
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
      detail: 'Name should not exceed 50 characters; description exceeds limit—please shorten it'
  });
}

  // ... Other methods in your component

   //------------------export excel-----------------------------------------------------------//
   downloadExcel(event: Event) {
    event.preventDefault();
  
    this.masterDataService.downloadChargeCodeDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'ChargeCodeDetails.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Excel File Downloaded successfully.'
      });
    });
  }
}
