import { Component,ViewChild } from '@angular/core';
import {AppBreadcrumbService} from '../../../app.breadcrumb.service';
import { Table } from "primeng/table";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  items: any;
  data: any = {};
  activeIndex: number = 0;
  @ViewChild("dt1") dataTableComponent: Table;

  setup(value, id) {
      if (value != null)
          this.dataTableComponent.filters[id][0].value = value;
  }
  constructor(private breadcrumbService: AppBreadcrumbService) {
    this.breadcrumbService.setItems([
        {label: 'Template'}
    ]);
}
onActiveIndexChange(event: number) {
  this.activeIndex = event;
}

ngOnInit(){
  this.data =  [
//     {
//         "quote_id": "User1",
//         "quote_status": "12",
//         "customer_name": "Medhurst@gmail.om",
//         "inside_sales_rep": "9875448797",
//         "creation_date": 751012,
//         "price_owner": "User1",
//         "quote_type": "12",
//         "customer_reference": "Medhurst@gmail.om",
//         "mode": "9875448797",
//         "service_type": 751012,
//         "incoterm": "User1",
//         "pol": "12",
//         "origin_country": "Medhurst@gmail.om",
//         "pod": "9875448797",
//         "destination_country": 751012,
//         "teu": "User1",
//         "gross_weight": "12",
//         "chargeble_weight": "Medhurst@gmail.om",
//     },
//     {
//       "quote_id": "User1",
//       "quote_status": "12",
//       "customer_name": "Medhurst@gmail.om",
//       "inside_sales_rep": "9875448797",
//       "creation_date": 751012,
//       "price_owner": "User1",
//       "quote_type": "12",
//       "customer_reference": "Medhurst@gmail.om",
//       "mode": "9875448797",
//       "service_type": 751012,
//       "incoterm": "User1",
//       "pol": "12",
//       "origin_country": "Medhurst@gmail.om",
//       "pod": "9875448797",
//       "destination_country": 751012,
//       "teu": "User1",
//       "gross_weight": "12",
//       "chargeble_weight": "Medhurst@gmail.om",
//   },
//   {
//     "quote_id": "User1",
//     "quote_status": "12",
//     "customer_name": "Medhurst@gmail.om",
//     "inside_sales_rep": "9875448797",
//     "creation_date": 751012,
//     "price_owner": "User1",
//     "quote_type": "12",
//     "customer_reference": "Medhurst@gmail.om",
//     "mode": "9875448797",
//     "service_type": 751012,
//     "incoterm": "User1",
//     "pol": "12",
//     "origin_country": "Medhurst@gmail.om",
//     "pod": "9875448797",
//     "destination_country": 751012,
//     "teu": "User1",
//     "gross_weight": "12",
//     "chargeble_weight": "Medhurst@gmail.om",
// },
// {
//   "quote_id": "User1",
//   "quote_status": "12",
//   "customer_name": "Medhurst@gmail.om",
//   "inside_sales_rep": "9875448797",
//   "creation_date": 751012,
//   "price_owner": "User1",
//   "quote_type": "12",
//   "customer_reference": "Medhurst@gmail.om",
//   "mode": "9875448797",
//   "service_type": 751012,
//   "incoterm": "User1",
//   "pol": "12",
//   "origin_country": "Medhurst@gmail.om",
//   "pod": "9875448797",
//   "destination_country": 751012,
//   "teu": "User1",
//   "gross_weight": "12",
//   "chargeble_weight": "Medhurst@gmail.om",
// },
// {
//   "quote_id": "User1",
//   "quote_status": "12",
//   "customer_name": "Medhurst@gmail.om",
//   "inside_sales_rep": "9875448797",
//   "creation_date": 751012,
//   "price_owner": "User1",
//   "quote_type": "12",
//   "customer_reference": "Medhurst@gmail.om",
//   "mode": "9875448797",
//   "service_type": 751012,
//   "incoterm": "User1",
//   "pol": "12",
//   "origin_country": "Medhurst@gmail.om",
//   "pod": "9875448797",
//   "destination_country": 751012,
//   "teu": "User1",
//   "gross_weight": "12",
//   "chargeble_weight": "Medhurst@gmail.om",
// }
]


}


}
