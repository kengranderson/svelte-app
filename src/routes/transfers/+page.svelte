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
