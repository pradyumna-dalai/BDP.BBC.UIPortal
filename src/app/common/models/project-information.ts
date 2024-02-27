import { ProjectLocation } from "./project-location";

export class ProjectInformation
{
    customerCode:       string;
    projectName:        string;
    startDate:          Date;
    endDate:            Date;
    designNote:         string;
    implementationNote: string;
    company:            any;
    opportunityName:    any;
    industryVertical:   any;
    region:             any;
    projectStage:       any;
    projectStatus:      any;
    opportunityManager: any[];
    projectLocation:    ProjectLocation[];
}