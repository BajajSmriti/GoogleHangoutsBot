const express = require('express');
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const gkeys = require("./hangouts1key.json");
const unirest = require('unirest');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log('someone pinged @<bot-name>');

    if (req.body.type === 'MESSAGE') {
    	postMessage();
 //        return res.json({
	//     text: 'sleeping...'
	// });
    }
});

function getJWT() {
    return new Promise((resolve, reject) => {
        let jwtClient = new google.auth.JWT(
	    gkeys.client_email,
	    null,
	    gkeys.private_key, ['https://www.googleapis.com/auth/chat.bot']);

	jwtClient.authorize((err, tokens) => {
	    if (err) {
	        console.log('Error create JWT hangoutchat');
		reject(err);
	    } else {
	        resolve(tokens.access_token);
	    }
	});
    });
}

function postMessage() {
    return new Promise((resolve, reject) => {
        getJWT().then((token) => {
	    unirest.post('https://chat.googleapis.com/v1/spaces/YOUR-SPACE-NAME/messages')
	        .headers({
		    "Content-Type": "application/json",
		    "Authorization": "Bearer " + token
		})
		.send(JSON.stringify({
		    'text': 'Hello! This is a message'
		}))
		.end((res) => {
		    resolve();
		});
        }).catch((err) => {
	    reject(err);
	});
    });
}

const timer = require('timers');
app.listen(11009, () => {
    console.log('App listening on port 11009.');

    //let count = 0;
    // timer.setInterval(() => {
    //     postMessage(count += 1);
    // }, 6000);
});