import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-building-block',
  templateUrl: './building-block.component.html',
  styleUrls: ['./building-block.component.scss']
})
export class BuildingBlockComponent implements OnInit {
@Input() createProject;

ngOnInit(){
console.log("dfd",this.createProject)
}

}
