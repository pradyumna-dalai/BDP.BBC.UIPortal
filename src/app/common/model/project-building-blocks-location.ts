import { BuildingBlock, OriginDestinationService } from "./project-building-block"

export class ProjectBuildingBlocksLocation {
    projectId: number
    projectName: string
    buildingBlocks: BuildingBlock[]
  }

  export class SelectedBuildingBlockProcess
  {
    buildingBlockId : number;
    processId : number;
    processNumber : number;
    processName:string;
    originService:      OriginDestinationService;
    destinationService: OriginDestinationService;

  }