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
  
  
    this.masterDataService.getAllUom().subscribe((res: any) => {
      if (res?.message == "success") {
        // Update uomtdetails and totalRecords accordingly
        this.uomtdetails = res.data
        
      } else {
        this.uomtdetails = [];
  
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
    table.clear(); 
  
    this.clearSearchInput();
  
    this.fetchAllUOMDetails();
}
clearSearchInput(): void {
  const searchInput = document.getElementById('gSearch') as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
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
