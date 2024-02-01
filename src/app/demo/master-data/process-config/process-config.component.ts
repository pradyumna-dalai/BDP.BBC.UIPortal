import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterTableService } from './../../../services/master-table.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';

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

//   jsonData= {
//     "status": 200,
//     "message": "success",
//     "data": [
//       {
//         "id":1,
//         "product": "LLP",

//         "scope": "Export Facilitation",

//         "category": "Supply Chain Insights",

//         "block": "Customer Onboarding & Training",

//         "origin": "Origin",

//         "process": "1",

//         "operationStep": "Customer send booking request for pre-leg. ",

//         "uom": "Order",

//         "configuration": null,

//         "location": [{

//                 "name": "EPIM",

//                 "takTime": "NA"

//             }, {

//                 "name": "EPIY",

//                 "takTime": "NA"

//             }, {

//                 "name": "EPIP",

//                 "takTime": "NA"

//             }, {

//                 "name": "Singapore",

//                 "takTime": "NA"

//             }, {

//                 "name": "Shanghai",

//                 "takTime": "NA"

//             }, {

//                 "name": "Mumbai",

//                 "takTime": "NA"

//             }, {

//                 "name": "Houston",

//                 "takTime": "NA"

//             }, {

//                 "name": "Ashton",

//                 "takTime": "NA"

//             }, {

//                 "name": "Antwerp",

//                 "takTime": "NA"

//             }, {

//                 "name": "Rotterdam",

//                 "takTime": "NA"

//             }, {

//                 "name": "Istanbul",

//                 "takTime": "NA"

//             }, {

//                 "name": "Saudi Arabia",

//                 "takTime": "NA"

//             }

//         ]

//       },
//       {
//         "id":2,
//         "product": "LLP",

//         "scope": "Export Facilitation",

//         "category": "Supply Chain Insights",

//         "block": "Customer Onboarding & Training",

//         "origin": "Origin",

//         "process": "2",

//         "operationStep": "Customer send booking request for pre-leg. ",

//         "uom": "Order",

//         "configuration": null,

//         "location": [{

//                 "name": "EPIM",

//                 "takTime": "NA"

//             }, {

//                 "name": "EPIY",

//                 "takTime": "NA"

//             }, {

//                 "name": "EPIP",

//                 "takTime": "NA"

//             }, {

//                 "name": "Singapore",

//                 "takTime": "NA"

//             }, {

//                 "name": "Shanghai",

//                 "takTime": "NA"

//             }, {

//                 "name": "Mumbai",

//                 "takTime": "NA"

//             }, {

//                 "name": "Houston",

//                 "takTime": "NA"

//             }, {

//                 "name": "Ashton",

//                 "takTime": "NA"

//             }, {

//                 "name": "Antwerp",

//                 "takTime": "NA"

//             }, {

//                 "name": "Rotterdam",

//                 "takTime": "NA"

//             }, {

//                 "name": "Istanbul",

//                 "takTime": "NA"

//             }, {

//                 "name": "Saudi Arabia",

//                 "takTime": "NA"

//             }

//         ]

//       },
//       {
//           "id":3,
//           "product": "Trade Management & Customs",

//           "scope": "Warehousing",

//           "category": "Warehousing",

//           "block": "Vendor Onboarding",

//           "origin": "Origin",

//           "process": "1",

//           "operationStep": "Customer send booking request for pre-leg. ",

//           "uom": "Order",

//           "configuration": null,

//           "location": [{

//                   "name": "EPIM",

//                   "takTime": "3.5"

//               }, {

//                   "name": "EPIY",

//                   "takTime": "NA"

//               }, {

//                   "name": "EPIP",

//                   "takTime": "NA"

//               }, {

//                   "name": "Singapore",

//                   "takTime": "NA"

//               }, {

//                   "name": "Shanghai",

//                   "takTime": "1.2"

//               }, {

//                   "name": "Mumbai",

//                   "takTime": "NA"

//               }, {

//                   "name": "Houston",

//                   "takTime": "NA"

//               }, {

//                   "name": "Ashton",

//                   "takTime": "NA"

//               }, {

//                   "name": "Antwerp",

//                   "takTime": "NA"

