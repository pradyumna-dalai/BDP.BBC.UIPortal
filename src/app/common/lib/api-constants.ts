/**
 * @export
 * @class AppEndPoint
 */

export namespace AppRoutes {
    export abstract class Auth {

        // --------------------get all master dropdown data-----------------------//

        public static readonly getProductName = "product";
        public static readonly getProductScope = "scope";
        public static readonly getProductCtegory = "category";
        public static readonly getchargeCode = "charge-code";
        public static readonly getModeofTransport = "mode-of-transport";
        public static readonly getProjectStatus = "project-status";
        public static readonly getRegion = "region";
        public static readonly getCompany = "company";
        public static readonly getProjectStage = "project-stage";
        public static readonly getOpportunityManger = "opportunity-manager";
        public static readonly getOpportunityName = "opportunity-name";
        public static readonly getIndustryVertical = "industry-vertical";

        // --------------------create building block----------------------//

        // --------------------create building block----------------------//

        public static readonly saveEditBuildingBlock = "buildingblock";

        //Explorer view of building block 

        public static readonly getexploreViewBuildingBlock = "buildingblock";


        public static readonly getMenuItem = "ui/menu";

        public static readonly getbuildingBlockDetailsView = "buildingblock";

        public static readonly scopingCradImportExcel = "upload-excel";

        public static readonly commercialCradImportExcel = "upload-commercial-card";

        public static readonly downloadSampleSCExcel = "download-file?file=sc";

        public static readonly downloadSampleCCExcel = "download-file?file=com";



        //--------------------Project filter--------//
        public static readonly getprojectStatus = "project-status";

        public static readonly getopportunityManager = "opportunity-manager";

        public static readonly getallProject = "company";

        public static readonly getOpportuniyByCompany = "opportunity-name";


        // --------------------create project---------------//

        public static readonly saveProjectDraft = "project";

        public static readonly getallProjects = "projects";

        public static readonly exportProjectsinExcel = "export-project";


        //---------------------master-data----------------//

        public static readonly  getallLocations = "location";

    }

}