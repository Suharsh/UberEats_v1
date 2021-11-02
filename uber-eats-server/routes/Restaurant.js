const router = require("express").Router();
const dbPool = require('../connections/DBConnection');
const {v4 : uuidv4} = require('uuid');

//query restaurants based on country and city
router.get("/restaurant",function(req,res){
    const country = req.query.country;
    const city = req.query.city;
    console.log(req.query);
    let queryCondition='';
    if(country!=undefined && country.length)
      queryCondition = queryCondition + " where Country = ? ";
    if(city!=undefined && city.length)
      queryCondition = queryCondition + "and City = ?";
    const query = "Select * FROM Restaurant" + queryCondition;
    dbPool.query(query,[country,city], (err,results,fields)=>{
        res.status(200).send(results);
    });
});

//retrieve all restaurants
router.get("/restaurants",function(req,resp){
    const query = "select * from Restaurant";
    dbPool.query(query, (err,results,fields)=>{
        resp.status(200).send(results);
    });
});

//retrieve a restaurants
router.get("/restaurants/:id",function(req,resp){
    const id = req.params.id;
    const query = "select * from Restaurant where RestaurantId = ?";
    dbPool.query(query,[id],(err,results,fields)=>{
        delete results[0]["RestaurantPassword"];
        resp.status(200).send(results);
    });
});

router.get("/dishes",function(req,res){
    const name = req.query.name;
    const query = "SELECT * FROM Dishes where RestaurantId = ?";
    dbPool.query(query,[restaurantId], (err,results,fields)=>{
        res.status(200).send(results);

    });
});

module.exports = router;
