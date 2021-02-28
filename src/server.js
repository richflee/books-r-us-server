var express = require('express');
var cors = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    dogs: [Dog]
    products: [Product]
  },
  type Dog {
    dogId: String!
    name: String
    breed: String!
    age: String!
    price: Float
  },
  type Product {
    productId: String!
    title: String
    category: String!
    price: Float
  }
`);


var retrieveProducts = function(_) {
  return [
    { productId: 'a', __typename: 'Product', title: 'Dog biscuits', category: 'ALL', price: 13  },
    { productId: 'b', __typename: 'Product', title: 'Squeaky toy', category: 'ALL', price: 2  },
    { productId: 'c', __typename: 'Product', title: 'Rag doll', category: 'ALL', price: 1  },
    { productId: 'd', __typename: 'Product', title: 'Bouncy ball', category: 'ALL', price: 0.5 },
    { productId: '3', __typename: 'Product', category: 'ALL', price: 0.25 },
  ];
}

var retrieveDogs = function(_) {
  return [
    { dogId: 'a', __typename: 'Dog', name: 'Rusty', age: '2 months', breed: 'Bulldog', price: 13  },
    { dogId: 'b', __typename: 'Dog', name: 'Charlie', age: '5 years', breed: 'Cavoodle', price: 2  },
    { dogId: 'c', __typename: 'Dog', name: 'CoCo', age: '1 year', breed: 'Greyhound', price: 1  },
    { dogId: 'd', __typename: 'Dog', name: 'Buster', age: '8 years', breed: 'German shepherd', price: 0.5 },
    { dogId: '3', __typename: 'Dog', name: null, age: '18 months', breed: 'Cocker spaniel', price: 0.25 },
  ];
}
 
// The root provides a resolver function for each API endpoint
var root = {
  dogs: retrieveDogs,
  products: retrieveProducts,
};
 
var app = express();
app.use(cors());
app.options('*', cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

