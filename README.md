**Setup application**

`npm install`

**Run application**
 
 note: node version should be 7
 
`npm start`

**Run Tests**

`npm test`
 or see here:
 https://travis-ci.org/ernium/node-tiny-forum

## How to use

1. POST /message/create to create new message
2. POST /message/update/:id to update message
3. GET /message/:id to fetch message body
4. GET /message/list to fetch all messages as id -> header
5. DELETE /message/:id to delete message

## Demo
    https://node-tiny-forum.herokuapp.com/message/list
