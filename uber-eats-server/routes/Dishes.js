const router = require("express").Router();
const dbPool = require('../connections/DBConnection');
const { v4: uuidv4 } = require('uuid');

router.post("/restaurant/dishes", function (req, resp) {

    console.log(req.body);

    let { dishId, name, type, dishdesc, restaurantId, category, price, imageUrl } = req.body;
    if (!dishId) {
        dishId = uuidv4();
        const query = "INSERT INTO Dishes(DishId,DishName,DishType,RestaurantId,DishDesc,Category,Price,ImageUrl) VALUES(?,?,?,?,?,?,?,?)";
        dbPool.query(query, [dishId, name, type, restaurantId, dishdesc, category, price, imageUrl], async (err, results, fields) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    resp.status(400).send({ error: "Dish already exists" });
                } else {
                    resp.status(500).send({ error: 'Unknown internal server error' });
                }
            } else {
                console.log(results);
                resp.send({ dishId: dishId });
            }
        });
    }else{
        const query = "UPDATE Dishes SET DishName=?,DishType=?,DishDesc=?,Category=?,Price=?,ImageUrl=? where DishId=?";
        dbPool.query(query, [name, type, dishdesc, category, price, imageUrl,dishId], async (err, results, fields) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    resp.status(400).send({ error: "Dish already exists" });
                } else {
                    resp.status(500).send({ error: 'Unknown internal server error' });
                }
            } else {
                console.log(results);
                resp.send({ dishId: dishId });
            }
        });
    }

});

router.get("/restaurant/:id/dishes", function (req, res) {
    const restaurantId = req.params.id;
    const query = "SELECT * FROM Dishes where RestaurantId = ?";
    dbPool.query(query, [restaurantId], (err, results, fields) => {
        res.status(200).send(results);

    });
});

router.get("/dishes/:id", function (req, res) {
    const dishId = req.params.id;
    const query = "SELECT * FROM Dishes where DishId = ?";
    dbPool.query(query, [dishId], (err, results, fields) => {
        res.status(200).send(results[0]);
    });
});

//query restaurants based on country and city
router.get("/dishes", function (req, res) {
    const country = req.query.country;
    const city = req.query.city;
    console.log(req.query);
    let queryCondition = '';
    if (country.length)
        queryCondition = queryCondition + " where r.Country = ? ";
    if (city.length)
        queryCondition = queryCondition + "and r.City = ?";
    const query = "Select * FROM Restaurant as r INNER JOIN Dishes as d on r.RestaurantId = d.RestaurantId " + queryCondition;
    dbPool.query(query, [country, city], (err, results, fields) => {
        res.status(200).send(results);
    });
});

module.exports = router;
