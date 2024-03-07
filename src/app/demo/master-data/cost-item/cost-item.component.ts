import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
@Component({
  selector: 'app-cost-item',
  templateUrl: './cost-item.component.html',
  styleUrls: ['./cost-item.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class CostItemComponent {
  loading: boolean = true;
  displayCreateCostItemDialog: boolean;
 // procuctCategoryOptions: any[];
  //procuctNamesOptions: any[];
  CostItemForm: FormGroup;
  costItemDetails: any[] = [];
  editMode: boolean = false;
  selectedCostItem: any;
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = ''; // Initial sort field
  sortOrder: string = 'asc'; // or initialize it based on your requirements
  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;
  modeTitle: string = 'Add';
  searchTimeout: any;
  processing: boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router, public MasterTableservice: MasterTableService,
    private fb: FormBuilder, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Cost Item' }
    ]);
   

  }
  ngAfterViewInit(): void {
    
  }
  ngOnInit() {
    this.getProdname();
    this.fetchProductScope();
    this.CostItemForm = this.fb.group({
      id: [''],
      productid: ['', Validators.required],
      productScope: ['', Validators.required],
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

  getProdname() {
    // this.procuctNamesOptions = [];
    this.MasterTableservice.getProductName().subscribe((res: any) => {
      if (res?.message == "success") {
       // this.procuctNamesOptions = res?.data;
      } else {
    //    this.procuctNamesOptions = [];
      }
    })
  }

  // -----------------------------------create scope --------------------------------------//

  createProductScope() {
    if (this.CostItemForm.valid) {
      this.processing = true;
      const body = {
        id: this.CostItemForm.get('id').value || '',
        name: this.CostItemForm.value.productScope,
        description: this.CostItemForm.value.description,
        status: this.CostItemForm.value.status === 'active' ? true : false,
        isDeleted: false,
        product: {
          id: this.CostItemForm.value.productid
        }
      };

      if (this.editMode) {
        // Handle update logic
        this.modeTitle = 'Edit';
        body['id'] = this.selectedCostItem.id;
        this.masterDataService.updateScopeDetails(body).subscribe(
          (response) => {
            console.log(response);
            this.displayCreateCostItemDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Scope updated successfully!' });
            this.editMode = false;
            this.fetchProductScope();
            this.processing = false; 
          },
          (error) => {
            console.error(error);
            this.processing = false; 
          }
        );
      } else {
        this.modeTitle = 'Add';
        this.masterDataService.addScopeDetails(body).subscribe(
          (response) => {
            console.log(response);
            this.displayCreateCostItemDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Scope added successfully!' });
            this.fetchProductScope();
            this.processing = false;
          },
          
          (error) => {
            console.error(error);
            if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
              const errorMessage = error.error.data?.join(', ') || 'Error in adding scope';
              this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding scope' });
            }
          }
        );
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Form is invalid!' });
    }
  }


  //-----------------------fetch scope details-------------------------------------------//
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  fetchProductScope(keyword: string = ''): void {
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder,
      keyword: keyword // Add the keyword parameter
    };
    this.masterDataService.getScopeDetails(params).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.costItemDetails = res.data.scope;
      //  this.totalRecords = res?.data.totalElements;
        console.log('fetch scope details:', this.totalRecords);
      } else {
        console.error('Failed to fetch scope details:', res);
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
     this.fetchProductScope(keyword);
 }, 500);
 }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchProductScope();
  }

  onSort(event: any) {
    const newSortField = event.field;
    const newSortOrder = event.order === 1 ? 'asc' : 'desc'; 
    if (newSortField !== this.sortField || newSortOrder !== this.sortOrder) {
      this.sortField = newSortField;
      this.sortOrder = newSortOrder;
      this.currentPage = 1;
      this.fetchProductScope();
    }
  }
  
  clear(table: Table) {
    table.clear();
    this.onSort(Event);
  }
  //-------------------------------end---------------------------------------------------//

  //------------------------------UpdateScope--------------------------------------------//
  editScope(scope: any) {
    this.selectedCostItem = scope;
    this.updateProductScopeDetails(scope);
  }
  updateProductScopeDetails(scope: any) {
    this.editMode = true;
    this.modeTitle = 'Edit'; 
    if (this.selectedCostItem) {
      this.CostItemForm.patchValue({
        productid: this.selectedCostItem.product.id,
        productScope: this.selectedCostItem.name,
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
