/**
 * @export
 * @class AppEndPoint
 */

export namespace AppRoutes {
    export abstract class Auth {
        // --------------------get all master dropdown data-----------------------//

        public static readonly getProductName = "active-product";
        public static readonly getProductScope = "scope";
        public static readonly getProductCtegory = "category";
        public static readonly getchargeCode = "active-chargeCode";
        public static readonly getModeofTransport = "mode-of-transport";
        public static readonly getProjectStatus = "project-status";
        public static readonly getRegion = "region";
        public static readonly getCompany = "company";
        public static readonly getProjectStage = "project-stage";
        public static readonly getOpportunityManger = "opportunity-manager";
        public static readonly getOpportunityName = "opportunity-name";
        public static readonly getIndustryVertical = "industry-vertical";
        public static readonly getUom = "active-uom";
        public static readonly getConfigurable = "configurable";

        // --------------------create building block----------------------//

        // --------------------create building block----------------------//

        public static readonly saveEditBuildingBlock = "buildingblock";

        //Explorer view of building block 

        public static readonly getexploreViewBuildingBlock = "buildingblock";


        public static readonly getMenuItem = "ui/menu";

        public static readonly getbuildingBlockDetailsView = "buildingblock";

        public static readonly scopingCradImportExcel = "upload-scoping-card";

        public static readonly commercialCradImportExcel = "upload-commercial-card";

        public static readonly downloadSampleSCExcel = "download-file?file=sc";

        public static readonly downloadSampleCCExcel = "download-file?file=com";

        public static readonly downloadSampleOPExcel = "download-file?file=op";


        ///--------------------- Common File Operation -----------------------//
        public static readonly CommonUpload = "file/upload";

        public static readonly downloadOperationExcel = "file/download";

        public static readonly deleteProjectFile = "file";

        public static readonly getAllFiles = "file";


        //--------------------Project filter--------//
        public static readonly getprojectStatus = "project-status";

        public static readonly getopportunityManager = "opportunity-manager";

        public static readonly getallProject = "company";

        public static readonly getOpportuniyByCompany = "opportunity-name";


        // --------------------create project---------------//

        public static readonly saveProjectDraft = "project";

        public static readonly getallProjects = "all-projects";

        public static readonly exportProjectsinExcel = "export-project";

        public static readonly searchProject = "project-search";

        public static readonly activeLocation = "active-location";

        public static readonly activeUom = "active-uom";

        //---------------------master-data----------------//

        public static readonly location = "location";

        public static readonly country = "country";

        public static readonly downloadLocation = "download-location";

        //--------------------------Scope ---------------//
        public static readonly scope ="scope";

        public static readonly downloadScope = "download-scope";

        public static readonly category ="category";

        public static readonly downloadCategory = "download-category";
        

        public static readonly  chargecode = "charge-code";

        public static readonly downloadChargecode = "download-chargeCode";

        public static readonly  product = "product";

        public static readonly downloadProduct = "download-product";

        public static readonly  uom = "uom";

        public static readonly downloadUOM = "download-uom";
        
    
        public static readonly active_location = "active-location"

        //------FTE-----------------------//
        public static readonly fte = "fte"
        public static readonly downloadfte = "download-fte"
        public static readonly projectName = "project-name"

       //------process configurable-----------------------//
         
       public static readonly getProcessConfigurable  = "process"

       public static readonly saveProcessConfigurable  = "process"


       //-------------------------Project Building BLock -------------//

       public static readonly getProcessStepbyBlockId = "process";

       public static readonly ProjectBuildingBlock = "project-block-location";

       public static readonly otherCost = "project/other-cost";

        
       public static readonly project = "project";
       public static readonly otherCosts = "other-cost";
       //------add volume(Project)-----------------------//
       
       public static readonly getAddVoulmeDetails  = "volume"

       public static readonly saveVoulmeDetails  = "project/volume"

       //------End-----------------------//

        //------cost line item(Project)-----------------------//
       
        public static readonly getCostLineItemDetails  = "cost-line-item"

        public static readonly saveCostLineItemDetails  = "project/cost-line-item"

        public static readonly reCalculateCostLine  = "recalculate-cost-line"
 
        //------End-----------------------//

    }

    export abstract class UserApi {
        public static readonly GET_USERS = "api/v1/user";
        public static readonly APP_USERS = "api/app/v1";
        public static readonly GET_USERS_PUBLIC = "public/users";
        public static readonly GET_GLOBAL_API = "api/app/v1";
        public static readonly REGISTRATION = "public/user/registration";

        public static readonly GET_USER_BY_EMAIL = UserApi.GET_USERS;
        public static readonly GET_CURRENT_USER = UserApi.GET_USERS + "/getUser";
        public static readonly ADD_USER = UserApi.GET_USERS;
        public static readonly UPDATE_USER = UserApi.GET_USERS;
        public static readonly UPDATE_USER_PROFILE = UserApi.GET_USERS + "/updateUserProfile";
        public static readonly GET_USER_APPS = UserApi.GET_USERS + "/getAssignedApps";
        public static readonly IS_PASSWORD_EXPIRED = UserApi.APP_USERS + "/isPwdExpired";
        public static readonly IS_APP_PERMITTED = UserApi.APP_USERS + "/isAppPermitted";
        public static readonly EULA_VALIDATE = UserApi.APP_USERS + "/eula/validate";
        public static readonly GET_ALL_APPS = UserApi.GET_GLOBAL_API + "/get-all-apps";
        public static readonly APP_HIT_LOG = UserApi.GET_GLOBAL_API + "/log-login";

    }

}