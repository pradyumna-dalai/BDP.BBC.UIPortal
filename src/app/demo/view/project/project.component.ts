import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../../../app.breadcrumb.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  text:string = '';

  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
        {label: 'Project'}
    ]);
}

}
