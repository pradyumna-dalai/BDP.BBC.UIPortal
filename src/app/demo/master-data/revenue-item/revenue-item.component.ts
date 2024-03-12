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
  displayCreateRevenueItemDialog: boolean;
  RevenueItemForm: FormGroup;
  revenueItemDetails: any[] = [];
  editMode: boolean = false;
  selectedRevenue: any;
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
    this.RevenueItemForm = this.fb.group({
      id: [''],
      revenue: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
  }

  showCreateRevenueItemDialoge() {
    this.displayCreateRevenueItemDialog = true;
    this.RevenueItemForm.reset({
      status: 'inactive'
    });
    this.editMode = false;
    this.modeTitle = 'Add';
  }

  // -----------------------------------create Cost  --------------------------------------//

  createRevenueItem() {
    if (this.RevenueItemForm.valid) {
      this.processing = true;
      const body = {
        id: this.RevenueItemForm.get('id').value || '',
        name: this.RevenueItemForm.value.revenue,
        description: this.RevenueItemForm.value.description,
        status: this.RevenueItemForm.value.status === 'active' ? true : false,
        isDeleted: false,
      };

      const observer = {
        next: (response: any) => {
          this.displayCreateRevenueItemDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.editMode ? 'Revenue updated successfully!' : 'Revenue added successfully!' });
          this.fetchAllRevenueDetails();
          this.processing = false;
        },
        error: (error: any) => {
          if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
            const errorMessage = error.error.data?.join(', ') || 'Error in adding Revenue';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding Revenue' });
          }
          this.processing = false;
        }
      };

      if (this.editMode) {
        this.modeTitle = 'Edit';
        body['id'] = this.selectedRevenue.id;
        this.masterDataService.updateRevenueDetails(body).subscribe(observer);

      } else {
        this.modeTitle = 'Add';
        this.masterDataService.saveRevenueDetails(body).subscribe(observer);
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
      } else {
        // console.error('Failed to fetch cost Item details:', res);
      }
    });
  }

  clear(table: Table) {
    table.clear();
    this.clearSearchInput();
    this.fetchAllRevenueDetails();
  }

  clearSearchInput(): void {
    const searchInput = document.getElementById('gSearch') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  //------------------------------Update Revenue--------------------------------------------//
  editRevenue(revenue: any) {
    this.selectedRevenue = revenue;
    this.updateRevenueDetails(revenue);
  }

  updateRevenueDetails(_revenue) {
    this.editMode = true;
    this.modeTitle = 'Edit';
    if (this.selectedRevenue) {
      this.RevenueItemForm.patchValue({
        revenue: this.selectedRevenue.name,
        description: this.selectedRevenue.description,
        status: this.selectedRevenue.status ? 'active' : 'inactive',
      });

      this.displayCreateRevenueItemDialog = true;
    }
  }

  cancelUpdate() {
    // Reset the form when the "Cancel" button is clicked
    this.RevenueItemForm.reset();
    this.displayCreateRevenueItemDialog = false;
    this.editMode = false;

  }


  //-------------------Exoprt Excel-----------------------------------------------------//
  downloadExcel(event: Event) {
    event.preventDefault();
    this.masterDataService.downloadRevenueDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'RevenueItemDetails.xlsx';
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