//               }, {

//                   "name": "Rotterdam",

//                   "takTime": "NA"

//               }, {

//                   "name": "Istanbul",

//                   "takTime": "NA"

//               }, {

//                   "name": "Saudi Arabia",

//                   "takTime": "NA"

//               }

//           ]

//       },{
//       "id":4,
//         "product": "Trade Management & Customs",

//         "scope": "Warehousing",

//         "category": "Warehousing",

//         "block": "Vendor Onboarding",

//         "origin": "Origin",

//         "process": "2",

//         "operationStep": "Customer send booking request for pre-leg. ",

//         "uom": "Order",

//         "configuration": null,

//         "location": [{

//                 "name": "EPIM",

//                 "takTime": "3.5"

//             }, {

//                 "name": "EPIY",

//                 "takTime": "NA"

//             }, {

//                 "name": "EPIP",

//                 "takTime": "NA"

//             }, {

//                 "name": "Singapore",

//                 "takTime": "NA"

//             }, {

//                 "name": "Shanghai",

//                 "takTime": "1.2"

//             }, {

//                 "name": "Mumbai",

//                 "takTime": "NA"

//             }, {

//                 "name": "Houston",

//                 "takTime": "NA"

//             }, {

//                 "name": "Ashton",

//                 "takTime": "NA"

//             }, {

//                 "name": "Antwerp",

//                 "takTime": "NA"

//             }, {

//                 "name": "Rotterdam",

//                 "takTime": "NA"

//             }, {

//                 "name": "Istanbul",

//                 "takTime": "NA"

//             }, {

//                 "name": "Saudi Arabia",

//                 "takTime": "NA"

//             }

//         ]

//     }
//     ]
// };

 
jsonData:any;
loading: boolean = true;
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
  fileName: string;
  uploadFile: File;
  uploadInProgress: boolean = false;
  showUploaderror: boolean = false;
  uploadErrors: { key: string; value: string }[] = [];
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,private projectService: ProjectsService ,
    private confirmationService: ConfirmationService, private router: Router,public MasterTableservice: MasterTableService,
    ) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Process Configurables' }
    ]);
  

  }
  ngOnInit() {
    // // Access the JSON data using this.jsonData
    // const processConfigurable = this.jsonData.data;
    //  // Extract locations and initialize dynamic columns
    //  this.locations = processConfigurable[0].location;
    //  this.initializeColumns();
 
    //  // Process the data and map it to dynamic columns
    //  this.data = processConfigurable.map((item) => {
    //    const rowData: any = {};
 
    //    // Map static columns
    //   //  rowData['Actions'] = `<span style="cursor: pointer;"><i class="pi pi-pencil"></i></span>`;
    //    rowData['Product Name'] = item.product;
    //    rowData['Product Scope'] = item.scope;
    //    rowData['Product Category'] = item.category;
    //    rowData['Building Block Name'] = item.block;
    //    rowData['Origin / Destination'] = item.origin;
    //    rowData['Process No.'] = item.process;
    //    rowData['Operations Steps'] = item.operationStep;
    //    rowData['Location'] = '';
    //    rowData['UOM'] = item.uom;
    //    rowData['Configuration'] = item.configuration;
 
    //    // Map dynamic columns based on location_takTime
    //    this.locations.forEach((location) => {
    //      rowData[location.locationName] = item.location.find(
    //        (loc) => loc.name === location.name
    //      )?.takTime;
    //    });
 
    //    return rowData;
    //  });
    //  // Initialize edit mode for each row to false
    // this.editModes = Array(this.data.length).fill(false);
    this.processConfigGetImportExcelData();
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
addNewRow(index: number) {
  // Create a new row with the same data as the clicked row
  const newRow = { ...this.data[index] };
  newRow.id = null;
  
  // Insert the new row just below the clicked row
  this.data.splice(index + 1, 0, newRow);
  
  // Set edit mode to true for the new row
  this.editModes.splice(index + 1, 0, true);
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
         return { field: location.locationName, header: location.name, style: { 'text-align': 'center',width: '300px' } };
       }),
     ];
   }


   showDialog(){
    this.visible = true;
   }
   onUploadSCExcel(event: any) {
    const file:File = event.target.files[0];
    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("file", file);
        this.uploadFile = file;
    }
  }
