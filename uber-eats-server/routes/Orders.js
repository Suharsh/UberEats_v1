
const router = require("express").Router();
const dbPool = require('../connections/DBConnection');
const { v4: uuidv4 } = require('uuid');
const { stat } = require("fs");

router.post("/orders/customer/:id", function (req, resp) {
    let orderId = uuidv4();
    let customerId = req.params.id;
    let cart = req.body.cart;
    let addressId = req.body.addressId;
    let deliverytype = req.body.deliverytype;
    let restaurantId = req.body.restaurantId;
    orderId = uuidv4();
    currentTimeStamp = new Date();
    const orderQuery = "INSERT INTO Orders (OrderId, CustomerId, RestaurantId, OrderStatus, DeliveryType, CreatedAt, LastUpdatedTime, DeliveryAddressId) VALUES (?,?,?,?,?,?,?,?)";
    dbPool.query(orderQuery, [orderId,customerId,restaurantId,"Order Recieved",deliverytype,currentTimeStamp,currentTimeStamp,addressId], (err, results, fields) => {
        if (err) {
            console.log(err)
            resp.status(500).send({ error: 'Unknown internal server error' });
        } else {
            let orderDetails = [];
            cart.map(
                item => {
                    orderDetails.push([
                        orderId,
                        item.DishId,
                        item.Quantity,
                        item.Price
                    ]);
                }
            );
            const detailsQuery = "INSERT INTO OrderDetails (OrderId, DishId, Quantity, OrderPrice) VALUES ?";
            dbPool.query(detailsQuery, [orderDetails], (err, results, fields) => {
                if (err) {
                    console.log(err);
                    resp.status(500).send({ error: 'Unknown internal server error' });
                } else {
                    resp.send({orderId: orderId });
                }
            });

        }
    });
});

router.get("/orders/customer/:id", function (req, res) {
    const customerId = req.params.id;
    const query = "SELECT * FROM Address as a INNER JOIN Orders as o INNER JOIN Restaurant as r on r.RestaurantId = o.RestaurantId and o.DeliveryAddressId = a.AddressId where o.CustomerId = ?";
    //console.log(req);
    dbPool.query(query, [customerId], (err, results, fields) => {
        console.log(err);
        res.status(200).send(results);
    });
});

router.get("/orders/restaurant/:id", function (req, res) {
    const restaurantId = req.params.id;
    const query = "SELECT * FROM Customer as c INNER JOIN Orders as o on o.CustomerId = c.CustomerId where RestaurantId = ?";
    dbPool.query(query, [restaurantId], (err, results, fields) => {
        console.log(err);
        res.status(200).send(results);
    });
});

router.post("/orders/:id/status", function (req, res) {
    const orderId = req.params.id;
    const status = req.body.status
    const query = "Update Orders SET OrderStatus = ? where OrderId = ?";
    dbPool.query(query, [status, orderId], (err, results, fields) => {
        res.status(200).send(results);
    });
});

router.get("/orders/:id", function (req, res) {
    const orderId = req.params.id;
    const query = "SELECT * from Orders as o INNER JOIN Address as a on a.AddressId = o.DeliveryAddressId where o.OrderId = ?";
    //console.log(req);
    dbPool.query(query, [orderId], (err, results, fields) => {
        console.log(err);
        res.status(200).send(results);
    });
});

router.get("/orders/:id/items", function (req, res) {
    const orderId = req.params.id;
    const query = "SELECT * from OrderDetails as o INNER JOIN Dishes as d on d.DishId = o.DishId where o.OrderId = ?";
    //console.log(req);
    dbPool.query(query, [orderId], (err, results, fields) => {
        console.log(err);
        res.status(200).send(results);
    });
});

module.exports = router;