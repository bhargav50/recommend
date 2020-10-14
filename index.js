require('./config/db');
const Asset = require('./models/asset');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

const preComputeResults = async () => {
    const assets = await Asset.query('1=1');
    const recommendationMap = new Map();
    for(let asset of assets) {
        const { asset_id } = asset;
        recommendationMap.set(asset_id.toString(), await getRecommendations(asset_id));
    }
    console.log('precomputing done');
    return recommendationMap;
};

const getRecommendations = async (asset_id) => {
    const targetAsset = await Asset.getById(asset_id);
    const {
        category,
        pre_tax_return,
        min_investment
    } = targetAsset;

    const mapToId = ({ asset_id }) => asset_id;
    
    // similar category items
    const similarCategoryItems = await Asset.query('category = ? AND asset_id != ?', [category, targetAsset.asset_id]);
    const similarCategoryItemsSet = new Set(similarCategoryItems.map(mapToId));

    // similar pre tax
    const preTaxSlab = pre_tax_return - 5;
    const similarPreTaxItems = await Asset.query(`pre_tax_return >= ? AND asset_id != ?`, [preTaxSlab, targetAsset.asset_id]);
    const similarPreTaxItemsSet = new Set(similarPreTaxItems.map(mapToId));

    // similar minimum investment
    const minInvestment = [min_investment - 5, min_investment + 5];
    const similarMinInvestmentItems = await Asset.query(`min_investment >= ? AND min_investment <= ? AND asset_id != ?`,
        [...minInvestment, targetAsset.id]
    );
    const similarMinInvestmentItemsSet = new Set(similarMinInvestmentItems.map(mapToId));

    const allItems = new Set([...similarCategoryItemsSet, ...similarPreTaxItemsSet, ...similarMinInvestmentItemsSet]);
    const allItemsWithDimensions = [];
    for(let [id] of allItems.entries()) {
        const item = [];
        item.push(similarCategoryItemsSet.has(id) ? 1 : 0);
        item.push(similarPreTaxItemsSet.has(id) ? 1 : 0);
        item.push(similarMinInvestmentItemsSet.has(id) ? 1 : 0);
        item.push(id);
        allItemsWithDimensions.push(item);
    };
    const targetDimensions = [1, 1, 1];
    const dotProduct = [];
    for(let item of allItemsWithDimensions) {
        let result = 0;
        for(let i = 0; i < targetDimensions.length; i++) {
            result += targetDimensions[i] * item[i];
        }
        dotProduct.push([item[item.length - 1], result]);
    }
    dotProduct.sort((a, b) => {
        return -a[1] + b[1];
    });

    const ids = dotProduct.slice(0, 3).map(([id]) => id);
    const assets = await Asset.query(`asset_id in ? order by field(asset_id, ${ids.join(',')})`, [[ids]]);

    return assets;
}

let recommendationMap;

preComputeResults().then(result => recommendationMap = result);

app.get('/assets', async (req, res) => {
    res.send(await Asset.getAllAssetsWithCategory());
});

app.get('/assets/recommend/:id', async (req, res) => {
    const asset_id = req.params.id;
    if (!asset_id) {
        return res.status(400).send({
            message: 'param id is required'
        });
    }
    res.send(recommendationMap.get(asset_id));
})

app.use(express.static(path.join(__dirname, '/client/build')));

app.listen(3000, () => {
    console.log('listening on 3000');
});