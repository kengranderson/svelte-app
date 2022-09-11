<script>
	import * as yup from 'yup';
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement, LinkAuthenticationElement } from 'svelte-stripe';
	import { onMount } from 'svelte';

	let stripe = null;
    let paymentIntent = {};
	let clientSecret = null;
	let error = null;
	let elements;
    let processing = false;

    $: cantSubmit = processing || cart.total == 0;

	export let cart;

	const schema = yup.object().shape({
		customerName: yup.string().required('Please enter your name'),
		customerEmail: yup
			.string()
			.required('Please enter your email address')
			.email('Please enter a complete email address'),
		customerAddress: yup.string().required('Please enter your address'),
		customerCity: yup.string().required('Please enter your city'),
		customerRegion: yup.string().required('Please enter your state or region'),
		customerPostal: yup.string().required('Please enter your postal code'),
		customerCountry: yup.string().required('Please enter your country')
	});

	let errors = {};

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

		// create payment intent server side
		paymentIntent = await createPaymentIntent();
        clientSecret = paymentIntent.client_secret;
	});

    async function quantityChanged(item) {
        item.updateItem();
        cart = cart;
        console.log(cart);
    }

	async function createPaymentIntent() {
		const response = await fetch('/payment-intent', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({})
		});

		if (response.ok) {
			const res = await response.json();
			return res;
		} else {
			const err = await response.text();
			console.error(err);
			return null;
		}
	}

	async function updatePaymentIntent(amount) {
		const response = await fetch('/payment-intent', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
                id: paymentIntent.id,
                amount: amount
            })
		});

		if (response.ok) {
			const res = await response.json();
			return res;
		} else {
			const err = await response.text();
			console.error(err);
			return null;
		}
	}

	async function submitPayment() {
		// avoid processing duplicates
		if (processing) return;

		processing = true;

        // Validate customer info.
        try {
        // `abortEarly: false` to get all the errors
        await schema.validate(cart, { abortEarly: false });
        errors = {};
        } catch (err) {
			errors = extractErrors(err);
		}

        // Update PaymentIntent to reflect cart total.
        paymentIntent = await updatePaymentIntent(cart.total);
        clientSecret = paymentIntent.client_secret;

		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// log results, for debugging
		console.log({ result });

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			// payment succeeded, redirect to "thank you" page
			//goto('/examples/payment-element/thanks');
            processing = false;

            let paymentElement = elements.getElement('payment');
            paymentElement.clear();
		}

		function extractErrors(err) {
			return err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
		}
	}
</script>

<form on:submit|preventDefault={submitPayment}>
	<div class="card card-primary">
		<div class="card-header"><b>Shopping Cart</b></div>
		<table class="table table-bordered table-shopping-cart">
			<thead class="thead-dark">
				<tr><th>Qty</th><th>Item</th><th>Price</th><th>Sub-Total</th></tr>
			</thead>
			<tbody>
				{#each cart.items as item}
					<tr>
						<td>
							<input bind:value={item.quantity} type="number" on:input={() => quantityChanged(item)} class="form-control" min="0" />
						</td>
						<td>{item.product.name}</td>
						<td class="text-right">{item.product.priceCurrency}</td>
						<td class="text-right">{item.subtotalCurrency}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="3" class="text-right font-weight-bold">Order Total:</td>
					<td class="text-right">{cart.totalCurrency}</td>
				</tr>
			</tfoot>
		</table>
	</div>

	<div class="card card-primary">
		<div class="card-header"><b>Customer Info</b></div>
		<div class="card-body">
			<div class="form-payment">
				<div class="form-horizontal">
					<div class="form-group row">
						<div class="col-md-6">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerName}
								placeholder="Name"
							/>
							{#if errors.customerName}<span class="error">{errors.customerName}</span>{/if}
						</div>
						<div class="col-md-6">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerEmail}
								placeholder="Email"
							/>
							{#if errors.customerEmail}<span class="error"><span class="error">{errors.customerEmail}</span></span>{/if}
						</div>
					</div>
					<div class="form-group row">
						<div class="col-md-6">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerAddress}
								placeholder="Address"
							/>
							{#if errors.customerAddress}<span class="error">{errors.customerAddress}</span>{/if}
						</div>
						<div class="col-md-6">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerCity}
								placeholder="City"
							/>
							{#if errors.customerCity}<span class="error">{errors.customerCity}</span>{/if}
						</div>
					</div>

					<div class="form-group row">
						<div class="col-md-4">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerRegion}
								placeholder="Region"
							/>
							{#if errors.customerRegion}<span class="error">{errors.customerRegion}</span>{/if}
						</div>
						<div class="col-md-4">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerPostal}
								placeholder="Postal Code"
							/>
							{#if errors.customerPostal}<span class="error">{errors.customerPostal}</span>{/if}
						</div>
						<div class="col-md-4">
							<input
								type="text"
								class="form-control"
								bind:value={cart.customerCountry}
								placeholder="Country"
							/>
							{#if errors.customerCountry}<span class="error">{errors.customerCountry}</span>{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

{#if stripe && clientSecret}
	<div class="card card-primary">
		<div class="card-header"><b>Payment Info</b></div>
		<div class="card-body p-3">
			<Elements
				{stripe}
				{clientSecret}
				theme="none"
				labels="floating"
				variables={{ spacingUnit: '2px' }}
				rules={{ '.Input': { border: 'solid 1px #0002' } }}
				bind:elements
			>
                <PaymentElement />
			</Elements>
		</div>
	</div>

    <div class="container-fluid p-0 mb-3">
        <button type="submit" class="btn btn-success float-right" disabled={cantSubmit}>Purchase Points</button>
    </div>
{/if}
</form>

<style lang="scss">
	.error {
		color: #df1b41;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 2rem 0;
	}

	.table-shopping-cart {
        margin-bottom: 0;

		input[type='number'] {
			width: 60px;
		}
	}
</style>
