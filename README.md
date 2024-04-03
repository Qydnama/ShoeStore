# Shoe Store Website using Node.js and MongoDB

## Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the server with `npm start`.
4. Access the website at [http://localhost:3000](http://localhost:3000).

## Overview

This is a Shoe Store website developed using Node.js and MongoDB. The application allows users to add products to cart and buy them. The project includes server-side logic for Currency API's, Cat API's. It has profile page where user can change his information and admin panel for managing users and products. 


## API Services

API services that were used:

- **currencyapi:** For giving current currency.
- **thecatapi:** For cat photos.
- **catfact.ninja:** For facts about cats.

## File Structure

The project has the following folder structure:
- **config:** Stores config information.
- **middleware:** Has a middlewares that checks language, errors, etc.
- **models :** Here stores models of MongoDB schemas.
- **public:** Contains static files (CSS, images, etc.).
- **routers:** Routes for sertain endpoints. 
- **views:** HTML templates for rendering pages.


## Express Server (app.js)

Express.js is used for handling the server, running on port 3000 (`const port = 3000;`).

## Integration of NPM Packages

Ten npm packages related to the project topic are integrated into the root JavaScript file: 
- **axios**
- **bcryptjs**
- **dotenv**
- **ejs**
- **express**
- **express-session**
- **fs**
- **mongoose**
- **morgan**
- **path**




