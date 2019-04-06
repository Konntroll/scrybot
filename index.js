require('dotenv').config();
const TOKEN = process.env.TOKEN;
const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = process.env.BOT_URL;
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);


// Test run.
bot.on('message', (msg) => {
  
    if (msg.text.toLowerCase().indexOf('/scry') != 0) return null;
    else msg.text = msg.text.slice(5);
  
    https.get(process.env.SCRY_URL + msg.text, (resp) => {
    data = '';
    resp.on('data', (chunk) => {
        data += chunk;
      });
    resp.on('end', () => {
        //unpacking received JSON data into an object we can access and use
        const card = JSON.parse(data);
        
        //the following prevents the bot from crashing if nothing is found
        //and prompts the user to check their input
        if (!card.name) {
          bot.sendMessage(msg.chat.id, 'Focus, child. What is it you seek?');
          return null;
        }
  
        //this displays the price of the card if it's not null
        if (card.prices.eur) {
          var info = 'This one costs ' + card.prices.eur + ' monies.';
        }
  
        //the following sometimes adds a playful message to the output
        //depending on the price of the requested card;
        //if the card price is null, this outputs a corresponding message instead
        if (card.prices.eur == null) {
          var info = 'This is an odd print so no pricing info is available.';
        } else if (card.prices.eur > 20) {
          if (Math.floor(Math.random() * 4) == 3) {
            info += '\nYou know, were it made of pure gold, it\'d cost less.';
          }
        } else if (card.prices.eur > 5) {
          if (Math.floor(Math.random() * 6) == 5) {
            info += '\nAh, again it doesn\'t bode well for your wallet.';
          }
        } else if (card.prices.eur < 0.5) {
          if (Math.floor(Math.random() * 8) == 7) {
            info += '\nIf only fetch lands were this cheap...';
          }
        } else if (card.prices.eur < 1) {
          if (Math.floor(Math.random() * 8) == 7) {
            info += '\nThese will add up to a lot in no time flat.';
          }
        }
  
        //this checks for formats where the card is legal or restricted
        //and builds a string of text to be appended to the output
        //if the card is legal or restricted in any format
        var legalities = '\nLegal in:';
        var isLegal = false;
        for (var format in card.legalities) 
        {
          if (card.legalities[format] == 'legal') {
            var formatName = format[0].toUpperCase() + format.slice(1);
            legalities += '\n - ' + formatName;
            isLegal = true;
          } else if (card.legalities[format] == 'restricted') {
            var formatName = format[0].toUpperCase() + format.slice(1) + ' (restricted)';
            legalities += '\n - ' + formatName;
            isLegal = true;
          }
        }
        
        //add the list of legalities to output
        //or, if the card is not legal in any format,
        //provide a corresponding message
        if (isLegal == true) info += legalities; else info += '\nThis card is not legal in any format';
        
        //return the card image and info to chat
        bot.sendPhoto(msg.chat.id, card.image_uris.large, {caption: info});
      });
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
    }); 
  });