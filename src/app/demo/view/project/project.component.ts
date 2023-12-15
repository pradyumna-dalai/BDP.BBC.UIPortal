import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../../../app.breadcrumb.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  text:string = '';
  data: any = {};

  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
        {label: 'Project'}
    ]);
}
ngOnInit(){
  this.data =  [
    {
        "comp_name": "psa bdp",
        "proj_id": "12",
        "oppourtunity_name": "customer onboarding",
        "proj_stage": "implementation",
        "proj_status": "completed",
        "oppourtunity_manager": "mac",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"
    },
    {
      "comp_name": "bdp",
        "proj_id": "13",
        "oppourtunity_name": "project 1",
        "proj_stage": "operational",
        "proj_status": "closed",
        "oppourtunity_manager": "john",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"
  },
  {
    "comp_name": "tata",
        "proj_id": "199",
        "oppourtunity_name": "project 2",
        "proj_stage": "design",
        "proj_status": "new",
        "oppourtunity_manager": "nil",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"
},
{
  "comp_name": "psa bdp",
        "proj_id": "12",
        "oppourtunity_name": "project 3",
        "proj_stage": "implementation",
        "proj_status": "completed",
        "oppourtunity_manager": "mac",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"
},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

},
{
  "comp_name": "Accenture",
        "proj_id": "172",
        "oppourtunity_name": "project 4",
        "proj_stage": "decommissioned",
        "proj_status": "Updated",
        "oppourtunity_manager": "Priya",
        "start_date": "10/10/2020",
        "end_date": "10/10/2020"

}
]
}

}
