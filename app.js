const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./schema/schema');

const app = express();

// Middleware global es app.use
// necesita unmanejador que especificamos
app.use('/graphql', graphqlHTTP({
//    schema determina como esta ordenada la BD
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('YAY server ! ')
});