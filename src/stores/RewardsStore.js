import { ConfigStore } from './ConfigStore';

const lambdaUrl = ConfigStore.VITE_LAMBDA_BASE_URL;

const processResponse = async (response, success, failure) => {
    if (response.ok) {
        const data = await response.json();
        success(data);
    }
    else {
        console.error(response);

        if (failure) {
            failure(response);
        }
    }
}

const wallet_get = async (userid, success, failure) => {
    const apiUrl = lambdaUrl + '/wallet/' + userid;
    const response = await fetch(apiUrl);
    await processResponse(response, success, failure);
}

const asset_transfer = async (assetid, fromid, toid, success, failure) => {
    const apiUrl = lambdaUrl + '/asset/transfer';
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            assetid: assetid, 
            fromid: fromid, 
            toid: toid
        })
    });
    await processResponse(response, success, failure);
}

const assets_mint = async (assettype, metadata, success, failure) => {
    const apiUrl = lambdaUrl + '/assets/mint';
    const response = await fetch(apiUrl, {
        method: 'PUT',
        body: JSON.stringify({
            assettype: assettype, 
            metadata: metadata
        })
    });
    await processResponse(response, success, failure);
}

const assettype_transfer = async (assettype, fromid, toid, quantity, success, failure) => {
    const apiUrl = lambdaUrl + '/assettype/transfer';
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            assettype: assettype, 
            fromid: fromid, 
            toid: toid,
            quantity: quantity
        })
    });
    await processResponse(response, success, failure);
}

const tokens_mint = async (symbol, quantity, success, failure) => {
    const apiUrl = lambdaUrl + '/tokens/mint';
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            symbol: symbol, 
            quantity: quantity
        })
    });
    await processResponse(response, success, failure);
}

const points_mint = async (quantity, success, failure) => {
    const apiUrl = lambdaUrl + '/points/mint';
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            quantity: quantity
        })
    });
    await processResponse(response, success, failure);
}

const assettype_getfirst = async (ownerid, assettype, success, failure) => {
    const apiUrl = lambdaUrl + '/assettype/first/' + ownerid + '/' + assettype;
    const response = await fetch(apiUrl);
    await processResponse(response, success, failure);
}

export const RewardsStore = {
    wallet_get: wallet_get,
    asset_transfer: asset_transfer,
    assets_mint: assets_mint,
    assettype_transfer: assettype_transfer,
    tokens_mint: tokens_mint,
    points_mint: points_mint,
    assettype_getfirst: assettype_getfirst
};
