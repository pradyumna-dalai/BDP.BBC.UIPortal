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
    
     // --------------------create building block----------------------//

    public static readonly createBuildingBlock = "buildingblock";

    //Explorer view of building block 

    public static readonly getexploreViewBuildingBlock = "buildingblock";



    }
    
}