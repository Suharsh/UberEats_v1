
const router = require("express").Router();
const dbPool = require('../connections/DBConnection');
const { v4: uuidv4 } = require('uuid');
const { stat } = require("fs");

router.post("/deliveryAddress/customer/:id", function (req, resp) {

    const { addressLine1, addressLine2, city, state, country, pincode, addressName, save } = req.body;
    const customerId = req.params.id;
    const addressId = uuidv4();

    const query = "INSERT INTO Address(AddressId,AddressLine1,AddressLine2,City,State,Country,PinCode) VALUES(?,?,?,?,?,?,?)";
    dbPool.query(query, [addressId, addressLine1, addressLine2, city, state, country, pincode], async (err, results, fields) => {
        if (err) {
            console.log(err);
            resp.status(500).send({ error: 'Unknown internal server error' });
        } else {
            if (save) {
                const query = "INSERT INTO DeliveryAddress(CustomerId,AddressId,SavaAsName) VALUES(?,?,?)";
                dbPool.query(query, [customerId, addressId, addressName], async (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        resp.status(500).send({ error: 'Unknown internal server error' });
                    } else {
                        resp.send({ AddressId: addressId });
                    }
                });
            }else{
                resp.send({ AddressId: addressId });
            }
        }
    })
});

router.get("/deliveryAddress/customer/:id", function (req, res) {
    const customerId = req.params.id;
    const query = "SELECT * FROM Address as a INNER JOIN DeliveryAddress as d on a.AddressId = d.AddressId where d.CustomerId = ?";
    dbPool.query(query, [customerId], (err, results, fields) => {
        res.status(200).send(results);
    });
});

module.exports = router;