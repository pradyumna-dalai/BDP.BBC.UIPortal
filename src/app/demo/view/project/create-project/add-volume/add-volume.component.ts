import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';

@Component({
  selector: 'app-add-volume',
  templateUrl: './add-volume.component.html',
  styleUrls: ['./add-volume.component.scss']
})
export class AddVolumeComponent implements OnInit {

Add_Volume:any;
  constructor(private projectService:ProjectsService){

  }

  ngOnInit(){

  }

  shareFunctionAddVolume(){
    this.projectService.buildingData$.subscribe((res)=>{
      console.log("call Add",res);
      this.Add_Volume = res
    })
  }
}