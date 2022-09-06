<div class="card card-primary card-outline">
    <div class="card-header">
        <h5 class="m-0">Wallet of: {user.email}</h5>
    </div>
    <div class="card-body p-0">
        <table class="table table-sm table-responsive table-bordered">
            <tr class="bg-primary">
                {#each Object.entries(wallet) as [key, value]}
                <th>{value.name}</th>
                {/each}
            </tr>
            <tr>
                {#each Object.entries(wallet) as [key, value]}
                <td class="text-right">{value.balance}</td>
                {/each}
            </tr>
        </table>
    </div>
</div>

<script>
	import { UserStore } from '../stores/UserStore';
//    import { writable } from 'svelte/store';

    // $: user = $UserStore;
    let wallet = {}; //writable({});
    export let user = $UserStore;
//    $: localUser = user;

    $: if (!!user.userid) { 
        let userid = user.userid;
        
        RewardsStore.getWallet(userid, 
            (_wallet) => {
                console.log('setting wallet for ' + userid);
                wallet = _wallet;
            }, 
            (error) => {
                console.error(error);
            });
    }

//    $: localWallet = $wallet;
</script>

<script context="module">
    import { RewardsStore } from '../stores/RewardsStore';
    
    export async function getWallet(userid, success, failure) {
        console.log('in getWallet(' + userid + ')');

        await RewardsStore.getWallet(userid, 
            (wallet) => {
                console.log('setting wallet for ' + userid);
                console.log(wallet);

                if (success) {
                    success(wallet);
                }

                return wallet;
            }, 
            (error) => {
                console.error('getWallet error');
                console.error(error);

                if (failure) {
                    failure(error);
                }

                return null;
            });
    }    
</script>
