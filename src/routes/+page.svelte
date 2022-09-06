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
        <Login on:login={handleLogin}/>
    </div>
    {/if}
</div>

<script>
    import { UserStore } from '../stores/UserStore';
    import Login from '../components/login.svelte';
    import Wallet, { getWallet } from '../components/wallet.svelte';
    import Profile from '../components/profile.svelte';

async function handleLogin(event) {
    console.log('handleLogin');

    let newuser = event.detail.user;
    console.log('calling getWallet for ' + newuser.userid);

    await getWallet(newuser.userid,
        (wallet) => {
            console.log(wallet);
        }, 
        (error) => {
            Swal.fire('Wallet Error', error.message || error, 'error');
        }
    );
}

</script>
