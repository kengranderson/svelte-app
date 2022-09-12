<div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
            <li class="nav-item">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="/" class="nav-link">Home</a>
            </li>
        </ul>
    </nav>
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <a href="/" class="brand-link">
            <img src={logo} alt="Semantic Logo"
                class="brand-image img-circle elevation-3" style="opacity: .8">
            <span class="brand-text font-weight-light">Semantic Admin</span>
        </a>
        <div class="sidebar">
            {#if user.isAuthenticated()}
            <div class="user-panel mt-3 pb-3 mb-3 d-flex" ng-show="user.authenticated">
                <div class="info">
                    <span class="d-block sidebar-username">{user.email}</span>
                </div>
            </div>
            {/if}
            <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                    data-accordion="false">
                    <!-- Add icons to the links using the .nav-icon class
                         with font-awesome or any other icon font library -->
                    <li class="nav-item">
                        <a href="/" class="nav-link active">
                            <i class="fas fa-home"></i>
                            <p>Home</p>
                        </a>
                    </li>

                    {#if user.isAuthenticated()}
                    <li class="nav-item">
                        <a href="/points" class="nav-link">
                            <i class="fas fa-dot-circle"></i>
                            <p>Points</p>
                        </a>
                    </li>
                    <!-- <li class="nav-item">
                        <a href="/goods" class="nav-link">
                            <i class="fas fa-gift"></i>
                            <p>Goods</p>
                        </a>
                    </li> -->
                    {#if user.hasClaim('treasury')}
                    <li class="nav-item">
                        <a href="/treasury" class="nav-link">
                            <i class="fas fa-university"></i>
                            <p>Treasury</p>
                        </a>
                    </li>
                    {/if}
                    
                    <li class="nav-item">
                        <a href="/transfers" class="nav-link">
                            <i class="fas fa-exchange-alt"></i>
                            <p>Transfers</p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="/" class="nav-link active" on:click={logout}>
                            <i class="fas fa-sign-out-alt"></i>
                            <p>
                                Logout
                            </p>
                        </a>
                    </li>
                    {/if}
                </ul>
            </nav>
            <!-- /.sidebar-menu -->
        </div>
    </aside>
    <div class="content-wrapper">
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-12">
                        <h1 class="m-0">Semantic Admin</h1>
                    </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <div class="content">
            <div class="container-fluid">
                <slot></slot>
            </div><!-- /.container-fluid -->
        </div>
    </div>
    <aside class="control-sidebar control-sidebar-dark">
        <div class="p-3">
            <h5>Title</h5>
            <p>Sidebar content</p>
        </div>
    </aside>
    <footer class="main-footer">
        <strong>Copyright &copy; 2022 Semantic Dev.</strong> All rights reserved.
    </footer>
</div>

<script>
    import logo from '../AdminLTELogo.png';
	import { UserStore } from '../stores/UserStore';
    import { createEventDispatcher } from 'svelte';

    $: user = $UserStore;

	const dispatch = createEventDispatcher();

    const logout = () => {
        $UserStore.logout(() => {
            dispatch('login', {
                user: $UserStore
            });
        });
    };
</script>

<style lang="scss">
    .sidebar-username {
        color: #fff;
    }

    :global {
        i+span {
            margin-left: 4px;
        }
    }
</style>
