const user = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller

const registerUser = async(req,res)=>{
    try{

        //extract user information from fronte req.body

        const {username,email,password,role} = req.body;

        //check  if the user is already in database it must be unique
        const checkExistingUser = await user.findOne({$or :[{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                sucsess:false,
                message:'User is already exists with same username or same email please try with a different username or email'
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPAssword = await bcrypt.hash(password,salt);

        //create a new user and save in your database
        const newlyCreatedUser = new user({
            username,
            email,
           password:hashedPAssword,
           role:role 
        })

        await newlyCreatedUser.save();

        if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user! please try again.",
      });
    }

    }catch(e){
        console.log(e);
        res.status(500).json({
            sucsess:false,
            message:e.message
        })
    }
}

//login controller


const loginUser = async(req,res)=>{
    try {
    const { username, password } = req.body;

    //find if the current user is exists in database or not
    const users = await user.findOne({ username });

    if (!users) {
      return res.status(400).json({
        success: false,
        message: `User doesn't exists`,
      });
    }
    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, users.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    //create user token
    const accessToken = jwt.sign(
      {
        userId: users._id,
        username: users.username,
        role: users.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
    
}

const changePassword = async(req,res)=>{
  try{
    const userId = req.userInfo.userId;
    //extract old and new password
    //two password cant be same
    const {password, newPassword } = req.body;

    //find the current logened in user from database
    const exustingUser = await user.findById(userId);
    if(!exustingUser){
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }

    //check old password is correct both password must be same
    const isPasswordMatch = await bcrypt.compare(password,exustingUser.password);
    if(!isPasswordMatch){
      return res.status(400).json({
        success:false,
        message:"old password is not matching. please try again"
      })
    }
    //hash the new password here
    const salt = await bcrypt.genSalt(10);
    const hashedPAssword = await bcrypt.hash(newPassword,salt);

    //update the password in databse
    exustingUser.password = hashedPAssword;
    await exustingUser.save();

    res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })

  }catch(e){
  console.log(e);
  res.status(500).json({
    success: false,
    message: e.message,
  });
}
}


module.exports ={loginUser,registerUser,changePassword};