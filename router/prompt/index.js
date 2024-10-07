const MainRouter=require("express").Router()


MainRouter.route("/").get((req,res)=>{
    res.send('test')   
})

MainRouter.route("/").post((req,res)=>{
    console.log(req.body,'test')

    res.send('test')   
})

module.exports=MainRouter;