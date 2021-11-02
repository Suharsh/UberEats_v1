const router = require("express").Router();
const {v4 : uuidv4} = require('uuid')
const dbPool = require('../connections/DBConnection');

router.post("/restaurant/:id",async(req,resp)=>{
    restaurantId = req.params.id;
    restaurantName = req.body.name;
    restaurantId = req.params.id;
    country = req.body.country;
    state = req.body.state;
    city = req.body.city;
    pincode = req.body.pincode;
    fromHrs = req.body.fromHrs;
    toHrs = req.body.toHrs;
    phone = req.body.phone;
    desc = req.body.desc;
    imageUrl = req.body.imageUrl;
    mode = req.body.mode
  
    let query = "UPDATE Restaurant SET RestaurantName = ?, RestaurantDesc = ?, Country = ?, City = ?, State = ?, PhoneNumber = ?,Pincode = ?, WorkHrsFrom = ? , WorkHrsTo = ?, Mode = ?, ImageUrl = ? where RestaurantId = ?";
    dbPool.query(query,[restaurantName,desc,country,city,state,phone,pincode,fromHrs,toHrs,mode,imageUrl,restaurantId],function(err,results, fields){
        if(err){
            resp.status(500).send({error:'Unknow internal server error'});
        }else{
            resp.send({message : "updated"});
        }
    });
});

router.get("/restaurant/:id",(req,resp)=>{
    
    const restaurantId = req.params.id;
    let query = "SELECT * from Restaurant where RestaurantId = ?";
    dbPool.query(query,[restaurantId],function(err,results, fields){
        if(err){
            resp.status(500).send({error:'Unknow internal server error'});
        }else{
            resp.status(200).send(results[0]);
        }
    });
});

router.get("/customer/:id",(req,resp)=>{
    const customerId = req.params.id;
    let query = "SELECT * from Customer where CustomerId = ?";
    dbPool.query(query,[customerId],function(err,results, fields){
        if(err){
            resp.status(500).send({error:'Unknow internal server error'});
        }else{
            resp.status(200).send(results[0]);
        }
    });
});


router.post("/customer/:id",async(req,resp)=>{
    customerId = req.params.id;
    customerName = req.body.name;
    country = req.body.country;
    state = req.body.state;
    city = req.body.city;
    pincode = req.body.pincode;
    phone = req.body.phone;
    imageUrl = req.body.imageUrl;
    nickName = req.body.nickname;
    dateOfBirth = req.body.dob; 
  
    let query = "UPDATE Customer SET CustomerName = ?, NickName = ?, DateOfBirth = ?, Country = ?, City = ?, State = ?, PhoneNumber = ?,Pincode = ?, ImageUrl = ? where CustomerId = ?";
    dbPool.query(query,[customerName,nickName,dateOfBirth,country,city,state,phone,pincode,imageUrl,customerId],function(err,results, fields){
        console.log(err);
        if(err){
            resp.status(500).send({error:'Unknow internal server error'});
        }else{
            resp.send({message : "updated"});
        }
    });
});


module.exports = router;