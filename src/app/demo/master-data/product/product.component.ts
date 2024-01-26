import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProductComponent {

  visibleDialog: boolean = false;
  myForm: FormGroup;
  productdetails: any;
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
  newSortField: any;
  newSortOrder: any;

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private fb: FormBuilder, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Product Name' }
    ]);
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      // Define your form controls here
      id: [''],
      prodcut_name: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
    this.fetchAllProdcutDetails();
  }
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger'; 
  }
  getSeverityLabel(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }
  
  showDialog(){
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
 
  fetchAllProdcutDetails() {
   
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder
  };
    this.masterDataService.getAllProdcut(params).subscribe((res: any) => {
      if (res?.message == "success") {
        this.productdetails = res.data.product.map((item: any) => {
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
        this.productdetails = [];
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
    this.fetchAllProdcutDetails();
  }
  onSort(event: any) {
    this.newSortField = event.field;
    this.newSortOrder = (event.order === 1) ? 'asc' : 'desc';
    if (this.newSortField !== this.sortField || this.newSortOrder !== this.sortOrder) {
      this.sortField = this.newSortField;
      this.sortOrder = this.newSortOrder;
      this.currentPage = 1;
      this.fetchAllProdcutDetails();
    }
    
  }
  editProduct(editId) {
    
    const selectedItem = this.productdetails.find(item => item.id === editId);

    if (selectedItem) {
        this.myForm.setValue({
            id: selectedItem.id,
            prodcut_name: selectedItem.name,
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
  SaveProduct() {
    const statusValue = this.myForm.get('status').value;
    const isStatusActive = statusValue === 'active';
    const body = {
        id: this.myForm.get('id').value || '',
        name: this.myForm.get('prodcut_name').value,
        description: this.myForm.get('description').value,
        status: isStatusActive,
        isDeleted: false
    };
  
    if (this.editMode) {
        // Editing an existing charge code
        this.masterDataService.editProduct(body).subscribe(
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
              else if(error.error.data[0] == 'Product name exists\nDescription should not be more than 1000 words'){
                this.messageService.add({
                  key: 'errorToast',
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Product name exists.\nDescription should not be more than 1000 words.'
                });
              }
              else if(error.error.data[0] == 'Product name exists'){
                this.messageService.add({
                  key: 'errorToast',
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Product name exists'
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
        this.masterDataService.addProdcut(body).subscribe(
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
              else if(error.error.data[0] == 'Product name exists\nDescription should not be more than 1000 words'){
                this.messageService.add({
                  key: 'errorToast',
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Product name exists.\nDescription should not be more than 1000 words.'
                });
              }
              else if(error.error.data[0] == 'Product name exists'){
                this.messageService.add({
                  key: 'errorToast',
                  severity: 'error',
                  summary: 'Error!',
                  detail: 'Product name exists'
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
    const successMessage = this.editMode ? 'Product Name Updated Successfully.' : 'Product Name Added Successfully.';
    
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
    this.fetchAllProdcutDetails(); // Fetch updated data
  }
  
  private handleError() {
    this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Name should not exceed 50 characters; description exceeds limit—please shorten it'
    });
  }

   //------------------export excel-----------------------------------------------------------//
   downloadExcel(event: Event) {
    event.preventDefault();
  
    this.masterDataService.downloadProudctDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'ProductDetails.xlsx';
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
