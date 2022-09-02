<div class="card card-primary card-outline">
    <div class="card-header">
        <h5 class="m-0">Wallet of: user.email</h5>
    </div>
    <div class="card-body p-0">
        <table class="table table-sm table-responsive table-bordered">
            <tr class="bg-primary">
                <th ng-repeat="item in walletArray">item.name</th>
            </tr>
            <tr>
                <td class="text-right" ng-repeat="item in walletArray">item.balance</td>
            </tr>
        </table>
    </div>
</div>

<script>

/*
(function () {
    'use strict';

    angular.module(appName).directive('wallet', directive);

    function directive() {
        return {
            restrict: "E",
            scope: {
                user: '=',
                wallet: '='
            },
            controller: controller,
            templateUrl: "/components/rewards/wallet.directive.html"
        };
    }

    controller.$inject = ['$scope'];

    function controller($scope) {

        $scope.$watch((scope) => {
            return scope.wallet;
        }, (newValue) => {
            $scope.walletArray = toArray(newValue);
        });

        function toArray(obj) {
            let array = [];

            angular.forEach(obj, (value) => {
                array.push({
                    name: value.name,
                    balance: value.balance
                });
            });

            return array;
        }
    }
})();
*/
</script>