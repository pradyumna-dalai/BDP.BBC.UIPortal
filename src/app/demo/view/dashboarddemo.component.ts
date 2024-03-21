import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../app.breadcrumb.service';
import { AppMainComponent } from '../../app.main.component';
import { TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { Accordion } from 'primeng/accordion';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss', './dashboard.component.scss']
})
export class DashboardDemoComponent implements OnInit, OnDestroy {

    showScopingCrad: boolean = true;
    showCommercialCrad: boolean = false;
    showOperationCrad: boolean = false;
    treeData: TreeNode[];
    treeDataNew: TreeNode[];
    subscription: Subscription;
    searchText: string = '';
    selectedNode: TreeNode;
    buildingBlockDetails: any;
    private _isExpanded = false;
    loading: boolean = false;
    itemId: number;
    operationDocId: number | null;
    fileName: any;
    showDownload: boolean = false;
    excelDataOpration: any;
    pdfView: boolean = false;
    constructor(private breadcrumbService: AppBreadcrumbService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
        this.breadcrumbService.setItems([
            { label: 'Building Blocks' }
        ]);
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngOnInit() {

        this.loadTreeData();
        this.loadTreeDataNew();
        this.onDraftItemClick();
        this.downloadOperationCardExcelView();

    }
    expandNode(node: TreeNode) {
        if (node.children) {
            node.expanded = true;
            node.children.forEach(childNode => {
                this.expandNode(childNode);
            });
        }
    }
    expandNodesBasedOnSearchResults() {
        this.treeDataNew.forEach((node) => {
            node.expanded = true;
            this.expandNode(node);
        });
    }
    expandNodesBasedOnDraftSearchResults() {
        this.treeData.forEach((node) => {
            node.expanded = true;
            this.expandNode(node);
        });
    }

    loadTreeData() {
        this.createBuildingBlockservice.getExplorerData(1).subscribe((data: any) => {
            this.treeData = this.transformData(data.data);
        },
            (error) => {
                console.error('Error loading tree data:', error);
            });
    }

    loadTreeDataNew() {
        this.createBuildingBlockservice.getExplorerData(2).subscribe((data: any) => {
            this.treeDataNew = this.transformData(data.data);

        },
            (error) => {
                console.error('Error loading tree data:', error);
            });
    }

    // Function to filter tree data based on search text
    onSearchChange() {
        if (this.searchText.trim() === '') {
            // If search text is empty, reload the original data
            this.loadTreeData();
            this.loadTreeDataNew();

        } else {
            this.treeData = this.filterTreeData(this.treeData, this.searchText);
            this.treeDataNew = this.filterTreeData(this.treeDataNew, this.searchText);
            this.expandNodesBasedOnSearchResults();
            this.expandNodesBasedOnDraftSearchResults();
        }
    }

    private transformData(data: any[]): TreeNode[] {
        return data.map((item) => {
            return {
                label: item.name,
                data: item,
                children: this.transformData(item.child || []),
            };
        });
    }


    private filterTreeData(data: TreeNode[], searchText: string): TreeNode[] {
        if (!data) {
            return [];
        }

        return data
            .map(node => this.filterNode(node, searchText))
            .filter(filteredNode => filteredNode !== null);
    }

    private filterNode(node: TreeNode, searchText: string): TreeNode | null {
        if (!node) {
            return null;
        }

        if (node.data?.type === 4 && node.label.toLowerCase().includes(searchText.toLowerCase())) {
            return {
                ...node,
                children: this.filterChildNodes(node.children, searchText),
            };
        }

        const filteredChildren = this.filterChildNodes(node.children, searchText);

        if (filteredChildren.length > 0) {
            return {
                ...node,
                children: filteredChildren,
            };
        }

        return null;
    }

    private filterChildNodes(children: TreeNode[] | undefined, searchText: string): TreeNode[] {
        if (!children) {
            return [];
        }

        return children
            .map(childNode => this.filterNode(childNode, searchText))
            .filter(filteredNode => filteredNode !== null);
    }


    onCardClick(val) {
        if (val == 'scoping') {
            this.showScopingCrad = true;
            this.showOperationCrad = false;
            this.showCommercialCrad = false;
        }
        if (val == 'operation') {
            this.showScopingCrad = false;
            this.showOperationCrad = true;
            this.showCommercialCrad = false;
            if (this.isPdfFile(this.fileName)) {
                this.downloadOperationCardPdfView();
            } else {
                this.downloadOperationCardExcelView();
            }

        }
        if (val == 'commercial') {
            this.showScopingCrad = false;
            this.showOperationCrad = false;
            this.showCommercialCrad = true;

        }

    }

    onNodeSelect(event: any): void {
        if (event.node && !event.node.children?.length) {
            this.loading = true;
            this.selectedNode = event.node;
            this.onDraftItemClick();
        } else {
            this.selectedNode = null;
        }
    }
    getLabel(node: any): string {
        const label = node.label;
        if (node.data?.type === 4  && window.innerWidth < 1600) {
          return label.length > 18 ? (label.slice(0, 18) + '...') : label;
        }
        else if(node.data?.type === 3  && window.innerWidth < 1600){
            return label.length > 18 ? (label.slice(0, 18) + '...') : label;
        }
        else if(node.data?.type === 2  && window.innerWidth < 1600){
            return label.length > 18 ? (label.slice(0, 18) + '...') : label;
        }
         else {
          return label;
        }
      }

    isPdfFile(fileName) {
        let fileNameSplit = fileName.split(".");
        this.pdfView = fileNameSplit[fileNameSplit.length-1] === 'pdf';
        return this.pdfView;
    }
    onDraftItemClick(): void {
        if (this.selectedNode) {
            this.itemId = this.selectedNode.data.id;
            this.createBuildingBlockservice.getBuildingBlockDetails(this.itemId).subscribe(
                (response: any) => {
                    this.buildingBlockDetails = response;
                    this.operationDocId = response.data.operationsCard?.id;
                    this.fileName = response.data.operationsCard?.name; 
                    this.showDownload = response.data.operationsCard !== null;
                    if (this.showDownload) {
                        if (!this.isPdfFile(this.fileName)) {
                            this.downloadOperationCardExcelView();
                            this.pdfView = false;
                            const preview = document.querySelector('iframe');
                            preview.style.visibility = 'hidden';
                        } else {
                            this.pdfView = true;
                            this.downloadOperationCardPdfView();
                        }
                    } else {
                        this.excelDataOpration = null;
                    }
                    this.loading = false;
                },
                (error) => {
                    console.error('Error loading building block details:', error);
                    this.loading = false;
                }
            );
        } else {
            this.selectedNode = null;
            this.buildingBlockDetails = null;
            this.operationDocId = null;
            this.fileName = null;
            this.showDownload = false;
            this.excelDataOpration = null;
        }
    }
    public get isExpanded() {
        return this._isExpanded;
    }

    public set isExpanded(value: boolean) {
        this._isExpanded = value;
    }

    downloadOperationCardExcel() {
        if (this.operationDocId != null) {
            this.createBuildingBlockservice.downloadUploadedOperationCard(this.operationDocId).subscribe(
                (data: ArrayBuffer) => {
                    const blob = new Blob([data]);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    //link.download = 'downloaded_file.xlsx';
                    link.download = this.fileName;
                    link.click();
                    window.URL.revokeObjectURL(url);
                },
                (error) => {
                    console.error('Error downloading file:', error);
                }
            );
        } else {
            console.error('Operation Card is null or undefined.');
        }
    }

     //-----------------------------------download for view of files-------------------------//
  downloadOperationCardExcelView() {
    if (this.operationDocId != null) {
      this.createBuildingBlockservice.downloadUploadedOperationCard(this.operationDocId).subscribe(
        (data: ArrayBuffer) => {
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          this.excelDataOpration = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        },
        (error) => {
          console.error('Error downloading file:', error);
        }
      );
    } else {
   //   console.error('Operation Card ID or Name is null or undefined.');
    }
  }

  downloadOperationCardPdfView() {
    if (this.operationDocId != null) {
        this.createBuildingBlockservice.downloadUploadedOperationPDFCard(this.operationDocId).subscribe(
            (data: Blob) => {
                const file = window.URL.createObjectURL(data);
                const iframe = document.querySelector("iframe");
                iframe.src = file;
                iframe.style.visibility = 'visible';
              },
              (error) => {
                console.error('Error downloading file:', error);
              }
        );
    }
  }

  //-----------------------------------end--------------------------------------------//

}






