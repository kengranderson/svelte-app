let products;
let prices;

async function getProducts() {
    // Get products server-side.
    const response = await fetch('/products');

    if (response.ok) {
        ({ products, prices } = await response.json());

        products.forEach(product => {
            let _prices = prices.filter(price => price.id === product.default_price);
            product.price = _prices[0].unit_amount;
        });

        return products.filter(product => product.metadata.Category == 'Points');
    } else {
        const err = await response.text();
        console.error(err);
        return [];
    }
}

export const CatalogStore = {
    getProducts: getProducts
};
