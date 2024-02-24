(() => {
    /* Add jQuery */
    const jQueryElem = document.createElement('script');
    jQueryElem.setAttribute("src", appUrl.origin + "/assets/bdp/js/jQuery.js");
    document.head.appendChild(jQueryElem);
})();

let passwordVisibility = false;

const smartHubUrl = 'https://hubdev.bdpsmart.com';
const bdpAuth0 = {
    init: () => {
        const link_account_token = config.extraParams.link_account_token || '';
        let loginType = "EMAIL";
        if (!(link_account_token === '')) {
            $("#forgetPasswordWrapper").hide();
            $("#bdpBottomHeading").hide();
        }
        document.body.style.backgroundImage = `url(${appUrl.origin}/assets/bdp/images/PSA-BDPbackground.jpg)`;
        $('#signUpRedirect').attr("href", smartHubUrl + "/#/auth/signup");
        $('#needAppRedirect').attr("href", smartHubUrl + "/#/auth/request-app-info");
        $('#forgetPassword').attr("href", smartHubUrl + "/#/auth/forget-password");
        $('#loginLogo').attr("src", appUrl.origin + "/assets/bdp/images/PSA_BDP_black_logo.png");
        $('#emailInput').attr("placeholder", "Enter your account email address");
        $('#bdpPasswordVisibility').attr("src", appUrl.origin + "/assets/bdp/images/eye-slash.svg");
        $('#mfaFAQ').attr("href", smartHubUrl + "/assets/data/guide/MFA User Guide.pdf");
        $('#bdpFAQ').attr("href", smartHubUrl + "/assets/data/guide/Smart Suite FAQs.pdf");

        document.title = "Building Blocks";
        const setFavicons = (favImg) => {
            let headTitle = document.querySelector('head');
            let setFavicon = document.createElement('link');
            setFavicon.setAttribute('rel', 'icon');
            setFavicon.setAttribute('href', favImg);
            headTitle.appendChild(setFavicon);
        }
        setFavicons(appUrl.origin + "/favicon.ico");

        const leeway = config.internalOptions.leeway;
        if (leeway) {
            const convertedLeeway = parseInt(leeway);
            if (!isNaN(convertedLeeway)) {
                config.internalOptions.leeway = convertedLeeway;
            }
        }

        const params = Object.assign({
            overrides: {
                __tenant: config.auth0Tenant,
                __token_issuer: config.authorizationServer.issuer
            },
            domain: config.auth0Domain,
            clientID: config.clientID,
            redirectUri: config.callbackURL,
            responseType: 'code'
        }, config.internalOptions);

        const webAuth = new auth0.WebAuth(params);
        const captcha = webAuth.renderCaptcha(
            document.querySelector('#captchaContainer')
        );


        if (!(link_account_token === '')) {
            bdpAuth0.displayError({
                description: "Please enter Smart Sense login to verify account link.",
                captcha
            });
        }

        const isEmail = (email) => {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }

        window.loginEdit = (e) => {
            loginType = "EDIT";
            window.bdpLogin(e)
        }
        window.bdpLogin = (e) => {
            e.preventDefault();
            switch (loginType) {
                case "EMAIL": {
                    const str = document.forms['loginForm'].email.value;
                    if (!str.replace(/\s+/, '').length || !isEmail(str)) {
                        bdpAuth0.displayError({
                            description: "Invalid Input",
                            captcha
                        });
                        return;
                    } else {
                        $("#btnLogin").html('Sign In');
                        $("#emailInput").prop('disabled', true);
                        $("#passwordWrapper,#editEmail,#password").show();
                        $("#passwordInput").focus();
                        if (link_account_token === '') {
                            bdpAuth0.closeError();
                            $('#forgetPasswordWrapper').show();
                        }
                    }
                    loginType = "PASSWORD";
                    break;
                }
                case "PASSWORD": {
                    bdpAuth0.closeError();
                    $("#btnLogin").prop('disabled', true);
                    $("#slider").show();
                    webAuth.login({
                        realm: connection,
                        username: $("#emailInput").val(),
                        password: $("#passwordInput").val(),
                        captcha: captcha.getValue()
                    }, function (err) {
                        if (err) {
                            bdpAuth0.displayError({
                                description: "Unable to login.  Please check username and password, then try again.",
                                captcha
                            });
                        }
                        $("#btnLogin").prop('disabled', false);
                        $("#slider").hide();
                    });
                    break;
                }

                case "EDIT": {
                    $("#emailInput").prop('disabled', false);
                    $("#emailInput").focus();
                    $('#password,#editEmail,#passwordWrapper').hide();
                    $('#btnLogin').html("Continue");
                    $('#passwordInput').value = '';
                    passwordVisibility = false;
                    $('#bdpPasswordVisibility').attr("src", appUrl.origin + "/assets/bdp/images/eye-slash.svg");
                    $('#passwordInput').attr("type", "password");
                    if (link_account_token === '') {
                        bdpAuth0.closeError();
                        $('#forgetPasswordWrapper').hide();
                    }
                    loginType = "EMAIL";
                    break;
                }
            }
        }
        window.changePasswordVisibility = bdpAuth0.changePasswordVisibility;
        bdpAuth0.addCss(appUrl.origin + "/assets/bdp/auth0/auth0-universal-login.css");
        $("#windowLoader").hide();
        $("#bdpLoginWrapper").css("display", "flex");
    },
    closeError: () => {
        $("#errorMessage").hide().html('');
    },
    displayError: ({ description, captcha }) => {
        captcha.reload();
        $("#errorMessage").show().html(description);
    },
    changePasswordVisibility: () => {
        passwordVisibility = !passwordVisibility;
        if (passwordVisibility) {
            $('#bdpPasswordVisibility').attr("src", appUrl.origin + "/assets/bdp/images/eye.svg");
            $('#passwordInput').attr("type", "text");
        } else {
            $('#bdpPasswordVisibility').attr("src", appUrl.origin + "/assets/bdp/images/eye-slash.svg");
            $('#passwordInput').attr("type", "password");
        }
        $('#passwordInput').focus();
    },
    addCss: (href) => {
        $("head").append(`<link rel="stylesheet" href="${href}">`);
    }
}


window.addEventListener('load', function () {
    $.get(appUrl.origin + "/assets/bdp/auth0/auth0-universal-login.html").then((data) => {
        if (data) {
            $("body").html(data);
            bdpAuth0.init();
            $("#emailInput").focus();
        }
    })
});