// ---------------upload Excel------------------------//
   excelUploadcall(){
  this.fileName = this.uploadFile.name;
  const formData = new FormData();
  formData.append("file", this.uploadFile);
  this.uploadInProgress = true;
    this.projectService.processConfigImportExcel(formData).subscribe(
      (res: any) => {
        this.jsonData = res;
        // Access the JSON data using this.jsonData
        const processConfigurable = this.jsonData.data;
        // Extract locations and initialize dynamic columns
        this.locations = processConfigurable[0].location;
        this.initializeColumns();
    
        // Process the data and map it to dynamic columns
        this.data = processConfigurable.map((item) => {
          const rowData: any = {};
    
          // Map static columns
          //  rowData['Actions'] = `<span style="cursor: pointer;"><i class="pi pi-pencil"></i></span>`;
          rowData['Product Name'] = item.product;
          rowData['Product Scope'] = item.scope;
          rowData['Product Category'] = item.category;
          rowData['Building Block Name'] = item.block;
          rowData['Origin / Destination'] = item.origin;
          rowData['Process No.'] = item.processNumber;
          rowData['Operations Steps'] = item.operationStep;
          rowData['Location'] = '';
          rowData['UOM'] = item.uom;
          rowData['Configuration'] = item.configuration;
    
          // Map dynamic columns based on location_takTime
          this.locations.forEach((location) => {
            rowData[location.locationName] = item.location.find(
              (loc) => loc.name === location.name
            )?.takTime;
          });
    
          return rowData;
        });
        // Initialize edit mode for each row to false
        this.editModes = Array(this.data.length).fill(false);
        this.uploadInProgress = false;
      },
      (error) => {
        // Handle HTTP errors here
        console.log(error);
        this.showUploaderror = true;
        this.uploadInProgress = false;
        // Extract error messages and keys from the response and store them in uploadErrors
        if (error.status === 400 && error.error && error.error.data) {
          this.uploadErrors = Object.entries(error.error.data).map(([key, value]) => ({ key, value: String(value) }));
        }
      }
    );
   }
  onPopupCancelclick()
  {
    this.visible = false;
      this.fileName = "";
      this.uploadFile = null;
      // Add the following line to reset the file input
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Clear the file input value
      }
   }
   onCancelClick(){
    this.showUploaderror = false;
    this.fileName = "";
    this.uploadFile = null;
  
    // Add the following line to reset the file input
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input value
    }
   }
  // ---------------get process config excel data------------------------//
  processConfigGetImportExcelData() {
    this.loading = true; // Set loading to true before making the API call
    this.projectService.processConfigGetImportExcelData().subscribe((res: any) => {
      if (res?.message == "success") {
         this.jsonData = res;

        // Access the JSON data using this.jsonData
    const processConfigurable = this.jsonData.data;
     // Extract locations and initialize dynamic columns
     this.locations = processConfigurable[0].location;
     this.initializeColumns();
 
     // Process the data and map it to dynamic columns
     this.data = processConfigurable.map((item) => {
       const rowData: any = {};
 
       // Map static columns
      //  rowData['Actions'] = `<span style="cursor: pointer;"><i class="pi pi-pencil"></i></span>`;
       rowData['Product Name'] = item.product;
       rowData['Product Scope'] = item.scope;
       rowData['Product Category'] = item.category;
       rowData['Building Block Name'] = item.block;
       rowData['Origin / Destination'] = item.origin;
       rowData['Process No.'] = item.processNumber;
       rowData['Operations Steps'] = item.operationStep;
       rowData['Location'] = '';
       rowData['UOM'] = item.uom;
       rowData['Configuration'] = item.configuration;
 
       // Map dynamic columns based on location_takTime
       this.locations.forEach((location) => {
         rowData[location.locationName] = item.location.find(
           (loc) => loc.name === location.name
         )?.takTime;
       });
 
       return rowData;
     });
     // Initialize edit mode for each row to false
    this.editModes = Array(this.data.length).fill(false);
      } else {
        console.log("error");
      }
      this.loading = false; 
    })
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

 
