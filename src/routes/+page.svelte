<div class="row">
    {#if $UserStore.isAuthenticated()}
    <div class="col-lg-6">
        <Profile/>
    </div>
    <div class="col-lg-6">
        <Wallet bind:user={$UserStore} />
    </div>
    {:else}
    <div class="col-lg-4 offset-md-4">
        <Login />
    </div>
    {/if}
</div>

<script>
    import { UserStore } from '../stores/UserStore';
    import Login from '../components/login.svelte';
    import Wallet from '../components/wallet.svelte';
    import Profile from '../components/profile.svelte';
</script>
