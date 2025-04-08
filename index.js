const express = require("express");
const Path = require('path');
const {connectToMongoDB} = require('./connect');
const URL = require('./models/url');
const app = express();
const PORT = 8001;
const cookieParser = require('cookie-parser');
const  {restrictTo, checkForAuthentication} = require('./middleware/auth');
require('dotenv').config();
const mongo_url = process.env.mongo_url;

const urlRoute = require("./routes/url");
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');

connectToMongoDB(mongo_url);
app.set("view engine","ejs");
app.set('views', Path.resolve("./views"))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication)

app.use('/', staticRoute);
app.use('/user', userRoute);

app.use('/url',restrictTo(["NORMAL","ADMIN"]),urlRoute);

app.get('/:shortId', async (req, res)  => {
  const shortId = req.params.shortId;
  
  try {
    // Find the URL entry and update the visit history
    const entry = await URL.findOneAndUpdate(
      {shortID:shortId},
      {
        $push: {
          visitHistory: {
            timestamp: Date.now()
          },
        }
      },
      { new: true }  // Ensure we return the updated document
    );

    // If no entry found, return a 404 error
    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    // If entry is found, redirect the user
    return res.redirect(entry.redirectURL);  

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

app.listen(PORT, () => console.log(`server started at PORT:${PORT}`));

// app.listen(PORT,()=> console.log(`server started at PORT:${PORT}`));

