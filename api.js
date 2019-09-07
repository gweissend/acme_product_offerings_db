const express = require('express');
const db = require('./db');
const app = express().router();


const routes = {
    Product: 'products',
    Company: 'companies',
    Offering: 'offerings'
  }

  Object.keys(routes).forEach(key => {
    app.get(`/${routes[key]}`, (req, res, next) => {
      db.models[key].findAll()
        .then(items => res.send(items))
        .catch(next)
    })
  })

  module.exports = app;
