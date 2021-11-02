const router = require("express").Router();
const {v4 : uuidv4} = require('uuid')
const dbPool = require('../connections/DBConnection');
const bcrypt = require("bcrypt");


router.post("/customer/register",async(req,resp)=>{
    email = req.body.email;
    encrypTedPassword = await bcrypt.hash(req.body.password, 10);
    customerName = req.body.name;
    customerId = uuidv4();
    country = req.body.country;
    city = req.body.city;
    let query = "INSERT INTO Customer(CustomerId,EmailId,CustomerName,CustomerPassword,Country,City) VALUES(?,?,?,?,?,?)";
    dbPool.query(query,[customerId,email,customerName,encrypTedPassword,country,city],function(err,results, fields){
        if(err){
            if (err.code === 'ER_DUP_ENTRY') {
                resp.status(400).send({error:"Email Id is already registered"});
            }else{
                resp.status(500).send({error:'Unknow internal server error'});
            }
        }else{
            resp.send({CustomerId:customerId,EmailId:email,CustomerName:customerName,Country:country,City:city});
        }
    });
});

router.post("/restaurant/register",async(req,resp)=>{
    email = req.body.email;
    encrypTedPassword = await bcrypt.hash(req.body.password, 10);
    restaurantName = req.body.name;
    restaurantId = uuidv4();
    country = req.body.country;
    city = req.body.city;
    let query = "INSERT INTO Restaurant(RestaurantId,EmailId,RestaurantName,RestaurantPassword,Country,City) VALUES(?,?,?,?,?,?)";
    dbPool.query(query,[restaurantId,email,restaurantName,encrypTedPassword,country,city],function(err,results, fields){
        if(err){
            if (err.code === 'ER_DUP_ENTRY') {
                resp.status(400).send({error:"Email Id is already registered"});
            }else{
                resp.status(500).send({error:'Unknow internal server error'});
            }
        }else{
            resp.send({RestaurantId:restaurantId,RestaurantName:restaurantName,EmailId:email,Country:country,City:city});
        }
    });
});



module.exports = router;
