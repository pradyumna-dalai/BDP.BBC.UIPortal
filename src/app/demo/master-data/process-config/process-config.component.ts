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



  jsonData= {
    "status": 200,
    "message": "success",
    "data": [
      {

        "product": "LLP",

        "scope": "Export Facilitation",

        "category": "Supply Chain Insights",

        "block": "Customer Onboarding & Training",

        "origin": "Origin",

        "process": "1",

        "operationStep": "Customer send booking request for pre-leg. ",

        "uom": "Order",

        "configuration": null,

        "location": [{

                "name": "EPIM",

                "takTime": "NA"

            }, {

                "name": "EPIY",

                "takTime": "NA"

            }, {

                "name": "EPIP",

                "takTime": "NA"

            }, {

                "name": "Singapore",

                "takTime": "NA"

            }, {

                "name": "Shanghai",

                "takTime": "NA"

            }, {

                "name": "Mumbai",

                "takTime": "NA"

            }, {

                "name": "Houston",

                "takTime": "NA"

            }, {

                "name": "Ashton",

                "takTime": "NA"

            }, {

                "name": "Antwerp",

                "takTime": "NA"

            }, {

                "name": "Rotterdam",

                "takTime": "NA"

            }, {

                "name": "Istanbul",

                "takTime": "NA"

            }, {

                "name": "Saudi Arabia",

                "takTime": "NA"

            }

        ]

    },
    {

      "product": "LLP",

      "scope": "Export Facilitation",

      "category": "Supply Chain Insights",

      "block": "Customer Onboarding & Training",

      "origin": "Origin",

      "process": "2",

      "operationStep": "Customer send booking request for pre-leg. ",

      "uom": "Order",

      "configuration": null,

      "location": [{

              "name": "EPIM",

              "takTime": "NA"

          }, {

              "name": "EPIY",

              "takTime": "NA"

          }, {

              "name": "EPIP",

              "takTime": "NA"

          }, {

              "name": "Singapore",

              "takTime": "NA"

          }, {

              "name": "Shanghai",

              "takTime": "NA"

          }, {

              "name": "Mumbai",

              "takTime": "NA"

          }, {

              "name": "Houston",

              "takTime": "NA"

          }, {

              "name": "Ashton",

              "takTime": "NA"

          }, {

              "name": "Antwerp",

              "takTime": "NA"

          }, {

              "name": "Rotterdam",

              "takTime": "NA"

          }, {

              "name": "Istanbul",

              "takTime": "NA"

          }, {

              "name": "Saudi Arabia",

              "takTime": "NA"

          }

      ]

  },
{

        "product": "Trade Management & Customs",

        "scope": "Warehousing",

        "category": "Warehousing",

        "block": "Vendor Onboarding",

        "origin": "Origin",

        "process": "3",

        "operationStep": "Customer send booking request for pre-leg. ",

        "uom": "Order",

        "configuration": null,

        "location": [{

                "name": "EPIM",

                "takTime": "3.5"

            }, {

                "name": "EPIY",

                "takTime": "NA"

            }, {

                "name": "EPIP",

                "takTime": "NA"

            }, {

                "name": "Singapore",

                "takTime": "NA"

            }, {

                "name": "Shanghai",

                "takTime": "1.2"

            }, {

                "name": "Mumbai",

                "takTime": "NA"

            }, {

                "name": "Houston",

                "takTime": "NA"

            }, {

                "name": "Ashton",

                "takTime": "NA"

            }, {

                "name": "Antwerp",

                "takTime": "NA"

            }, {

                "name": "Rotterdam",

                "takTime": "NA"

            }, {

                "name": "Istanbul",

                "takTime": "NA"

            }, {

                "name": "Saudi Arabia",

                "takTime": "NA"

            }

        ]

    },{

        "product": "Trade Management & Customs",

        "scope": "Warehousing",

        "category": "Warehousing",

        "block": "Vendor Onboarding",

        "origin": "Origin",

        "process": "4",

        "operationStep": "Customer send booking request for pre-leg. ",

        "uom": "Order",

        "configuration": null,

        "location": [{

                "name": "EPIM",

                "takTime": "3.5"

            }, {

                "name": "EPIY",

                "takTime": "NA"

            }, {

                "name": "EPIP",

                "takTime": "NA"

            }, {

                "name": "Singapore",

                "takTime": "NA"

            }, {

                "name": "Shanghai",

                "takTime": "1.2"

            }, {

                "name": "Mumbai",

                "takTime": "NA"

            }, {

                "name": "Houston",

                "takTime": "NA"

            }, {

                "name": "Ashton",

                "takTime": "NA"

            }, {

                "name": "Antwerp",

                "takTime": "NA"

            }, {

                "name": "Rotterdam",

                "takTime": "NA"

            }, {

                "name": "Istanbul",

                "takTime": "NA"

            }, {

                "name": "Saudi Arabia",

                "takTime": "NA"

            }

        ]

    }
    ]
};

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
       rowData['Process No.'] = item.process;
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
         return { field: location.locationName, header: location.name, style: { 'text-align': 'center',width: '300px' } };
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

 
