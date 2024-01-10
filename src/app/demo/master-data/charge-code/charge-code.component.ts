import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';

@Component({
  selector: 'app-charge-code',
  templateUrl: './charge-code.component.html',
  styleUrls: ['./charge-code.component.scss']
})
export class ChargeCodeComponent {
  visibleChargeCode:boolean=false;

  constructor(private datePipe: DatePipe, private breadcrumbService: AppBreadcrumbService,
     private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Chrage code' }
    ]);
  }
  showDialogChargeCode(){
    this.visibleChargeCode = true;
  }
}
