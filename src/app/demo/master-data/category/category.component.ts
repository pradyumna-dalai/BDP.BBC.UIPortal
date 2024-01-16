import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService, ConfirmationService] 
})
export class CategoryComponent {
  loading: boolean = true;
  displayCreateCategoryDialog: boolean;
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService) {
    this.breadcrumbService.setItems([
      { label: 'Category' }
    ]);


  }

  showCreateCategoryDialog() {

    this.displayCreateCategoryDialog = true;
  }
}
