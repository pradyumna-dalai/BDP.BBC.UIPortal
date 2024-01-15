import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

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

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private fb: FormBuilder, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'ProductName' }
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
  showDialog(){
    this.visibleDialog = true;
  }
  onCancel(){
    this.visibleDialog = false;
  }
  SaveChargecode(){

  }
  fetchAllProdcutDetails() {
    this.masterDataService.getAllProdcut().subscribe((res: any) => {
      if (res?.message == "success") {
        this.productdetails = res.data.product.map((item: any) => {
          return {
            id: item.id, 
            product_name: item.name,
            description: item.description,
            status: item.status

          };
        });
       // console.log("djdsf",this.locationdetails);
      } else {
        this.productdetails = [];
      }
    });
  }
}
