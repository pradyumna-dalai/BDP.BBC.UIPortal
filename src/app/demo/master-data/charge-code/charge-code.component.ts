import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';


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
 // Pagination properties
 currentPage: number = 1;
 pageSize: number = 10;
 sortField: string = ''; // Initial sort field
 sortOrder: number = 1; // 1 for ascending, -1 for descending

  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;


  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,private fb: FormBuilder,
     private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
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
 
  fetchAllChargeCodeDetails() {
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder
    };
  
    this.masterDataService.getAllChargecode(params).subscribe((res: any) => {
      if (res?.message === "success") {
        this.chargeCodedetails = res.data.chargeCode.map((item: any) => {
          return {
            id: item.id, 
            name: item.name,
            description: item.description,
            status: item.status,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdDate: item.createdDate,
            updatedDate: item.updatedDate,
          };
        });
  
        this.totalRecords = res?.data.totalElements;
      } else {
        this.chargeCodedetails = [];
        this.totalRecords = 0;
      }
    });
  }
  clear(table: Table) {
    table.clear();
}
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchAllChargeCodeDetails();
  }
  // Handle sorting event
  onSort(event: any) {
  
    this.sortField = event.field;
    this.sortOrder = (event.order === 1) ? 1 : -1;
  
    // Call the method to fetch data with sorting
    this.fetchAllChargeCodeDetails();
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
