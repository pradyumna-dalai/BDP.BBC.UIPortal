import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';

@Component({
  selector: 'app-process-config',
  templateUrl: './process-config.component.html',
  styleUrls: ['./process-config.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProcessConfigComponent implements OnInit {

  jsonData = {
    "status": 200,
    "message": "success",
    "data": {
      "processConfigurable": [
        {
          "createdBy": 1,
          "updatedBy": 2,
          "createdDate": "2023-11-28T07:28:26.000+00:00",
          "updatedDate": "2023-11-28T07:28:26.000+00:00",
          "productId": 1,
          "productName": "LLP",
          "scopeId": 1,
          "scopeName": "General",
          "categoryId": 1,
          "categoryName": "Onboarding",
          "buildingBlockId": 1,
          "buildingBlockName": "1stMileCoordination",
          "originDestination": "Origin",
          "processNumber": 1,
          "operationStep": "Customer send booking request",
          "uomId": 1,
          "uomName": "Order",
          "configurationId": 1,
          "configurationName": "Manual",
          "location_takTime": [
            {
              "locationId": 1,
              "locationName": "Singapore",
              "takTime": 7.1
            },
            {
              "locationId": 2,
              "locationName": "Shanghai",
              "takTime": 10.1
            }
          ],
          "status": true,
          "isDeleted": false
        }
      ],
      "pageNo": 0,
      "pageSize": 1,
      "totalPages": 1,
      "totalElements": 10,
      "isLast": false,
      "isFirst": true
    }
  };

  data: any[] = []; // Add your data array here

  columns: any[] = []; // Dynamic columns
  locations: any[] = []; // Locations array from the JSON data
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router,
    ) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Process Configurables' }
    ]);
   

  }
  ngOnInit() {
    // Access the JSON data using this.jsonData
    const processConfigurable = this.jsonData.data.processConfigurable;
     // Extract locations and initialize dynamic columns
     this.locations = processConfigurable[0].location_takTime;
     this.initializeColumns();
 
     // Process the data and map it to dynamic columns
     this.data = processConfigurable.map((item) => {
       const rowData: any = {};
 
       // Map static columns
      //  rowData['Actions'] = `<span style="cursor: pointer;"><i class="pi pi-pencil"></i></span>`;
       rowData['Product Name'] = item.productName;
       rowData['Product Scope'] = item.scopeName;
       rowData['Product Category'] = item.categoryName;
       rowData['Building Block Name'] = item.buildingBlockName;
       rowData['Origin / Destination'] = item.originDestination;
       rowData['Process No.'] = item.processNumber;
       rowData['Operations Steps'] = item.operationStep;
       rowData['Location'] = '';
       rowData['UOM'] = item.uomId;
       rowData['Configuration'] = item.configurationName;
       // ... map other static columns ...
 
       // Map dynamic columns based on location_takTime
       this.locations.forEach((location) => {
         rowData[location.locationName] = item.location_takTime.find(
           (loc) => loc.locationId === location.locationId
         )?.takTime;
       });
 
       return rowData;
     });
     console.log('Columns:', this.columns);
     console.log('Data:', this.data);
   }
 
   initializeColumns() {
     // Initialize static columns
     this.columns = [
      //  { field: 'Actions', header: 'Actions', style: { 'text-align': 'center' } },
       { field: 'Product Name', header: 'Product Name', style: { 'text-align': 'center', width: '200px' } },
       { field: 'Product Scope', header: 'Product Scope', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Product Category', header: 'Product Category', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Building Block Name', header: 'Building Block Name', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Origin / Destination', header: 'Origin / Destination', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Process No.', header: 'Process No.', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Operations Steps', header: 'Operations Steps', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Location', header: 'Location', style: { 'text-align': 'center', width: '300px' } },
       { field: 'UOM', header: 'UOM', style: { 'text-align': 'center', width: '300px' } },
       { field: 'Configuration', header: 'Configuration', style: { 'text-align': 'center', width: '300px' } },
       // ... add other static columns ...
 
       // Add dynamic columns based on location_takTime
       ...this.locations.map((location) => {
         return { field: location.locationName, header: location.locationName, style: { 'text-align': 'center' } };
       }),
     ];
   }
  }

 
