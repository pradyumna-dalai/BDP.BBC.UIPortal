import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
@Component({
  selector: 'app-revenue-item',
  templateUrl: './revenue-item.component.html',
  styleUrls: ['./revenue-item.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class RevenueItemComponent {
  loading: boolean = true;
  displayCreateCostItemDialog: boolean;
  CostItemForm: FormGroup;
  revenueItemDetails: any[] = [];
  editMode: boolean = false;
  selectedCostItem: any;
  modeTitle: string = 'Add';
  processing: boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router, public MasterTableservice: MasterTableService,
    private fb: FormBuilder, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Revenue Item' }
    ]);


  }
  ngAfterViewInit(): void {

  }
  ngOnInit() {
    this.fetchAllRevenueDetails();
    this.CostItemForm = this.fb.group({
      id: [''],
      costItem: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
  }

  showCreateCostItemDialoge() {
    this.displayCreateCostItemDialog = true;
    this.CostItemForm.reset({
      status: 'inactive'
    });
    this.editMode = false;
    this.modeTitle = 'Add';
  }

  // -----------------------------------create Cost  --------------------------------------//

  createCostItem() {
    if (this.CostItemForm.valid) {
      this.processing = true;
      const body = {
        id: this.CostItemForm.get('id').value || '',
        name: this.CostItemForm.value.costItem,
        description: this.CostItemForm.value.description,
        status: this.CostItemForm.value.status === 'active' ? true : false,
        isDeleted: false,
      };

      const observer = {
        next: (response: any) => {
          console.log(response);
          this.displayCreateCostItemDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.editMode ? 'Cost Item updated successfully!' : 'Cost Item added successfully!' });
          this.fetchAllRevenueDetails();
          this.processing = false;
        },
        error: (error: any) => {
          console.error(error);
          if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
            const errorMessage = error.error.data?.join(', ') || 'Error in adding Cost Item';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding Cost Item' });
          }
          this.processing = false;
        }
      };

      if (this.editMode) {
        this.modeTitle = 'Edit';
        body['id'] = this.selectedCostItem.id;
        this.masterDataService.updateCostItemDetails(body).subscribe(observer);

      } else {
        this.modeTitle = 'Add';
        this.masterDataService.saveCostItemDetails(body).subscribe(observer);
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Form is invalid!' });
    }
  }


  //-----------------------fetch Cost details-------------------------------------------//
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  fetchAllRevenueDetails(): void {
    this.masterDataService.getAllRevenueDetails().subscribe((res: any) => {
      if (res?.message === 'success') {
        this.revenueItemDetails = res.data;
        console.log('fetch cost Item  details:', this.revenueItemDetails);
      } else {
        console.error('Failed to fetch cost Item details:', res);
      }
    });
  }

  clear(table: Table) {
    table.clear();
  }

  //-------------------------------end---------------------------------------------------//

  //------------------------------Update Cost Item--------------------------------------------//
  editCost(costItem: any) {
    this.selectedCostItem = costItem;
    this.updateCostItemDetails(costItem);
  }

  updateCostItemDetails(_costItem) {
    this.editMode = true;
    this.modeTitle = 'Edit';
    if (this.selectedCostItem) {
      this.CostItemForm.patchValue({
        costItem: this.selectedCostItem.name,
        description: this.selectedCostItem.description,
        status: this.selectedCostItem.status ? 'active' : 'inactive',
      });

      this.displayCreateCostItemDialog = true;
    }
  }

  cancelUpdate() {
    // Reset the form when the "Cancel" button is clicked
    this.CostItemForm.reset();
    this.displayCreateCostItemDialog = false;
    this.editMode = false;

  }


  //-------------------Exoprt Excel-----------------------------------------------------//
  downloadExcel(event: Event) {
    event.preventDefault();

    // this.masterDataService.downloadScopeDetails().subscribe((res: any) => {
    //   const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = 'CostItemDetails.xlsx';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   this.messageService.add({
    //     key: 'successToast',
    //     severity: 'success',
    //     summary: 'Success!',
    //     detail: 'Excel File Downloaded successfully.'
    //   });
    // });
  }

}
