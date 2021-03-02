const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');
const { v4: uuidv4 } = require('uuid');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull, GraphQLBoolean, GraphQLFloat
} = graphql;

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    bookId: { type: GraphQLString  },
    title: { type: GraphQLString }, 
    genre: { type: GraphQLString }, 
    pages: { type: GraphQLInt }, 
    price: { type: GraphQLFloat }, 
    isFavourite: { type: GraphQLBoolean }, 
    author: {
      type: AuthorType,
      resolve(parent, args) {
          return Author.findById(parent.authorID);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent,args){
          return Book.find({ authorID: parent.id });
      }
    }
  })
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular 
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      //argument passed by the user while making the query
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
          //Here we define how to get data from database source

          //this will return the book with id passed in argument 
          //by the user
          return Book.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
          return Book.find({});
      }
    },
    favouriteBooks: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ isFavourite: true });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
          return Author.findById(args.id);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
          return Author.find({});
      }
    }
  }
});

//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
          //GraphQLNonNull make these field required
          name: { type: new GraphQLNonNull(GraphQLString) },
          age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
          let author = new Author({
              name: args.name,
              age: args.age
          });
          return author.save();
      }
    },
    addBook:{
      type: BookType,
      args:{
          title: { type: new GraphQLNonNull(GraphQLString)},
          pages: { type: new GraphQLNonNull(GraphQLInt)},
          authorID: { type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,args){
          let book = new Book({
              bookId: uuidv4(),
              title:args.title,
              pages:args.pages,
              isFavourite:false,
              authorID:args.authorID
          })
          return book.save()
      }
    },
    toggleFavourite:{
      type: BookType,
      args:{
          bookId: { type: new GraphQLNonNull(GraphQLString)}
      },
      async resolve(parent,args){
          const query = { bookId: args.bookId };
          let book = await Book.findOne(query);
          await Book.updateOne(query, {$set: {isFavourite: !book.isFavourite}});
          return Book.findOne(query);
      }
    }
  }
});

// Creating a new GraphQL Schema, with options query which defines query 
// we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});