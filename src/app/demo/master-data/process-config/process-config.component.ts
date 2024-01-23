import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  selector: 'app-process-config',
  templateUrl: './process-config.component.html',
  styleUrls: ['./process-config.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProcessConfigComponent {
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router,
    ) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Process Configurables' }
    ]);
   

  }
}
