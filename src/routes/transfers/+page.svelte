<div class="row">
    <div class="col-lg-3">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Other Users</h5>
            </div>
            <div class="card-body">
                <select class="form-control" size="10" ng-model="selected" ng-change="getWallet(selected.userid)" ng-options="user as user.email for user in users track by user.userid"></select>
            </div>
        </div>
    </div>
    <div class="col-lg-6">
        <wallet user="user" wallet="userwallet"></wallet>
        <wallet user="selected" wallet="wallet"></wallet>
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Transfers</h5>
            </div>
            <div class="card-body">
                <form name="transferForm" ng-submit="transfer(transferForm)" novalidate>
                    <div class="form-row">
                        <div class="col-md-6 my-1">
                            <select ng-model="assettype" name="assettype" class="form-control" required>
                                <option value="">-- Select Asset --</option>
                                <option value="badge">Badges</option>
                                <option value="gift">Gifts</option>
                                <option value="good">Goods</option>
                                <option value="point">Points</option>
                                <option value="token-dyme">DYME Tokens</option>
                                <option value="token-semt">SEMT Tokens</option>
                                <option value="token-slsp">SLSP Tokens</option>
                            </select>
                        </div>
                        <div class="col-md-3 my-1">
                            <input ng-model="quantity" name="quantity" type="number" class="form-control" min="1" step="100">
                        </div>
                        <div class="col-md-3 my-1">
                            <button type="submit" class="btn btn-success btn-disabled-not-allowed" ng-disabled="transferForm.$invalid || quantity < 1"><i class="fas fa-piggy-bank"></i><span> Deposit</span></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>

/*
(function () {
    'use strict';

    angular.module(appName).controller('transfersController', controller);
    controller.$inject = ['$scope', '$timeout', '$user', '$rewards', 'config'];

    function controller($scope, $timeout, $user, $rewards, config) {
        // Extend $scope.
        angular.extend($scope, {
            quantity: 1,
            user: $user.user(),
            userwallet: $rewards.emptyWallet(),
            wallet: $rewards.emptyWallet(),
            getWallet: getWallet,
            transfer: transfer,
            // All users
            users: []
        });

        getUsers();
        getUserWallet($scope.user.userid);

        function getUsers() {
            var params = {
                UserPoolId: config.userPoolId,
                Limit: 60
            };

            AWS.config.update({
                region: config.region,
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            });

            let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
            cognitoidentityserviceprovider.listUsers(params, (err, data) => {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                }
                else {
                    let _users = [];

                    angular.forEach(data.Users, (user) => {
                        if (user.Username != $scope.user.userid) {
                            _users.push({
                                userid: user.Username,
                                email: user.Attributes.filter((attr) => { return attr.Name === 'email'; })[0].Value
                            });
                        }
                    });

                    $timeout(() => {
                        $scope.users = _users;
                        $scope.selected = _users[0];
                        getWallet($scope.selected.userid);
                    }, 0);
                }
            });
        }

        function getWallet(userid, callback) {
            $rewards.getWallet(userid, (wallet) => {
                $scope.wallet = wallet;

                if (callback) {
                    callback(wallet);
                }
            });
        }

        function getUserWallet(userid, callback) {
            $rewards.getWallet(userid, (wallet) => {
                $scope.userwallet = wallet;

                if (callback) {
                    callback(wallet);
                }
            });
        }

        function transfer(form) {
            let fromid = $scope.user.userid;
            let user = $scope.selected;
            let assettype = $scope.assettype;
            let quantity = $scope.quantity;

            switch (assettype) {
                case 'badge':
                case 'gift':
                case 'good':
                    // Get the assetid of the first asset of this type.
                    $rewards.getFirstAssetTypeId(fromid, assettype, (assetid) => {
                        // Send the asset to the recipient.
                        $rewards.transferAsset(assetid, fromid, user.userid, (transactions) => {
                            console.log(transactions);
                            getUserWallet($scope.user.userid);
                            getWallet(user.userid, (wallet) => {
                                Swal.fire(
                                    'Asset assigned!',
                                    'Asset assigned to ' + user.email,
                                    'success'
                                );
                            });
                        });
                    });

                    break;

                case 'point':
                    $rewards.transferAssetTypes(assettype, fromid, user.userid, quantity, (transactions) => {
                        console.log(transactions);
                        getUserWallet($scope.user.userid);
                        getWallet(user.userid, (wallet) => {
                            Swal.fire(
                                'Points assigned!',
                                quantity + ' Points assigned to ' + user.email,
                                'success'
                            );
                        });
                    });
                    break;

                case 'token-dyme':
                case 'token-semt':
                case 'token-slsp':
                    // Send the tokens to the recipient.
                    $rewards.transferAssetTypes(assettype, fromid, user.userid, quantity, (transactions) => {
                        console.log(transactions);
                        getUserWallet($scope.user.userid);
                        getWallet(user.userid, (wallet) => {
                            Swal.fire(
                                'Tokens assigned!',
                                quantity + ' Tokens assigned to ' + user.email,
                                'success'
                            );
                        });
                    });
                    break;
            }
        }
    }
})();


*/


</script>