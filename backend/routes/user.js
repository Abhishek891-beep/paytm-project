
const express = require("express")
const router = express.Router();
const {User, Account} = require("../db")
const z = require("zod")
const jwt = require("jsonwebtoken")
const {JWT_SECRET}  = require("../config")
const { authMiddleware } = require("../middleware")




const signupSchema = z.object({
    username : z.string(),
    password : z.string(),
    firstName : z.string(),
    lastName :z.string()
})

router.post("/signup" ,async (req,res)=> {
    const data = req.body;

    const check = signupSchema.safeParse(data);

    if(!check.success){
        return res.json({
            msg : "Email already taken / INcorrect inputs"
        })
    }

    const user = User.findOne({
        username :req.body.username 
    })

    if(user._id){
        return res.json({
            msg : "email already taken / incorrect inputs"
        })
    }
    const dbUser = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstName : req.body.firstName,
        lastName :req.body.lastName 
    });
    const userId = dbUser._id;

    await Account.create({
        userId,
        balance : 1 + Math.random()*1000
    })

    const token = jwt.sign({
        userId 
    }  , JWT_SECRET)

    res.json({
        msg : "user created successfully",
        token : token 
    })



})

const signinSchema = z.object({
    username : z.string(),
    password : z.string()
})


router.post("/signin" ,async (req,res)=> {
    const data = req.body;

    const check = signinSchema.safeParse(data);

    if(!check.success){
        return res.json({
            msg : "Email already taken / INcorrect inputs"
        })
    }

    const user =await  User.findOne({
        username : req.body.username ,
        password : req.body.password
    });

    if(!user._id){
        return res.json({
            msg : "email not taken / go to signin page"
        })
    }

    const token = jwt.sign({
        userId : user._id  
    }  , JWT_SECRET)

    res.json({
        msg : "user  successfully signed in.",
        token : token 
    })
    return;

})

const updateSchema = z.object({
    firstName : z.string().optional(),
    lastName : z.string().optional() ,
    password :z.string().optional()

})


router.put("/update" , authMiddleware ,async (req , res)=> {
    const updateBody = req.body;

    const {success}  = updateSchema.safeParse(updateBody);

    if(!success){
        return res.json({
            msg : "inputs are not correct"
        })
    }

    await User.updateOne(req.body , {
        id : req.userId
    })

    res.json({
        msg : "udpated successfully"
    })


})

router.get("/bulk" , async(req, res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or : [{
            firstName : {
                "$regex" : filter
            }
        },   {
            lastName : {
                "$regex" : filter
            }

        }]
    })
    
    res.json({
        user : users.map(user=>({
            username : user.username ,
            firstName : user.firstName,
            lastName : user.lastName ,
            _id : user._id 
        }) )
    })






})
















module.exports  = router;