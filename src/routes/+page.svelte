<div class="row">
    {#if user.isAuthenticated()}
    <div class="col-lg-6">
        <Profile/>
    </div>
    <div class="col-lg-6">
        <Wallet />
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
    import Wallet, { wallet_get } from '../components/wallet.svelte';
    import Profile from '../components/profile.svelte';

$: user = $UserStore;

async function handleLogin(event) {
    console.log('handleLogin');

    let newuser = event.detail.user;
    console.log('calling wallet_get for ' + newuser.userid);

    await wallet_get(newuser.userid,
        (wallet) => {
            console.log(wallet);
        }, 
        (error) => {
            Swal.fire('Wallet Error', error.message || error, 'error');
        }
    );
}

</script>
