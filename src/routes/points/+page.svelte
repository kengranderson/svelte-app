<script>
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { CatalogStore } from '../../stores/CatalogStore';
	import ShoppingCart from '../../components/shoppingcart.svelte';
	import { ShoppingCartStore } from '../../stores/ShoppingCartStore';

	let products = [];

	$: cart = $ShoppingCartStore || writable({});

	onMount(async () => {
		// get the product list.
		if (products.length === 0) {
			products = (await CatalogStore.getProducts()).sort((p0, p1) => p0.price - p1.price);

			// Add the products to the cart.
			products.forEach((product) => {
				cart.addProduct(product, 0);
			});

		// Trigger reactive-ness.
		cart = cart;
		}
	});
</script>

<h3>Purchase Points</h3>
<ShoppingCart {cart} />
