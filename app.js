require("dotenv").config();
const express = require("express");
const dnsSync = require('dns-sync');
const url = require('url');
const crypto = require('crypto')
const urlModel = require("./models/url");
const app = express();

app.use(express.urlencoded({extended: true}));

function isUrlValid(urlToCheck){
    var valid = dnsSync.resolve(url.parse(urlToCheck).host);    //Checks if the host actually exists
    return valid !== null;
}

function generateId(len){
    return crypto
    .randomBytes(Math.ceil((len * 3) / 4))
    .toString('base64')     // convert to base64 format
    .slice(0, len)          // return required number of characters
    .replace(/\+/g, '0')    // replace '+' with '0'
    .replace(/\//g, '0')    // replace '/' with '0'
}

app.post('/api/shorturl/new', async (req, res) => {
    var originalUrl = req.body.url;

    if(isUrlValid(originalUrl)){
        var shortUrl = generateId(8);

        var newUrl = new urlModel({
            original_url: originalUrl,
            short_url: shortUrl
        });

        newUrl.save((err, data) => {
            if(err) return console.error(err);
            res.json({
                original_url: data.original_url,
                short_url: process.env.HOST + data.short_url
            });
        });
    }
    else {
        res.json({ "error": "invalid URL" })
    }
});

app.get('/:shorturl', (req, res) => {
    var shortUrl = req.params.shorturl;
    
    urlModel.findOne({short_url: shortUrl}, (err, data) => {
        if(err) return console.error(err);
        res.redirect(data.original_url);
      })
});

app.listen(process.env.PORT | 3000);