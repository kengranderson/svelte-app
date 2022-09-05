{#if user.isAuthenticated()}
<div class="card card-primary card-outline">
    <div class="card-header">
        <h5 class="m-0">Wallet of: {user.email}</h5>
    </div>
    <div class="card-body p-0">
        <table class="table table-sm table-responsive table-bordered">
            <tr class="bg-primary">
                {#each Object.entries(localWallet) as [key, value]}
                <th>{value.name}</th>
                {/each}
            </tr>
            <tr>
                {#each Object.entries(localWallet) as [key, value]}
                <td class="text-right">{value.balance}</td>
                {/each}
            </tr>
        </table>
    </div>
</div>
{/if}

<script>
	import { UserStore } from '../stores/UserStore';

    $: user = $UserStore;
    $: localWallet = $wallet;
</script>

<script context="module">
    import { writable } from 'svelte/store';
    import { RewardsStore } from '../stores/RewardsStore';

    let wallet = writable({});
    
    export async function wallet_get(userid, success, failure) {
        console.log('in wallet_get');

        await RewardsStore.wallet_get(userid, 
        (_wallet) => {
            wallet.set(_wallet);

            if (success) {
                success(_wallet);
            }
        }, 
        (error) => {
            if (failure) {
                failure(error);
            }
        });
    }    
</script>
