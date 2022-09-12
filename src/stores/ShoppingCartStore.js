import { writable } from 'svelte/store';

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
    total: 0,
    totalCurrency: asCurrency(0),
    addProduct: addProduct,
    updateProductQuantity: updateProductQuantity,
    removeProduct: removeProduct,
    updateTotal: function () {
        let _total = 0;

        for (let i = 0; i < this.items.length; i++) {
            _total += this.items[i].subtotal;
        }

        this.total = _total;
        this.totalCurrency = asCurrency(_total);
    },
    getDescription: function() {
        return 'Owner: ' + this.customerEmail + ' (' + this.userid + ')';
    }
};

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
        product: addCurrencyPrice(product),
        quantity: quantity,
        updateItem: updateItem
    };
    item.updateItem();

    cart.items.push(item);
    cart.updateTotal();
    cart = cart;

    function addCurrencyPrice(product) {
        product.priceCurrency = asCurrency(product.price);
        return product;
    }
}

// To be called on an item AFTER the item quantity has been updated.  Updates dependent properties.
function updateItem() {
    this.subtotal = this.quantity * this.product.price;
    this.subtotalCurrency = asCurrency(this.subtotal);
    cart.updateTotal();
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

    cart.updateTotal();
    cart = cart;
}

function removeProduct(sku) {
    cart.items = cart.items.filter(item => item.sku !== sku);
    cart.updateTotal();  // TODO: Make sure that update after assignment does not introduce race condition for total.
    cart = cart;
}

export const ShoppingCartStore = writable(cart);
