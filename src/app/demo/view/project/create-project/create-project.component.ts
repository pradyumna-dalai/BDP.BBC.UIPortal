import { Component } from '@angular/core';
import { AppBreadcrumbService } from '../../../../app.breadcrumb.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  date: Date | undefined;
  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
      {
        label: 'PROJECT',
        routerLink: 'project'
      },
      { label: 'Create Project' },
    ]);
  }

}
