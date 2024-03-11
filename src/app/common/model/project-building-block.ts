 
  export class BuildingBlock {
    buildingBlockId:    number;
    buildingBlockName:  string;
    serviceDescription: string;
    processes:          Process[];
  }
  
  export class Process {
    processId:          number;
    processNumber:      number;
    processName:        string;
    // Below field holds the active status as below
    // If Process has no configuration process step will be inactive state. In ui it will show as grey in inactive state.
    // If Process has any configuration process step will be active state. In ui it will show as blue in active state.
    // If Process has any configuration with location process step will be active state. In ui it will show as green in active state.
    processActiveStatus: number;
    originService:      OriginDestinationService;
    destinationService: OriginDestinationService;
  }
  
  export class OriginDestinationService {
    configurations: Configuration[];
}


export class Configuration {
    configurableId:   number;
    configurableName: string;
    locations:        Location[];
}
  
export class Location {
    locationId:      number;
    locationName:    string;
    isSelected     : boolean;
    volume:          number;
    uomId:           number;
    uomName:         string;
    takt:            number;
    complexity:      number;
    taktConsidered:  number;
    totalCost:       number;
    totalHC:         number;
    fteProductivity: number;
    fteCost:         number;
    comment:         null;
}

export class LocationIdName {
    locationId : number;
    locationName : string;
    unloc : string;

}
  