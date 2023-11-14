/**
 * @export
 * @class AppEndPoint
 */

export namespace AppRoutes {
    export abstract class Auth 
    {

    // get all master dropdown data
    public static readonly getProductName = "/product";
    public static readonly getProductScope = "/{productId}/scope";
    public static readonly getProductCtegory = "/{scopeId}/category";
    
    }
    
}