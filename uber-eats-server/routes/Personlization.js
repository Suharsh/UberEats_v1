const router = require("express").Router();
const dbPool = require('../connections/DBConnection');

router.post("/personalize/customer", (req,res)=>{
    let {customerId,restaurantId} = req.body;
    const query = "INSERT INTO Personalization (CustomerId, RestaurantId) VALUES ( ? , ? )";
    dbPool.query(query,[customerId,restaurantId],(err,results,fields)=>{
        if(err){
            console.log(err)
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).send({error:"Dish already exists"});
            }else{
                res.status(500).send({error:'Unknown internal server error'});
            }
        }else{
            res.send("added to personalization");
        }
    });

});

router.get("/personalize/customer/:id",(req,res)=>{
    let customerId = req.params.id;
    const query = "SELECT * from Restaurant where RestaurantId IN (select RestaurantId from Personalization where CustomerId = ?)";
    dbPool.query(query,[customerId],(err,results,fields)=>{
        if(err){
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).send({error:"Restaurant already marked as favourite"});
            }else{
                res.status(500).send({error:'Unknown internal server error'});
            }
        }else{
            res.send(results)
        }
    });
})

module.exports = router;