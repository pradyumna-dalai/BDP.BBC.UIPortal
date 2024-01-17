import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  sortField: string = 'id';
  sortOrder: number = 1;
  totalPages: number;
  editMode: boolean = false;
  selectedCategory: any;
  procuctScopesOptions: any;
  product_name: any;
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService, public MasterTableservice: MasterTableService,
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService, private fb: FormBuilder,) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Category' }
    ]);

    this.createForm();

  }
  ngOnInit() {
    this.getProdname();
    this.fetchProductCategory();
  }

  createForm() {
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
  }

  // ---------------get product data------------------------//
  getProdname() {
    this.MasterTableservice.getProductName().subscribe((res: any) => {
      if (res?.message == "success") {
        this.procuctNamesOptions = res?.data?.product;
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
        body['id'] = this.selectedCategory.id;
        this.masterDataService.updateCateogryDetails(body).subscribe(
          (response) => {
          //  console.log(response);
            this.displayCreateCategoryDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully!' });
            this.createForm();
            this.editMode = false;
            this.fetchProductCategory();
          },
          (error) => {
            console.error(error);

          }
        );
      } else {
        this.masterDataService.addCateogoryDetails(body).subscribe(
          (response) => {
         //   console.log(response);
            this.displayCreateCategoryDialog = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category added successfully!' });
            this.createForm();
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


  showCreateCategoryDialog() {
    this.displayCreateCategoryDialog = true;
  }

  //-----------------------fetch scope details-------------------------------------------//
  getSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }
  getSeverityLabel(status: boolean | string): string {
    return status === true || status === 'active' ? 'Active' : 'Inactive';
  }

  onPageChange(event: any) {
    const newPage = event.page + 1;

    if (!isNaN(newPage)) {
      this.currentPage = newPage;
      this.fetchProductCategory();
    }
  }

  onSortChange(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.fetchProductCategory();
  }

  fetchProductCategory() {
    const params = {
      pageNo: this.currentPage - 1,
      pageSize: this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder === 1 ? 'asc' : 'desc',
    };
    this.masterDataService.getCategoryDetails(params).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.categoryDetails = res.data.category;
        this.totalRecords = res.data.totalPages;
      //  console.log('fetch Category details:', this.categoryDetails);
      } else {
        console.error('Failed to fetch Category details:', res);
      }
    });
  }

  //-------------------------------end---------------------------------------------------//
  //------------------------------UpdateScope--------------------------------------------//
  editCategory(category: any) {
    this.selectedCategory = category;
    this.updateProductCategoryDetails(category);
  }
  updateProductCategoryDetails(category: any) {
    this.editMode = true;
  
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
  
}

