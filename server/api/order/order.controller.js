'use strict';

var _ = require('lodash');
var Order = require('./order.model');

// Get list of orders
exports.index = function(req, res) {
  Order.find(function (err, orders) {
    if(err) { return handleError(res, err); }
    return res.json(200, orders);
  });
};

// Get a single order
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    return res.json(order);
  });
};

// Creates a new order in the DB.
exports.create = function(req, res) {
  var newCharge = Order.createStripeCharge(req.body, res);
  Order.create(req.body, function(err, order) {
    if(err) { return handleError(res, err); }
    newCharge.then(function(charge) {
      order.processOrderCheck();
      order.createDate();
      order.setChargeId(charge.id);
      order.save(function(err, updatedOrder, numModified) {
        console.log(updatedOrder);
        console.log(numModified);
        if (err) {return handleError(res, err); }
        return res.json(201, order);  
      });
    });
  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, order) {
    if (err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    var updated = _.merge(order, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, order);
    });
  });
};


exports.capture = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if (err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    Order.captureStripeCharge(req.body.billing.chargeId); // where do you get the charge id from?
    var updated = _.merge(order, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, order);
    });
  });
}

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    order.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}