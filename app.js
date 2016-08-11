"use strict";
 
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();
const request = require('request');


var port = process.env.PORT || 8080; // set our port


// Run server to listen on port assigned by Heroku.
const server = app.listen(port, () => {
  console.log('listening on *:' + port);
  console.log('Tokenb is :' + process.env.TOKEN);
  console.log('URL is' + process.env.URL +'/rest/servicedeskapi/request');
});


app.use(bodyParser.urlencoded({ extended: false } ));
 
// Set Express routes.
app.post('/events', (req, res) => {
  let to = req.body.To;
  let fromNumber = req.body.From;
  let callStatus = req.body.CallStatus;
  let callSid = req.body.CallSid;
 
 

	var options = { method: 'POST',
		  url: process.env.URL,
		  headers: 
		   { authorization: 'Basic'+ process.env.TOKEN },
		  body: 
		   { serviceDeskId: '1',
			 requestTypeId: '1',
			 requestFieldValues: 
			  { summary: 'Inbound Phone request from ' + fromNumber,
				description: 'A request has been received via phone' } },
		  json: true };

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);
		console.log(body);

		});



console.log(to, fromNumber, callStatus, callSid);
  res.send('Event received');
});


app.post('/voice', (req, res) => {
  // Generate a TwiML response
  let twiml = new twilio.TwimlResponse();
  // Talk in a robot voice over the phone.
  twiml.say('Call progress events are rad');
  // Set the response type as XML.
  res.header('Content-Type', 'text/xml');
  // Send the TwiML as the response.
  res.send(twiml.toString());
});
