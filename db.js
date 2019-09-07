
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

const map = (model, data) => data.map(value => model.create(value))

const syncAndSeed = async () => {
    conn.sync({force: true})
    const products = [
        {name: "ipad", suggestedPrice: 100},
        {name: "iphone", suggestedPrice: 1},
        {name: "macBook", suggestedPrice: 10000000}
    ]
    const [ipad, iphone, macBook] = await Promise.all(map(Product, products))
}

syncAndSeed()