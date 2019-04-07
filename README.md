# Scry Bot for Telegram

This app is designed to enable users to pull information about Magic the Gathering cards from Scryfall and other sources from withing Telegram. This is often faster and easier than opening the website on your phone.

Entering /scry command followed by a card name will make it retrieve the card's image along with its price in euros as well as a list of formats in which this card is legal. 

You can also follow the name of the card with **'&set='** and a three letter code of a set to see the card's print from a specific set.

The bot uses Scryfall's fuzzy search, so entering **'/scry shrap blast &set=MRD'** will fetch the image of [Shrapnel Blast](https://scryfall.com/card/mrd/106/shrapnel-blast) from Mirrodin.

Please note that the price returned is print-dependent and is intended as a very basic reference, i.e. it vary substantially from seller to seller.

The app is implemented in pure Node.js. Further improvements and functionality should be available in the coming weeks.
