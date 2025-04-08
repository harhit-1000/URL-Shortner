const mongoose = require('mongoose');
const urlShema = new mongoose.Schema({
shortID:{
  type:String,
  required:true,
  unique:true
},
redirectURL: {
  type: String,
  required:true
},
visitHistory: [{timestamp:{type: Number}}],
createdBy:{
  type: mongoose.Schema.ObjectId,
ref: "users"
}


},{timestamps:true});

const URL = mongoose.model('url', urlShema);

module.exports = URL;