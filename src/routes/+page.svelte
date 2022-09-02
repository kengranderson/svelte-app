<!-- Login Form -->
<div class="row" ng-hide="user.authenticated">
    <div class="col-lg-4 offset-md-4">
        <Login/>
    </div>
</div>
<!-- / Login Form -->
<!-- Authenticated Page -->
<div class="row" ng-show="user.authenticated">
    <div class="col-lg-6">
        <profile user="user"></profile>
    </div>
    <!-- /.col-md-6 -->
    <div class="col-lg-6">
        <!-- <Wallet /> -->
    </div>
    <!-- / Authenticated Page -->
</div>
<!-- /.row -->

<script>
    import Login from '../components/login.svelte';
    import Wallet from '../components/wallet.svelte';
</script>
