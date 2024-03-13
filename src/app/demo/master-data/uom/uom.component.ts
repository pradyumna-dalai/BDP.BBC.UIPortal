import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { MomentService } from 'src/app/FormateDate/moment.service';



@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class UOMComponent implements AfterViewInit{
  visibleDialog: boolean = false;
  myForm: FormGroup;
  uomtdetails: any;
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
  searchTimeout: any;
 
  constructor(private momentService: MomentService,private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private fb: FormBuilder, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'UOM-Unit Of Measure' }
    ]);
  }
  ngAfterViewInit(): void {
    
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      uom_name: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
    this.fetchAllUOMDetails();
  }
  limitTo50Digits(event: any) {
    if (event.target.value.length > 50) {
      event.target.value = event.target.value.slice(0, 50);
    }
  }

  limitTo1000Digits(event: any) {
    if (event.target.value.length > 50) {
      event.target.value = event.target.value.slice(0, 1000);
    }
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
  fetchAllUOMDetails(keyword: string = ''): void {
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder,
      keyword: keyword // Add the keyword parameter
    };
  
    this.masterDataService.getAllUom(params).subscribe((res: any) => {
      if (res?.message == "success") {
        // Update uomtdetails and totalRecords accordingly
        this.uomtdetails = res.data.uom.map((item: any) => {
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
        this.uomtdetails = [];
        this.totalRecords = 0;
      }
    });
  }
  onGlobalSearch(keyword: string): void {
    console.log(keyword);
    if (this.searchTimeout) {
     clearTimeout(this.searchTimeout);
 }
 
 this.searchTimeout = setTimeout(() => {
     this.fetchAllUOMDetails(keyword);
 }, 500);
 }
  clear(table: Table) {
    table.reset(); 

    this.sortField = '';
    this.sortOrder = 1;
  
    this.clearSearchInput();
  
    this.fetchAllUOMDetails();
  
    this.currentPage = 1;
    this.pageSize = 10;
}
clearSearchInput(): void {
  const searchInput = document.getElementById('gSearch') as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
  }
}
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchAllUOMDetails();
  }
  // Handle sorting event
  onSort(event: any) {
  
    this.newSortField = event.field;
    this.newSortOrder = (event.order === 1) ? 'asc' : 'desc';
  
    if (this.newSortField !== this.sortField || this.newSortOrder !== this.sortOrder) {
      if(this.newSortField == undefined){
        this.sortField = "";
      }else{
        this.sortField = this.newSortField;
      }
      
      this.sortOrder = this.newSortOrder;
      this.currentPage = 1;
      this.fetchAllUOMDetails();
    }
  }

  editUOM(editId) {
    
    const selectedItem = this.uomtdetails.find(item => item.id === editId);

    if (selectedItem) {
        this.myForm.setValue({
            id: selectedItem.id,
            uom_name: selectedItem.name,
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
  SaveUom() {
    const statusValue = this.myForm.get('status').value;
    const isStatusActive = statusValue === 'active';
    const body = {
        id: this.myForm.get('id').value || '',
        name: this.myForm.get('uom_name').value,
        description: this.myForm.get('description').value,
        status: isStatusActive,
        isDeleted: false
    };
  
    if (this.editMode) {
        // Editing an existing charge code
        this.masterDataService.editUom(body).subscribe(
            (res) => {
                this.handleSuccess();
            },
            (error) => {
              if (error.status === 400) {
                if(error.error.data[0] == 'UOM name exists\nDescription should not be more than 1000 characters'){
                  this.messageService.add({
                    key: 'errorToast',
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'UOM name exists\nDescription should not be more than 1000 characters'
                  });
                }
               else if(error.error.data[0] == 'Description should not be more than 1000 characters'){
                  this.messageService.add({
                    key: 'errorToast',
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Description should not be more than 1000 characters'
                  });
                }
            else{
              this.handleError();
            }
          }
            }
        );
    } else {
      this.modeTitle = 'Add';
        // Adding a new charge code
        this.masterDataService.addUom(body).subscribe(
            (res) => {
                this.handleSuccess();
            },
            (error) => {
               
                if (error.status === 400) {
                  if(error.error.data[0] == 'Description should not be more than 1000 characters'){
                    this.messageService.add({
                      key: 'errorToast',
                      severity: 'error',
                      summary: 'Error!',
                      detail: 'Description should not be more than 1000 characters'
                    });
                  }
                  else if(error.error.data[0] == 'UOM name exists'){
                    this.messageService.add({
                      key: 'errorToast',
                      severity: 'error',
                      summary: 'Error!',
                      detail: 'UOM name exists'
                    });
                }
              else{
                this.handleError();
              }
            }
            }
        );
    }
  }
  private handleSuccess() {
    const successMessage = this.editMode ? 'UOM Updated Successfully.' : 'UOM Added Successfully.';
    
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
    this.fetchAllUOMDetails(); // Fetch updated data
  }
  
  private handleError() {
    this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Something went wrong'
    });
  }

  downloadExcel(event: Event) {
    event.preventDefault();
  
    this.masterDataService.downloadUomDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'UOMDetails.xlsx';
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
