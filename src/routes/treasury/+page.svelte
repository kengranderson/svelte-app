<div class="row">
    <div class="col-lg-3">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Users</h5>
            </div>
            <div class="card-body">
                <select class="form-control" size="10" bind:value={selected} on:change="{ async () => { await selected.updateWallet() } }">
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
        <Wallet bind:user={selected} />
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h5 class="m-0">Treasury Deposit Operations</h5>
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
	import * as yup from 'yup';
    import { UserStore } from '../../stores/UserStore';
    import Wallet from '../../components/wallet.svelte';
    import { RewardsStore } from '../../stores/RewardsStore';

    let users = [];
    let selected = $UserStore;
    
    $UserStore.getUsers((_users) => {
        users = _users;
        selected = users[0];
    });

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

            const treasuryid = '00000000-0000-0000-0000-000000000000';
            let touser = selected;
            let assettype = form.assettype;
            let quantity = form.quantity;

            switch (assettype) {
                case 'badge':
                case 'gift':
                case 'good':
                    let metadata = {
                        assetName: assettype + ' created at ' + (new Date()).toString(),
                        createDate: new Date()
                    };

                    // Mint the Asset.
                    console.log('calling mintAsset(' + assettype + ',' + JSON.stringify(metadata) + ')');
                    await RewardsStore.mintAsset(assettype, metadata, async (assetid) => {
                        console.log('minted asset id# ' + assetid);

                        // Send the asset to the recipient.
                        console.log('calling transferAsset(' + assetid + ',' + treasuryid + ',' + touser.userid + ')');
                        await RewardsStore.transferAsset(assetid, treasuryid, touser.userid, async (transactions) => {
                            console.log('transferAsset succeeded');
                            console.log(transactions);
                            
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
                    console.log('calling mintPoints(' + quantity + ')');
                    await RewardsStore.mintPoints(quantity, async (transaction) => {
                        // Send the points to the recipient.
                        console.log('mintPoints succeeded');
                        console.log(transaction);

                        console.log('calling transferAssetType(' + assettype + ',' + treasuryid + ',' + touser.userid + ',' + quantity + ')');
                        await RewardsStore.transferAssetType(assettype, treasuryid, touser.userid, quantity, null, async (transactions) => {
                            console.log('transferAssetType succeeded');
                            console.log(transactions);

                            await touser.updateWallet(() => {
                                Swal.fire(
                                    'Points assigned!',
                                    quantity + ' Points assigned to ' + touser.email,
                                    'success'
                                );
                            });
                        });
                    });
                    break;

                case 'token-dyme':
                case 'token-semt':
                case 'token-slsp':
                    // Mint the Tokens.
                    let symbol = assettype.replace('token-', '').toUpperCase();

                    console.log('calling mintTokens(' + symbol + ',' + quantity + ')');
                    await RewardsStore.mintTokens(symbol, quantity, async (transaction) => {
                        console.log('mintTokens succeeded');
                        console.log(transaction);

                        // Send the tokens to the recipient.
                        console.log('calling transferAssetType(' + assettype + ',' + treasuryid + ',' + touser.userid + ',' + quantity + ')');
                        await RewardsStore.transferAssetType(assettype, treasuryid, touser.userid, quantity, async (transactions) => {
                            console.log('transferAssetType succeeded');
                            console.log(transactions);

                            await touser.updateWallet(() => {
                                Swal.fire(
                                    'Tokens assigned!',
                                    quantity + ' Tokens assigned to ' + touser.email,
                                    'success'
                                );
                            });
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