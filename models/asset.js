const pool = require('../config/db');

class Asset {

    // String - title of asset
    title;

    // String - main image describing the asset
    imageUrl;

    // id - category this asset belongs to
    category;

    // Number - return before taxes
    preTaxReturn;

    // Number - minimum amount that can be invested
    minInvestment;

    constructor({
        title,
        imageUrl,
        preTaxReturn,
        minInvestment,
        category
    }) {
        this.imageUrl = imageUrl;
        this.title = title;
        this.preTaxReturn = preTaxReturn;
        this.minInvestment = minInvestment;
    }

    static async query(queryString, params, selector) {
        return (await pool).query(`SELECT ${selector || '*'} from assets where ${queryString}`, params);
    };

    static async getByField(fieldName, fieldValue, selector) {
        return (await pool).query(`SELECT ${selector || '*'} from assets where ${fieldName}=?`, [fieldValue]);
    }

    static async getById(id) {
        return (await this.getByField('asset_id', id))[0];
    }

    static async getAllAssetsWithCategory() {
        return (await pool).query(`SELECT
            a.asset_id,
            a.min_investment,
            a.pre_tax_return,
            c.id,
            c.name as category,
            a.title as title,
            a.image_url
            from assets a INNER JOIN categories c
            ON a.category = c.id
        `);
    }
}

module.exports = Asset;