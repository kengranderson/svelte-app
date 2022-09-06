import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';
// import jwt_decode from 'jwt-decode';
import { writable, get } from 'svelte/store';
import { ConfigStore } from './ConfigStore';

// Singleton reference to the Cognito user.
let cognitoUser = null;

// Clone the Guest user and add methods.
function getAnonymousUser() {
    const _anonymousUser = {
        // User methods
        ...{
            authenticate: authenticate,
            isAuthenticated: isAuthenticated,
            fullName: function () {
                return this.given_name + ' ' + this.family_name;
            },
            logout: logout,
            hasClaim: hasClaim,
            getUsers: getUsers
        },
        ...{
            // Anonymous user properties
            avatar: '',
            email: '',
            family_name: '',
            given_name: '',
            initials: '',
            userid: null,
            groups: [],
            authenticated: false
        }
    };

    return _anonymousUser;

    function authenticate(username, password, rememberMe, success, failure, always) {
        let authenticationData = {
            Username: username,
            Password: password
        };

        const config = ConfigStore;
        let userPool = new AmazonCognitoIdentity.CognitoUserPool({
            UserPoolId: config.VITE_USER_POOL_ID,
            ClientId: config.VITE_APPLICATION_ID
        });

        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        let userData = {
            Username: username,
            Pool: userPool
        };

        cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, wrapCallback((error, result) => {
            if (error) {
                if (failure) {
                    failure.call(null, error);
                }

                if (always) {
                    always.call();
                }
            }
            else {
                // Login was successful.
                console.log('Login successful.');

                // Populate user object.
                let payload = result.idToken.payload;

                let _user = {
                    ...getAnonymousUser(),
                    ...{
                        accessToken: result.accessToken,
                        idToken: result.idToken,
                        refreshToken: result.refreshToken,
                        userid: payload.sub,
                        email: payload.email,
                        groups: payload['cognito:groups'],
                        authenticated: true
                    }
                };

                // Save user object.
                UserStore.set(_user);

                // If 'RememberMe' was set, save login info in persistent cookie.
                // if (rememberMe) {
                //     $cookies.putObject('credentials', {
                //         username: username,
                //         password: password
                //     }, {
                //         expires: new Date(new Date().getFullYear() + 2, 0)
                //     });
                // }

                // If a callback method was provided, invoke it.
                callUserCallbacks(_user, success, always);
            }
        }));

        function wrapCallback(callback) {
            return {
                onFailure: (err) => { callback(err, null); },
                onSuccess: (result) => { callback(null, result); }
            };
        }
    }

    function callUserCallbacks(user, success, always) {
        if (success) {
            success.call(null, user);
        }

        if (always) {
            always.call();
        }
    }

    function isAuthenticated() {
        // Indicates if the user is logged in.
        let _user = get(UserStore);
        let jwt = _user.accessToken ? _user.accessToken.jwtToken : null;
        return !!jwt && !isTokenExpired(jwt);

        function isTokenExpired(token) {
            const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
            return (Math.floor((new Date).getTime() / 1000)) >= expiry;            
        }
    }

    // Roles are implemented as Claims of type 'role.'
    // They are converted to a string array server-side,
    // and returned to the client
    function hasClaim(groupPattern) {
        // If we are not authenticated no need to continue.
        if (!isAuthenticated()) {
            return false;
        }

        // We are authenticated so we can use roles.
        let pattern = new RegExp(groupPattern);

        return get(UserStore).groups.some(function (group) {
            return pattern.test(group);
        });
    }

    function logout(success, always) {
        if (cognitoUser && isAuthenticated()) {
            if (cognitoUser.signInUserSession) {
                cognitoUser.signOut();
                completeLogout();
            }
        }
        else {
            completeLogout();
        }

        function completeLogout() {
            let _user = getAnonymousUser();
            UserStore.set(_user);
            callUserCallbacks(_user, success, always);
        }
    }

    function getUsers(callback, exceptuserid) {
        const config = ConfigStore;

        var params = {
            UserPoolId: config.VITE_USER_POOL_ID,
            Limit: 60
        };

        AWS.config.update({
            region: config.VITE_REGION,
            accessKeyId: config.VITE_ACCESS_KEY_ID,
            secretAccessKey: config.VITE_SECRET_ACCESS_KEY
        });

        let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        cognitoidentityserviceprovider.listUsers(params, (err, data) => {
            if (err) {
                console.log(err, err.stack); // an error occurred
            }
            else {
                let _users = [];

                data.Users.forEach(user => {
                    if (!exceptuserid || user.Username != exceptuserid) {
                        _users.push({
                            userid: user.Username,
                            email: user.Attributes.filter((attr) => { return attr.Name === 'email'; })[0].Value
                        });
                    }
                });

                callback(_users);
            }
        });
    }
}

export const UserStore = writable(getAnonymousUser());
