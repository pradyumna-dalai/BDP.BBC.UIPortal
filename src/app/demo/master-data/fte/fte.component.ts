import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-fte',
  templateUrl: './fte.component.html',
  styleUrls: ['./fte.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FteComponent {

  FteForm: FormGroup;
  displayCreateFteDialog :boolean =false

  constructor(private breadcrumbService: AppBreadcrumbService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService, private router: Router, private masterDataService: MasterDataService, private masterTableService: MasterTableService) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'FTE - Full Time Employee' }
    ]);
  }

  showCreateFteDialog() {
    this.displayCreateFteDialog = true;
    // this.locationForm.reset({
    //   status: 'inactive'
    // });
    // this.editMode = false;
    // this.modeTitle = 'Add';
    
  }

  onSort(event){
    console.log(event)
  }
  onPageChange(event){
    
  }
}
