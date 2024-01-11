import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';

@Component({
  selector: 'app-charge-code',
  templateUrl: './charge-code.component.html',
  styleUrls: ['./charge-code.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ChargeCodeComponent {

  display: boolean = false;
  chargeCode: string = '';
  description: string = '';
  status: string = '';

  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'ChargeCode' }
    ]);
  }
  showDialog() {
    this.display = true;
  }
}
