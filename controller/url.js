const { nanoid } = require('nanoid');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if(!body.url){ return res.status(400).json({error: 'url is required'});}
  const shortID = nanoid(8);
  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id
  });
  return res.render("home",{
    id : shortID
  });
}

async function handleGetAnalytics(req, res){
  const shortId = req.params.shortId;
  if(!shortId)
  {
    return res.status(400).json({error:'url is not correct.'})
  }
  const countdata = await URL.findOne(
    {
      shortID:shortId
    }
  );

  if(!countdata)
  {
    return res.json({error:"data not found"});
  }
  return res.json({
    totalClicks:countdata.visitHistory.length,
    analytics:countdata.visitHistory
  });

}

module.exports = {handleGenerateNewShortURL,handleGetAnalytics}