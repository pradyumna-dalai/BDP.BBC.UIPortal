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

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private fb: FormBuilder, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'UOM' }
    ]);
  }
  // ngOnInit() {
  //   this.myForm = this.fb.group({
  //     id: [''],
  //     prodcut_name: ['', Validators.required],
  //     description: [''],
  //     status: ['inactive', Validators.required],
  //   });
  // }
  // showDialog(){
  //   this.visibleDialog = true;
  // }
  // onCancel(){
  //   this.visibleDialog = false;
  // }
  // SaveChargecode(){

  // }

}
