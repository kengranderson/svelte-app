<div class="card card-primary card-outline">
    <div class="card-header">
        <h5 class="m-0">Wallet of: {user.email}</h5>
    </div>
    <div class="card-body p-0">
        <table class="table table-sm table-responsive table-bordered">
            <tr class="bg-primary">
                {#each Object.entries($wallet) as [key, value]}
                <th>{value.name}</th>
                {/each}
            </tr>
            <tr>
                {#each Object.entries($wallet) as [key, value]}
                <td class="text-right">{value.balance}</td>
                {/each}
            </tr>
        </table>
    </div>
</div>

<script>
    import { writable } from 'svelte/store';
	import { UserStore } from '../stores/UserStore';

    export let user = $UserStore;
    $: wallet = user.wallet || writable({});

    $: {
        console.log('wallet set in component to:');
        console.log(wallet);
    }

    let lastuserid = null;

    $: if (!!user.userid) { 
        if (user.userid != lastuserid) {
            user.updateWallet(_updateWallet);
            lastuserid = user.userid;
        }
    }

    const _updateWallet = (_wallet) => {
        $wallet = _wallet;
    };

</script>
