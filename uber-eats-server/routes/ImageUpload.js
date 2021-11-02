const { upload } = require("../service/fileUploadService");

const router = require("express").Router();

router.post("/image/:entity",upload.single('image'),(req,res,next)=>{
    res.send({imageUrl:req.file.location});
});

module.exports = router;