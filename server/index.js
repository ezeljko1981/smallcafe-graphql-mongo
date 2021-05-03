const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// allow cross-origin requests
app.use(cors());

// connect to mlab database
mongoose.connect('mongodb+srv://yoda:Joda!!99@cluster0.lnorx.mongodb.net/scdb?retryWrites=true&w=majority',
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
)
mongoose.connection.once('open', () => {
    console.log('connected to database scdb');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
