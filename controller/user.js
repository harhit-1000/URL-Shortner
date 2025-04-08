const User = require('../models/user');
const {v4 :uuidv4} = require("uuid");
const {setUser} = require('../service/auth');
async function handleUserSignup(req,res) {
  const { name, email, password } = req.body;
  // if(User.findOne(email)) res.render("signup")
  await User.create({
    name,
    email,
    password
  });
  return  res.render("home");
}

async function handleUserLogin(req,res) {
  const {  email, password } = req.body;
  const user = await User.findOne({email, password});
  console.log(user);
  if(!user)
  return  res.render("login",{error: "Invalid Username or password"});

  
  const token = setUser(user);
  res.cookie('token', token);
  // console.log(token);
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin
}