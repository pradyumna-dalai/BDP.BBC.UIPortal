import { Component } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent {
  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
        {label: 'glossary'}
    ]);
}

}
