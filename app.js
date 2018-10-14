const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const businesh = require('businesh');
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();
const client = new line.Client(config);

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/webhook', line.middleware(config), (req, res) => {
    const events = req.body.events;
    events.map(event => handle_event(event));
    res.send('Success');
});

const handle_event = event => {
    if (event.type !== 'message' || event.message.type !== 'text') return;
    businesh.translate(event.message.text)
        .then(after_text => client.replyMessage(event.replyToken, { type: 'text', text: after_text }))
        .catch(err => console.log(err));
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Node app is running at localhost: ${port}`));
