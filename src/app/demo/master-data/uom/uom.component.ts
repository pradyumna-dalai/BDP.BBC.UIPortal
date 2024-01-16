import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class UOMComponent {
  visibleDialog: boolean = false;
  myForm: FormGroup;
  uomtdetails: any;
  editMode: boolean = false;
  modeTitle: string = 'Add';

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private fb: FormBuilder, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'UOM' }
    ]);
  }
  ngOnInit() {
    this.myForm = this.fb.group({
      id: [''],
      uom_name: ['', Validators.required],
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
    this.masterDataService.getAllUom().subscribe((res: any) => {
      if (res?.message == "success") {
        this.uomtdetails = res.data.uom.map((item: any) => {
          return {
            id: item.id, 
            uomName: item.name,
            description: item.description,
            status: item.status,

            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdDate: item.createdDate,
            updatedDate: item.updatedDate,

          };
        });
       // console.log("djdsf",this.locationdetails);
      } else {
        this.uomtdetails = [];
      }
    });
  }
  editUOM(editId) {
    
    const selectedItem = this.uomtdetails.find(item => item.id === editId);

    if (selectedItem) {
        this.myForm.setValue({
            id: selectedItem.id,
            uom_name: selectedItem.uomName,
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
                this.handleError();
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
                this.handleError();
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
    this.fetchAllProdcutDetails(); // Fetch updated data
  }
  
  private handleError() {
    this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: this.editMode ? 'Failed To Update UOM.' : 'Failed to save UOM'
    });
  }


}
