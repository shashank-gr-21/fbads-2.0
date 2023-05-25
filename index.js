const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8000;

const express = require("express");
const bodyParser = require("body-parser");
const bizSdk = require("facebook-nodejs-business-sdk");
const AdAccount = bizSdk.AdAccount;

const app = express();
app.use(bodyParser.json());

const access_token = process.env.FB_ACCESS_TOKEN;

const api = bizSdk.FacebookAdsApi.init(access_token);

app.get("/", async (request, response) => {
  try {
    const id = "act_100555887474646";
    const fields = ["name", "objective","daily_budget"];
    const params = {
      effective_status: ["ACTIVE", "PAUSED"],
    };
    const campaigns = await new AdAccount(id).getCampaigns(fields, params);
    const data = campaigns.map((item)=>{
      if (!item._data.daily_budget){
        return {...item._data,daily_budget:"0"};
      }
      return item._data;
    });
    response.status(200).send(data)
  } catch (error) {
    console.log(error);
    response.status(400).json(error);
  }
});

app.listen(PORT,()=>{
    console.log('Listening on port 8000')
})