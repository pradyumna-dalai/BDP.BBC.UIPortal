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

        // --------------------create building block----------------------//

        public static readonly saveEditBuildingBlock = "buildingblock";

        //Explorer view of building block 

        public static readonly getexploreViewBuildingBlock = "buildingblock";


        public static readonly getMenuItem = "ui/menu";

        public static readonly getbuildingBlockDetailsView = "buildingblock";


        public static readonly getprojectStatus = "status";

        public static readonly getopportunityManager = "opportunity-manager";

    }

}