const graphql = require('graphql');
const { GraphQLObjectType, 
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLList,
        GraphQLInt } = graphql;
const _ = require('lodash');
// Dummy Data
let books = [
    {name: 'Name of the wind', genre: 'Fantasy', id:'1', authorId: '1'},
    {name: 'TFINAL eMPIRE', genre: 'Fantasy', id:'2', authorId: '2'},
    {name: 'The long earth', genre: 'Sci Fi', id:'3', authorId: '3'},
    {name: 'hero ages', genre: 'Fantasy', id:'4', authorId: '2'},
    {name: 'super magieeex', genre: 'Fantasy', id:'5', authorId: '3'},
    {name: 'light fantstix', genre: 'Sci Fi', id:'6', authorId: '3'}
];

let authors = [
    {name: 'Patrik', age: 44, id:'1'},
    {name: 'Brandon', age: 40, id:'2'},
    {name: 'Terry', age: 45, id:'3'}
];
// ================================================

// Schema for BOOKS
const BookType = new GraphQLObjectType({
    name: 'Book',
    // Se almacena el contenido en una funcion porque así no ejecuta sino hasta que se piden los valores
    fields: () => ({ 
        id: { type: GraphQLID },
        name: { type: GraphQLString},
        genre: { type: GraphQLString},
        // Relacionando tablas
        author: { 
            type: AuthorType,
            resolve(parent, args){
                // Busca el Type y asocia el valor queremos relacionar del type con el del query {id: parent.authorId}
                console.log(parent);
                return _.find(authors, {id: parent.authorId});
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
        // After many to many relationship with LIST:)
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, {authorId: parent.id})
            }
        }
    })
});

// Punto de partida de los queries a los datos
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // nAME OF THE FIELD AND THE TYPE THAT WILL BE USED TO RETRIEVE DATA
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
               // code to get data from DB/SOURCE
            //    find specifies the argument it will take from front to make the query
               return _.find(books, {id: args.id})
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(authors, {id: args.id})
            }
        },

        // Return the list of books
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books
            }
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return authors
            }
        }
    }
});

// Whats gonna be used on frontEND
module.exports = new GraphQLSchema({
    query: RootQuery
});



// graphql queries
// Nested Types 
// {
  
//     book(id: 2){
//       name
//       genre
//       author{
//         name
//       }
//     }
//   }

// After GraphQLList 
// {
  
//     author(id: 2){
//       name
//           books{
//         name
//       }
//     }
//   }

// get a list of elments
// {
// 	books{
//       name
//       genre
//     	author{
//         name
//       }
//   }
// }