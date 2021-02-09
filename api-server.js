const express = require('express');
const app = express();
const got = require('got');
const bodyParser = require('body-parser');

// allow every browser to get response from this server, this MUST BE AT THE TOP
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

function errResponseFn(err, res) {
  res.write('Error: ', JSON.stringify(err));
  res.end();
}

// get token 
app.post('/requesttoken', async (req, res) => {
  try {
    const { body } = await got(req.body.url + '/requesttoken?secret=' + req.body.secret);
    res.write(body);
    res.end();
  } catch (err) {
    errResponseFn(err, res);
  }
});