/**
 * @export
 * @class AppEndPoint
 */

export namespace AppRoutes {
    export abstract class Auth 
    {

    // --------------------get all master dropdown data-----------------------//

    public static readonly getProductName = "product";
    public static readonly getProductScope = "scope";
    public static readonly getProductCtegory = "category";
    public static readonly getchargeCode = "charge-code";
    public static readonly getModeofTransport = "mode-of-transport";
    public static readonly getProjectStatus = "status";
    public static readonly getRegion = "region";
    public static readonly getCompany = "company";
    
     // --------------------create building block----------------------//

    public static readonly saveEditBuildingBlock = "buildingblock";

    //Explorer view of building block 

    public static readonly getexploreViewBuildingBlock = "buildingblock";
    //public static readonly getexploreViewBuildingBlockNew = "buildingblock?status=2";

    public static readonly getMenuItem = "ui/menu";

    public static readonly getbuildingBlockDetailsView = "buildingblock";
    
    }
    
}