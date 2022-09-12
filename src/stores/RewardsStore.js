import { ConfigStore } from './ConfigStore';

const lambdaUrl = ConfigStore.VITE_LAMBDA_BASE_URL;

const processResponse = async (response, success, failure) => {
    if (response.ok) {
        if (success) {
            const data = await response.json();
            success(data);
        }
    }
    else {
        const error = await response.text();
        console.error(error);

        if (failure) {
            failure(error);
        }
    }
}

const getWallet = async (userid, success, failure) => {
    const apiUrl = lambdaUrl + '/wallet/' + userid;
    const response = await fetch(apiUrl);
    await processResponse(response, success, failure);
}

const transferAsset = async (assetid, fromid, toid, success, failure) => {
    const apiUrl = lambdaUrl + '/asset/transfer';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            assetid: assetid,
            fromid: fromid,
            toid: toid
        })
    });
    await processResponse(response, success, failure);
}

const mintAsset = async (assettype, metadata, success, failure) => {
    const apiUrl = lambdaUrl + '/assets/mint';
    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            assettype: assettype,
            metadata: metadata
        })
    });
    await processResponse(response, success, failure);
}

const transferAssetType = async (assettype, fromid, toid, quantity, paymentintentid, success, failure) => {
    const apiUrl = lambdaUrl + '/assettype/transfer';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            assettype: assettype,
            fromid: fromid,
            toid: toid,
            quantity: quantity,
            paymentintentid: paymentintentid || null
        })
    });
    await processResponse(response, success, failure);
}

const mintTokens = async (symbol, quantity, success, failure) => {
    const apiUrl = lambdaUrl + '/tokens/mint';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            symbol: symbol,
            quantity: quantity
        })
    });
    await processResponse(response, success, failure);
}

const mintPoints = async (quantity, success, failure) => {
    const apiUrl = lambdaUrl + '/points/mint';
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quantity: quantity
        })
    });
    await processResponse(response, success, failure);
}

const getFirstAssetType = async (ownerid, assettype, success, failure) => {
    const apiUrl = lambdaUrl + '/assettype/first/' + ownerid + '/' + assettype;
    const response = await fetch(apiUrl);
    await processResponse(response, success, failure);
}

const emptyWallet = () => {
    return {
        badge: { name: 'Badges', balance: 0 },
        gift: { name: 'Gifts', balance: 0 },
        good: { name: 'Goods', balance: 0 },
        point: { name: 'Points', balance: 0 },
        'token-dyme': { name: 'DYME Tokens', balance: 0 },
        'token-semt': { name: 'SEMT Tokens', balance: 0 },
        'token-slsp': { name: 'SLSP Tokens', balance: 0 }
    };
}

export const RewardsStore = {
    getWallet: getWallet,
    transferAsset: transferAsset,
    mintAsset: mintAsset,
    transferAssetType: transferAssetType,
    mintTokens: mintTokens,
    mintPoints: mintPoints,
    getFirstAssetType: getFirstAssetType,
    emptyWallet: emptyWallet
};
