<div class="card card-primary card-outline">
    <div class="card-header">
        <h5 class="m-0">Wallet of: {localUser.email}</h5>
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

<script>
	import { UserStore } from '../stores/UserStore';

    // $: user = $UserStore;
    export let user = $UserStore;
    $: localUser = user;
    $: localWallet = $wallet;
</script>

<script context="module">
    import { writable } from 'svelte/store';
    import { RewardsStore } from '../stores/RewardsStore';

    let wallet = writable({});
    
    export async function getWallet(userid, success, failure) {
        console.log('in getWallet');

        await RewardsStore.getWallet(userid, 
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
