const express    = require ('express');
const dynamo     = require('dynamodb');
dynamo.AWS.config.update({accessKeyId: 'myaccessKeyId', secretAccessKey: 'mysecretAccessKey', region: "us-west-2"});
const bodyParser = require('body-parser');
const app        = express();

const port = 8000;

// to process URL in encoded form on its own
app.use(bodyParser.urlencoded({ extended: true }))

require('./app/routes')(app, {});

app.listen(port, () => {
    console.log("Listening on " + port);
})
