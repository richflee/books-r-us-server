var express = require('express');
var cors = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    dogs: [Dog]
    products: [Product]
    books: [Book]
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
  },
  type Book {
    bookId: String!
    title: String
    genre: String!
    price: Float
    author: Author
  },
  type Author {
    authorId: String!
    name: String!
    age: Float!
  }
`);


var retrieveBooks = function(_) {
  return [
    {
      bookId: 'a', __typename: 'Book', title: 'To Kill A Mockingbird',
      genre: 'ALL',
      price: 13,
      author: {
        authorId: 'abc1',
        name: 'Harper Lee',
        age: 87,
      },
    },
    {
      bookId: 'b', __typename: 'Book', title: 'Harry Potter & The Prisoner of Azkabaan',
      genre: 'ALL',
      price: 2,
      author: {
        authorId: 'abc2',
        name: 'J.K Rowling',
        age: 87,
      },
    },
    {
      bookId: 'c',
      __typename: 'Book',
      title: 'Lord Of The Rings',
      genre: 'ALL',
      price: 1,
      author: {
        authorId: 'abc3',
        name: 'J.R.R Tolkien',
        age: 77,
      },
    },
    {
      bookId: 'd',
      __typename: 'Book',
      title: 'Fight Club',
      genre: 'ALL',
      price: 0.5,
      author: {
        authorId: 'abc4',
        name: 'Chuck Palahniuk',
        age: 59,
      },
    },
    {
      bookId: '3',
      __typename: 'Book',
      genre: 'ALL',
      title: 'A Game Of Thrones',
      price: 0.25,
      author: {
        authorId: 'abc5',
        name: 'George R.R. Martin',
        age: 65,
      },
    },
  ];
}

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
  books: retrieveBooks,
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

