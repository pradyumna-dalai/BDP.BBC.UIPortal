import { Component } from '@angular/core';

@Component({
  selector: 'app-cost-line-item',
  templateUrl: './cost-line-item.component.html',
  styleUrls: ['./cost-line-item.component.scss']
})
export class CostLineItemComponent {
  editing:boolean

  ///add voulume & CLI///
showOriginVolume: boolean = true;
showDestinationVolume: boolean = false;
originButtonColor: string = 'white';
destinationButtonColor: string = 'rgb(0, 110, 255)';
originButtonBorder: string = '1px solid rgb(0, 110, 255)';
destinationButtonBorder: string = '1px solid rgb(0, 110, 255)';
originButtonBorderRadius: string = '5px';
destinationButtonBorderRadius: string = '5px';
showOriginCLI: boolean = true;
showDestinationCLI:boolean = false;
//end//

  onRowEditInit(event:any){

  }
  onRowEditSave(event:any){

  }
  onRowEditCancel(){
    
  }
  //---------------------------------Cost line item--------------------------------------------//

showOriginSectionCLI() {
  this.showOriginCLI = true;
  this.showDestinationCLI = false;
  this.originButtonColor = 'white';
  this.destinationButtonColor = 'rgb(0, 110, 255)';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}

showDestinationSectionCLI() {
  this.showOriginCLI = false;
  this.showDestinationCLI = true;
  this.originButtonColor = 'rgb(0, 110, 255)';
  this.destinationButtonColor = 'white';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}
//---------------------------------End--------------------------------------------//

}
