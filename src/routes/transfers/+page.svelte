<div class="row">
    <div class="col-lg-3">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Other Users</h5>
            </div>
            <div class="card-body">
                <select class="form-control" size="10" bind:value={touser} on:change="{ async () => { await touser.updateWallet() } }">
                    {#each users as user}
                    <option value={user}>
                        {user.email}
                    </option>
                    {/each}
                </select>
            </div>
        </div>
    </div>
    <div class="col-lg-6">
        <Wallet bind:user={fromuser} />
        <Wallet bind:user={touser} />
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Transfers</h5>
            </div>
            <div class="card-body">
                <form on:submit|preventDefault={submitHandler}>
                    <div class="form-row">
                        <div class="col-md-6 my-1">
                            <select bind:value={form.assettype} class="form-control">
                                <option value="">-- Select Asset --</option>
                                <option value="badge">Badges</option>
                                <option value="gift">Gifts</option>
                                <option value="good">Goods</option>
                                <option value="point">Points</option>
                                <option value="token-dyme">DYME Tokens</option>
                                <option value="token-semt">SEMT Tokens</option>
                                <option value="token-slsp">SLSP Tokens</option>
                            </select>
                            {#if errors.assettype}{errors.assettype}{/if}
                        </div>
                        <div class="col-md-3 my-1">
                            <input bind:value={form.quantity} type="number" class="form-control">
                            {#if errors.quantity}{errors.quantity}{/if}
                        </div>
                        <div class="col-md-3 my-1">
                            <button type="submit" class="btn btn-success btn-disabled-not-allowed"><i class="fas fa-piggy-bank"></i><span> Deposit</span></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    import { UserStore } from '../../stores/UserStore';
    import Wallet from '../../components/wallet.svelte';
	import * as yup from 'yup';
    import { RewardsStore } from '../../stores/RewardsStore';

    let users = [];
    let fromuser = $UserStore;
    $: touser = {};
    
    $UserStore.getUsers((_users) => {
        users = _users;
        touser = users[0];
    }, fromuser.userid);

	const schema = yup.object().shape({
		assettype: yup.string().required('Please select an Asset Type'),
		quantity: yup.number().required('Please enter a quantity').min(1, 'Quantity must be at least 1')
	});

	let form = {
		assettype: '',
		quantity: 1
	};
	let errors = {};

	async function submitHandler() {
		try {
			// `abortEarly: false` to get all the errors
			await schema.validate(form, { abortEarly: false });
			errors = {};

            let fromid = fromuser.userid;
            let assettype = form.assettype;
            let quantity = form.quantity;

            switch (assettype) {
                case 'badge':
                case 'gift':
                case 'good':
                    // Get the assetid of the first asset of this type.
                    console.log('calling getFirstAssetType(' + fromid + ',' + assettype + ')');
                    await RewardsStore.getFirstAssetType(fromid, assettype, async (assetid) => {
                        console.log('got asset id# ' + assetid);

                        // Send the asset to the recipient.
                        console.log('calling transferAsset(' + assetid + ',' + fromid + ',' + user.userid + ')');
                        await RewardsStore.transferAsset(assetid, fromid, touser.userid, async (transactions) => {
                            console.log('transferAsset succeeded');
                            console.log(transactions);
                            
                            await fromuser.updateWallet();                            
                            await touser.updateWallet(() => {
                                Swal.fire(
                                    'Asset assigned!',
                                    'Asset assigned to ' + touser.email,
                                    'success'
                                );
                            });
                        });
                    });
                    break;

                case 'point':
                    // Mint the Points.
                    console.log('calling transferAssetType(' + assettype + ',' + fromid + ',' + touser.userid + ',' + quantity + ')');
                    await RewardsStore.transferAssetType(assettype, fromid, touser.userid, quantity, async (transactions) => {
                        console.log(transactions);

                        await fromuser.updateWallet();                            
                        await touser.updateWallet(() => {
                            Swal.fire(
                                'Points assigned!',
                                quantity + ' Points assigned to ' + touser.email,
                                'success'
                            );
                        });
                    });
                    break;

                case 'token-dyme':
                case 'token-semt':
                case 'token-slsp':
                    // Send the tokens to the recipient.
                    console.log('calling transferAssetType(' + assettype + ',' + fromid + ',' + touser.userid + ',' + quantity + ')');
                    await RewardsStore.transferAssetType(assettype, fromid, touser.userid, quantity, async (transactions) => {
                        console.log(transactions);

                        await fromuser.updateWallet();                            
                        await touser.updateWallet(() => {
                            Swal.fire(
                                'Tokens assigned!',
                                quantity + ' Tokens assigned to ' + touser.email,
                                'success'
                            );
                        });
                    });
                    break;
            }
        } catch (err) {
			errors = extractErrors(err);
		}

		function extractErrors(err) {
			return err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
		}
	}

</script>