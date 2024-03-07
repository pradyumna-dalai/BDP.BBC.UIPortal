import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { MasterTableService } from './../../../services/master-table.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';

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
 // Pagination properties
 currentPage: number = 1;
 pageSize: number = 10;
 sortField: string = ''; // Initial sort field
 sortOrder: number = 1; // 1 for ascending, -1 for descending

  totalRecords: any = 10;
  first: any = 0;
  rows: any = 10;
  newSortField: any;
  newSortOrder: any;
  searchTimeout: any;


 
jsonData:any;
data: any[] = []; // Add your data array here

  columns: any[] = []; // Dynamic columns
  locations: any[] = []; // Locations array from the JSON data
  uomOptions: any[];
  configOptions: any[];
  origin_destination = [
    { name: 'Origin', id: 'Origin' },
    { name: 'Destination', id: 'Destination' },
    { name: 'Origin/Destination', id: 'Origin/Destination' }
    // Add more options as needed
  ];
  fileName: string;
  uploadFile: File;
  uploadInProgress: boolean = false;
  showUploaderror: boolean = false;
  uploadErrors: { key: string; value: string }[] = [];
  constructor(private breadcrumbService: AppBreadcrumbService, private messageService: MessageService,private projectService: ProjectsService ,
    private confirmationService: ConfirmationService, private router: Router,public MasterTableservice: MasterTableService,public MasterDataservice: MasterDataService,
    ) {
    this.breadcrumbService.setItems([
      { label: 'Master Data Management' },
      { label: 'Process Configurables' }
    ]);
  

  }
  ngOnInit() {
   
    this.processConfigGetImportExcelData();
    this.getUom();
    this.getConfigurable();
   }
 // Add a method to toggle the edit mode for a specific row
 toggleEditMode(index: number) {
  // Toggle edit mode
  this.editModes[index] = !this.editModes[index];

  // If edit mode is toggled on, fetch UOM and Configuration options
  if (this.editModes[index]) {
    const rowData = this.data[index];
    this.getUom();
    this.getConfigurable();
    
    // Select UOM option if present in rowData
    const uomOption = this.uomOptions.find(option => option.name === rowData['UOM']);
    if (uomOption) {
      rowData['UOM'] = uomOption;
    }
    
    // Select Configuration option if present in rowData
    const configOption = this.configOptions.find(option => option.name === rowData['Configuration']);
    if (configOption) {
      rowData['Configuration'] = configOption;
    }
  }
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
    { field: 'Product Name', header: 'Product Name', sortingField: 'pn', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Product Scope', header: 'Product Scope', sortingField: 'sc', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Product Category', header: 'Product Category', sortingField: 'ca', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Building Block Name', header: 'Building Block Name', sortingField: 'bb', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Origin / Destination', header: 'Origin / Destination', sortingField: 'od', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Process No.', header: 'Process No.', sortingField: 'pnum', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Operations Steps', header: 'Operations Steps', sortingField: 'os', style: { 'text-align': 'center', width: '700px' } },
    // { field: 'Location', header: 'Location', sortingField: 'location', style: { 'text-align': 'center', width: '500px' } },
    { field: 'UOM', header: 'UOM', sortingField: 'uom', style: { 'text-align': 'center', width: '500px' } },
    { field: 'Configuration', header: 'Configuration', sortingField: 'cn', style: { 'text-align': 'center', width: '300px' } },
       // ... add other static columns ...
 
       // Add dynamic columns based on location_takTime
       ...this.locations.map((location) => {
         return { field: location.name, header: location.name, style: { 'text-align': 'center',width: '300px' } };
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
// ---------------save process------------------------//
saveProcess(rowData: any){
  const locations = [];
  const dynamicColumns = Object.keys(rowData).filter(key => {
    const columnIndex = this.columns.findIndex(col => col.field === key);
    return columnIndex > -1 && columnIndex > this.columns.findIndex(col => col.field === 'Configuration');
  });

  // Iterate over dynamic columns to extract location and taktTime data
  dynamicColumns.forEach(key => {
    const locationName = key;
    const taktTime = rowData[key] || 'NA'; // Default to 'NA' if taktTime is not provided
    const location = {
      name: locationName,
      takTime: taktTime
    };
    locations.push(location);
  });
  const body = [{
    product: rowData['Product Name'],
    scope: rowData['Product Scope'],
    category: rowData['Product Category'],
    block: rowData['Building Block Name'],
    originDestination: rowData['Origin / Destination'],
    processNumber: rowData['Process No.'],
    operationStep: rowData['Operations Steps'],
    uom: rowData['UOM'],
    configurable: rowData['Configuration'],
    locations: locations
  }];
 
      this.MasterDataservice.saveProcess(body).subscribe(
          (res) => {
            this.processConfigGetImportExcelData();
          },
         
      );
  } 
   // ---------------get process config excel data------------------------//
   processConfigGetImportExcelData() {
    const params = {
      buildingBlockName: "",
      pageNo: isNaN(this.currentPage) ? 0 : this.currentPage - 1,
      pageSize: isNaN(this.pageSize) ? 10 : this.pageSize,
      sortBy: this.sortField,
      sortDir: this.sortOrder,

  };
    this.MasterDataservice.processConfigGetImportExcelData(params).subscribe((res: any) => {
      if (res?.message == "success") {
         this.jsonData = res;

    // Access the JSON data using this.jsonData
    const processConfigurable = this.jsonData.data.processConfig;
     // Extract locations and initialize dynamic columns
     this.locations = processConfigurable[0].locations;
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
       rowData['Origin / Destination'] = item.originDestination;
       rowData['Process No.'] = item.processNumber;
       rowData['Operations Steps'] = item.operationStep;
       rowData['Location'] = '';
       rowData['UOM'] = item.uom;
       rowData['Configuration'] = item.configurable;
 
      // Map dynamic columns based on locations
      this.locations.forEach((location) => {
      const locationData = item.locations.find(loc => loc.name === location.name);
      rowData[location.name] = locationData ? locationData.takTime : 'NA';
      });
       return rowData;
     });
     // Initialize edit mode for each row to false
    this.editModes = Array(this.data.length).fill(false);
    this.totalRecords = res?.data.totalElements;
      } else {
        console.log("error");
        this.totalRecords = 0;
      }
    })
  }
  editProcess(){

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
 

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.processConfigGetImportExcelData();
  }
  onSort(event: any) {
    // Get the field name corresponding to the response data
    const fieldName = this.columns.find(column => column.sortingField === event.field)?.field;
    
    // Update sort field and order
    if (fieldName !== undefined) {
        this.newSortField = event.field;
        this.newSortOrder = (event.order === 1) ? 'asc' : 'desc';
        
        if (this.newSortField !== this.sortField || this.newSortOrder !== this.sortOrder) {
            this.sortField = this.newSortField;
            this.sortOrder = this.newSortOrder;
            this.currentPage = 1;
            
            // Call your data service method to fetch data with sorting
           this.processConfigGetImportExcelData();
        }
    }
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

 
