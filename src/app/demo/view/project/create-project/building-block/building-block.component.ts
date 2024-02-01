import { Component, Input, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';

@Component({
  selector: 'app-building-block',
  templateUrl: './building-block.component.html',
  styleUrls: ['./building-block.component.scss']
})
export class BuildingBlockComponent implements OnInit {
  @Input() createProject;

  constructor(private projectService:ProjectsService) {
    
  }
 

  ngOnInit() {
    console.log("dfd", this.createProject)
 
      this.projectService.shareBuildingData(this.createProject);
    
  }

}
