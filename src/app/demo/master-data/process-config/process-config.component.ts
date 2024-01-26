import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterTableService } from './../../../services/master-table.service';

@Component({
  selector: 'app-process-config',
  templateUrl: './process-config.component.html',
  styleUrls: ['./process-config.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProcessConfigComponent implements OnInit {
// Add an array to track the edit mode for each row
editModes: boolean[] = [];
visible: boolean = false;

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
        },
        {
          "createdBy": 1,
          "updatedBy": 2,
          "createdDate": "2023-11-28T07:28:26.000+00:00",
          "updatedDate": "2023-11-28T07:28:26.000+00:00",
          "productId": 1,
          "productName": "Contract Logistic",
          "scopeId": 1,
          "scopeName": "Distribution",
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
  // jsonData:any= "";

  data: any[] = []; // Add your data array here

  columns: any[] = []; // Dynamic columns
  locations: any[] = []; // Locations array from the JSON data
  uomOptions: any[];
  configOptions: any[];
  locationss = [
    { locationName: 'Origin', value: 'origin' },
    { locationName: 'Destination', value: 'destination' }
    // Add more options as needed
  ];
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private router: Router,public MasterTableservice: MasterTableService,
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
     // Initialize edit mode for each row to false
    this.editModes = Array(this.data.length).fill(false);

    this.getUom();
    this.getConfigurable();
   }
 // Add a method to toggle the edit mode for a specific row
 toggleEditMode(index: number) {
  this.editModes[index] = !this.editModes[index];
}
isEditableColumn(columnField: string): boolean {
  // List the columns that should not be editable
  const nonEditableColumns = ['Product Name', 'Product Scope', 'Product Category','Building Block Name'];

  // Check if the current column is in the non-editable list
  return !nonEditableColumns.includes(columnField);
}
cancelAllEdits() {
  // Revert changes to the original data for all rows
  // this.data = JSON.parse(JSON.stringify(this.originalData));
  // Toggle back to the original grid for all rows
  this.editModes = Array(this.data.length).fill(false);
}
addNewRow() {
  // Create a new row with the same data as the first row
  const newRow = { ...this.data[0] };
  newRow.id = null;
  this.data.push(newRow);
  this.editModes.push(true);
}
   initializeColumns() {
     // Initialize static columns
     this.columns = [
      //  { field: 'Actions', header: 'Actions', style: { 'text-align': 'center' } },
       { field: 'Product Name', header: 'Product Name', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Product Scope', header: 'Product Scope', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Product Category', header: 'Product Category', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Building Block Name', header: 'Building Block Name', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Origin / Destination', header: 'Origin / Destination', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Process No.', header: 'Process No.', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Operations Steps', header: 'Operations Steps', style: { 'text-align': 'center', width: '700px' } },
       { field: 'Location', header: 'Location', style: { 'text-align': 'center', width: '500px' } },
       { field: 'UOM', header: 'UOM', style: { 'text-align': 'center', width: '500px' } },
       { field: 'Configuration', header: 'Configuration', style: { 'text-align': 'center', width: '300px' } },
       // ... add other static columns ...
 
       // Add dynamic columns based on location_takTime
       ...this.locations.map((location) => {
         return { field: location.locationName, header: location.locationName, style: { 'text-align': 'center' } };
       }),
     ];
   }


   showDialog(){
    this.visible = true;
   }
   // ---------------get UOM data------------------------//
   getUom() {
    this.uomOptions = [];
    this.MasterTableservice.getUom().subscribe((res: any) => {
      if (res?.message == "success") {
        this.uomOptions = res?.data;
      } else {
        this.uomOptions = [];
      }
    })
  }
  // ---------------get config data------------------------//
  getConfigurable() {
    this.configOptions = [];
    this.MasterTableservice.getConfigurable().subscribe((res: any) => {
      if (res?.message == "success") {
        this.configOptions = res?.data;
      } else {
        this.configOptions = [];
      }
    })
  }
  }

 
