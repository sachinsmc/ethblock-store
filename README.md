# ethblock-store
This repository contains code related to Ethereum blockchain blocks detail store implementation.

## Steps 

### Clone Repository 

`$ git clone git@github.com:sachinsmc/ethblock-store.git`

### Install dependencies.

`$ cd  ethblock-store`

`$ npm i`

### Create environment  variable file
    
`$ cp .example.env .env`
    
    update env values 

### Start application

`$  npm start`
or
`$ node --max-old-space-size=7096 ./bin/www`

    This will store latest 10k blocks transactions in Mongo DB

### Test API endpoint : get transactions by a user



Method : GET

ENDPOINT AND HOST : `localhost:3002/transactions/0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD`

Check using CURL if it works

`$ curl -X GET \
  http://localhost:3002/transactions/0x00cFBbaF7DDB3a1476767101c12a0162e241fbAD`

  This returns all the transactions done by user

