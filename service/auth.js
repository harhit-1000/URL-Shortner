require('dotenv').config();
const jwt_secret = process.env.jwt_secret;
const jwt = require('jsonwebtoken');
const secret = jwt_secret;
function setUser(user) {
  return jwt.sign( {
    id : user._id,
    email: user.email,
    role: user.role
  },secret);
}

function getUser(token)
{
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error){
    return null;
  }
}

module.exports = {
  setUser,
  getUser
};