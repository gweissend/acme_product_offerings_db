const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

const routes = {
  Product: 'products',
  Company: 'companies',
  Offering: 'offerings'
}

Object.keys(routes).forEach(key => {
  app.get(`/api/${routes[key]}`, (req, res, next) => {
    db.models[key].findAll()
      .then(items => res.send(items))
      .catch(next)
  })
})

db.syncAndSeed()
  .then(() => {
    app.listen(port, () => console.log('listening to port 3000'));
  })