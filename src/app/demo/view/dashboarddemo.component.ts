import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppBreadcrumbService } from '../../app.breadcrumb.service';
import { AppMainComponent } from '../../app.main.component';
import { TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { Accordion } from 'primeng/accordion';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
    onDraftItemClick(): void {
        if (this.selectedNode) {
            this.itemId = this.selectedNode.data.id;
            this.createBuildingBlockservice.getBuildingBlockDetails(this.itemId).subscribe(
                (response: any) => {
                    this.buildingBlockDetails = response;
                    this.operationDocId = response.data.operationsCard?.id;
                    this.fileName = response.data.operationsCard?.name; 
                 //   console.log('Building Block Details for explore view:', this.fileName);
                    this.loading = false;
                },
                (error) => {
                    console.error('Error loading building block details:', error);
                    this.loading = false;
                }
            );
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

}






