/**
 * @export
 * @class AppEndPoint
 */

export namespace AppRoutes {
    export abstract class Auth 
    {

    // get all master dropdown data
    public static readonly getProductName = "/product";
    public static readonly getProductScope = "/scope";
    public static readonly getProductCtegory = "/{scopeId}/category";
    
    }
    export abstract class CreateBuildingBlockPoints {
      //  public static readonly DRAY_PROVIDER = "drayProvider";
       // public static readonly ALL_DRAY_PROVIDER = DrayProviderPoints.DRAY_PROVIDER + "/getAllDrayProvider";
        public static readonly CREATE_BUILING_BLOCK = "/buildingblock";
    }
    
}