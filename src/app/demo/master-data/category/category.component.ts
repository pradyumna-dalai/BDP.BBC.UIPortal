import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CategoryComponent {
  loading: boolean = true;
  displayCreateCategoryDialog: boolean;
  procuctNamesOptions: any[];
  CategoryForm: FormGroup;
  categoryDetails: any[] = [];
  editMode: boolean = false;
  selectedCategory: any;
  procuctScopesOptions: any;
  product_name: any;
  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  sortField: string = ''; // Initial sort field
  sortOrder: string = 'asc'; // 1 for ascending, -1 for descending
  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;
  modeTitle: string = 'Add';
  searchTimeout: number;
  processing: boolean = false;

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService, public MasterTableservice: MasterTableService,
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService, private fb: FormBuilder,) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Product Category' }
    ]);

    //this.createForm();

  }

  ngAfterViewInit(): void {

  }
  ngOnInit() {
    this.getProdname();
    this.fetchProductCategory();
    // this.createForm();
    this.CategoryForm = this.fb.group({
      id: [''],
      productid: ['', Validators.required],
      productScope: ['', Validators.required],
      productCategory: ['', Validators.required],
      description: [''],
      status: ['inactive', Validators.required],
    });
  }

  showCreateCategoryDialoge() {
    this.displayCreateCategoryDialog = true;
    this.CategoryForm.reset({
      status: 'inactive'
    });
    this.editMode = false;
    this.modeTitle = 'Add';
  }

  // ---------------get product data------------------------//
  getProdname() {
    this.MasterTableservice.getProductName().subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctNamesOptions = res?.data;
      } else {
        this.procuctNamesOptions = [];
      }
    })
  }
  // ---------------get scope data on product select------------------------//
  onProductSelect(selectedProductId: any) {
    this.procuctScopesOptions = [];

    if (selectedProductId) {
      const body = '';
      this.MasterTableservice.getProductScope(body, selectedProductId).subscribe((res: any) => {
        if (res?.message == "success") {
          this.procuctScopesOptions = res?.data;
          if (this.procuctScopesOptions.length > 0) {
            const selectedProduct = this.procuctScopesOptions[0].product;
            this.CategoryForm.patchValue({
              productid: selectedProduct.id,
            });
          }
        } else {
          this.procuctScopesOptions = [];
        }
      });
    }
  }


  // -----------------------------------create scope --------------------------------------//

  createProductCategory() {
    if (this.CategoryForm.valid) {
      this.processing = false;
      const body = {
        id: this.CategoryForm.get('id').value || '',
        name: this.CategoryForm.value.productCategory,
        description: this.CategoryForm.value.description,
        status: this.CategoryForm.value.status === 'active' ? true : false,
        isDeleted: false,
        // product: {
        //   id: this.CategoryForm.value.productid
        // },
        scope: {
          id: this.CategoryForm.value.productScope
        }
      };

      if (this.editMode) {
        this.modeTitle = 'Edit';
        body['id'] = this.selectedCategory.id;
        this.masterDataService.updateCateogryDetails(body).subscribe(
          (response) => {
            //  console.log(response);
            this.displayCreateCategoryDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully!' });
            //  this.createForm();
            this.editMode = false;
            this.fetchProductCategory();
            this.processing = false; 
          },
          (error) => {
            //  console.error(error);
            this.processing = false; 
            if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
              const errorMessage = error.error.data?.join(', ') || 'Error in adding cateogry';
              this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding category' });
            }
          }
        );
      } else {
        this.modeTitle = 'Add';
        this.masterDataService.addCateogoryDetails(body).subscribe(
          (response) => {
            //   console.log(response);
            this.displayCreateCategoryDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully!' });
            this.totalRecords += 1;
            this.fetchProductCategory();
            this.processing = false;
          },
          (error) => {
            //  console.error(error);
            if (error.status === 400 && error.error?.message === 'Fill required field(s)') {
              const errorMessage = error.error.data?.join(', ') || 'Error in adding cateogry';
              this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error in adding category' });
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


  fetchProductCategory(keyword: string = ''): void {
    const params = {
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder,
      keyword: keyword // Add the keyword parameter
    };
    this.masterDataService.getCategoryDetails(params).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.categoryDetails = res.data.category;
        this.totalRecords = res?.data.totalElements;
        //  console.log('fetch Category details:', this.categoryDetails);
      } else {
        console.error('Failed to fetch Category details:', res);
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
     this.fetchProductCategory(keyword);
 }, 500);
 }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.fetchProductCategory();
  }
 
  onSort(event: any) {
    const newSortField = event.field;
    const newSortOrder = event.order === 1 ? 'asc' : 'desc'; 
  
    if (newSortField !== this.sortField || newSortOrder !== this.sortOrder) {
      if(newSortField == undefined){
        this.sortField = "";
      }else{
        this.sortField = newSortField;
      }
      this.sortOrder = newSortOrder;
      this.currentPage = 1;
      this.fetchProductCategory();
    }
  }
  clear(table: Table) {
    table.clear();
    this.onSort(Event);
    this.clearSearchInput()
  }
  clearSearchInput(): void {
    const searchInput = document.getElementById('gSearch') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }
  //-------------------------------end---------------------------------------------------//
  //------------------------------UpdateScope--------------------------------------------//
  editCategory(category: any) {
    this.selectedCategory = category;
    this.updateProductCategoryDetails(category);
  }
  updateProductCategoryDetails(category: any) {
    this.editMode = true;
    this.modeTitle = 'Edit'; 
    if (this.selectedCategory) {
      // Fetch product scopes for the selected product
      const selectedProductId = this.selectedCategory.scope.product.id;
      this.MasterTableservice.getProductScope('', selectedProductId).subscribe((res: any) => {
        if (res?.message === 'success') {
          this.procuctScopesOptions = res.data;
          this.CategoryForm.patchValue({
            productid: this.selectedCategory.scope.product.id,
            productScope: this.selectedCategory.scope.id,
            productCategory: this.selectedCategory.name,
            description: this.selectedCategory.description,
            status: this.selectedCategory.status ? 'active' : 'inactive',
          });

          this.displayCreateCategoryDialog = true;
          //  this.CategoryForm.reset();
        } else {
          this.procuctScopesOptions = [];
        }
      });
    }
  }

  cancelUpdate() {
    // Reset the form when the "Cancel" button is clicked
    this.CategoryForm.reset();
    this.displayCreateCategoryDialog = false;
    this.editMode = false;

  }

  //-------------------Exoprt Excel-----------------------------------------------------//
  downloadExcel(event: Event) {
    event.preventDefault();

    this.masterDataService.downloadCategoryDetails().subscribe((res: any) => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'CategoryDetails.xlsx';
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

