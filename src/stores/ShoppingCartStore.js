import { writable } from 'svelte/store';

const stripe_fixed_fee = 30;
const stripe_fee_rate = 0.029;
const semanticdev_fee_rate = 0.020;

let cart = {
    userid: null,
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerCity: '',
    customerRegion: '',
    customerPostal: '',
    customerCountry: '',
    items: [],
    service_fee_amount: 0,
    stripe_fee_amount: 0,
    totalFees: asCurrency(0),
    total: 0,
    totalPoints: 0,
    totalCurrency: asCurrency(0),
    addProduct: addProduct,
    updateProductQuantity: updateProductQuantity,
    removeProduct: removeProduct,
    updateTotals: updateTotals,
    getDescription: function() {
        return 'Owner: ' + this.customerEmail + ' (' + this.userid + ')';
    }
};

function getApplicationFeeAmount(value) {
    return Math.round(semanticdev_fee_rate * value);
}

function asCurrency(value, maximumFractionDigits = 2) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: maximumFractionDigits
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(value / 100);
}

function addProduct(product, quantity = 1) {
    let item = {
        sku: product.id,
        product: addProductMetadata(product),
        quantity: quantity,
        updateItem: updateItem
    };
    item.updateItem();

    cart.items.push(item);
    cart.updateTotals();
    cart = cart;

    function addProductMetadata(product) {
        product.priceCurrency = asCurrency(product.price);
        return product;
    }
}

// To be called on an item AFTER the item quantity has been updated.  Updates dependent properties.
function updateItem() {
    this.subtotal = this.quantity * this.product.price;
    this.subtotalpoints = this.quantity * this.product.points;
    this.subtotalCurrency = asCurrency(this.subtotal);
    cart.updateTotals();
}

function updateProductQuantity(sku, quantity) {
    for (let i = 0; i < cart.items.length; i++) {
        let item = cart.items[i];

        if (item.sku === sku) {
            item.quantity = quantity;
            item.updateItem();
            break;
        }
    }

    cart.updateTotals();
    cart = cart;
}

function removeProduct(sku) {
    cart.items = cart.items.filter(item => item.sku !== sku);
    cart.updateTotals();  // TODO: Make sure that update after assignment does not introduce race condition for total.
    cart = cart;
}

function updateTotals() {
    let _total = 0;
    let _totalPoints = 0;

    // Sum the item sub-totals.
    for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];

        _total += item.subtotal;
        _totalPoints += item.subtotalpoints;
    }

    // Update the points.
    this.totalPoints = _totalPoints;

    // Calculate and add the Semantic Service Fee.
    this.service_fee_amount = getApplicationFeeAmount(_total);
    _total += this.service_fee_amount;

    // Calculate and add the Stripe fee (based on the running total + Semantic fees).
    this.stripe_fee_amount = _total == 0 ? 0 : Math.round(stripe_fixed_fee + stripe_fee_rate * _total);

    // The total fees are the sum of the fees.
    this.totalFees  = asCurrency(this.stripe_fee_amount  + this.service_fee_amount);

    // And the total is the running total + all the fees.
    this.total = _total + this.stripe_fee_amount; // this.service_fee_amount was already added into _total
    this.totalCurrency = asCurrency(this.total);
}

export const ShoppingCartStore = writable(cart);
