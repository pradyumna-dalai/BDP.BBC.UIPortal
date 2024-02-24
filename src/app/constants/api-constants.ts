/**
 * @export
 * @class AppEndPoint
 */

export namespace AppRoutes {
    export abstract class AuthAbstract {
        public static readonly DOMAIN = '/';
        public static readonly ROOT = "auth";
        public static readonly SIGNIN = "signin";
        public static readonly SIGNUP = "signup";
        public static readonly ERROR = "error";
        public static readonly AUTH0_ERROR = "auth-error";
        public static readonly ACCESS = "access";
        public static readonly EULA = "end-user-license-agreement";
        public static readonly LOGOUT = "logout";
        public static readonly NOT_FOUND = "not-found";
        public static readonly PAGE_BREAK = "page-break";
        public static readonly APP_PAGE_BREAK = "app-page-break";
        public static readonly MAINTENANCE = "maintenance";
        public static readonly RESET_PASSWORD = "set-password";
        public static readonly GET_LINK = "get-link";
        public static readonly FORGET_PASSWORD = "forget-password";
        public static readonly REACTIVATE_ACCOUNT = "reactivate-account";
    }

    export abstract class AuthFull {
        public static readonly DOMAIN = '/';
        public static readonly ROOT = AuthAbstract.ROOT;
        public static readonly SIGNIN = AuthFull.ROOT + "/" + AuthAbstract.SIGNIN;
        public static readonly SIGNUP = AuthFull.ROOT + "/" + AuthAbstract.SIGNUP;
        public static readonly RESET_PASSWORD = AuthFull.ROOT + "/" + AuthAbstract.RESET_PASSWORD;
        public static readonly FORGET_PASSWORD = AuthFull.ROOT + "/" + AuthAbstract.FORGET_PASSWORD;
        public static readonly GET_LINK = AuthFull.ROOT + "/" + AuthAbstract.GET_LINK;
        public static readonly REACTIVATE_ACCOUNT = AuthFull.ROOT + "/" + AuthAbstract.REACTIVATE_ACCOUNT;
    }

    export abstract class UserAbstract {
        public static readonly ROOT = "building-block";

        public static readonly PROFILE = "profile";
        public static readonly CHANGE_PASSWORD = "change-password";
        public static readonly NOT_ASSOCIATED = "not-association";
        public static readonly COMMON_PANEL = "common";
    }

    export abstract class UserFull {
        public static readonly ROOT = "/" + UserAbstract.ROOT;
       
        public static readonly NOT_ASSOCIATED = "/" + UserAbstract.NOT_ASSOCIATED;
        public static readonly NOT_FOUND = UserFull.ROOT + "/" + AuthAbstract.NOT_FOUND;
        public static readonly PAGE_BREAK = UserFull.ROOT + "/" + AuthAbstract.PAGE_BREAK;
        public static readonly PROFILE = UserFull.ROOT + "/" + UserAbstract.PROFILE;
        public static readonly CHANGE_PASSWORD = UserFull.PROFILE + "/" + UserAbstract.CHANGE_PASSWORD;
        public static readonly COMMON_CHANGE_PASSWORD = UserFull.PROFILE + "/" + UserAbstract.CHANGE_PASSWORD;
    }
}