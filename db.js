
const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_product_offerings_db')
const {UUID, UUIDV4, STRING, DECIMAL} = Sequelize

const defineId = {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4,
    unique: true
}

const defineName = {
    type: STRING,
    allowNull: false,
    unique: true
}

const Product = conn.define('product',{
    id: defineId,
    name: defineName,
    suggestedPrice: {
        type: DECIMAL
    }
})

const Company = conn.define('company',{
    id: defineId,
    name: defineName,
})

const Offering = conn.define('offering',{
    id: defineId,    
    price: DECIMAL,
})

Offering.belongsTo(Company);
Offering.belongsTo(Product);

Company.hasMany(Offering);
Product.hasMany(Offering);

const map = (model, data) => data.map(value => model.create(value))

const syncAndSeed = async () => {
    conn.sync({force: true})
    const products = [
        {name: "ipad", suggestedPrice: 100},
        {name: "iphone", suggestedPrice: 1},
        {name: "macBook", suggestedPrice: 10000000}
    ]
    const [ipad, iphone, macBook] = await Promise.all(map(Product, products))
    const companies = [
        {name: "apple"},
        {name: "fullstack"},
        {name: "bestbuy"}
    ]
    const [apple, fullstack, bestbuy] = await Promise.all(map(Company, companies));
    const offerings = [
        {price: 200, productId: ipad.id, companyId: apple.id},
        {price: 100, productId: ipad.id, companyId: bestbuy.id},
        {price: 300, productId: iphone.id, companyId: fullstack.id},
        {price: 2000, productId: iphone.id, companyId: bestbuy.id},
        {price: 50, productId: macBook.id, companyId: apple.id}
    ]
    await Promise.all(map(Offering, offerings));
}

module.exports = {
    syncAndSeed,
    models: {
        Product,
        Company,
        Offering
    }
}

syncAndSeed();