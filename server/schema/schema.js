const graphql = require('graphql');
const Employee = require('../models/employee');
const Article = require('../models/article');
const Guestorder = require('../models/guestorder');
const Articleinorder = require('../models/articleinorder');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// Types
const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    })
});

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: { type: GraphQLInt},
        name: { type: GraphQLString },
        price: { type: GraphQLFloat },
        active: { type: GraphQLBoolean }
    })
});

const GuestorderType = new GraphQLObjectType({
    name: 'Guestorder',
    fields: () => ({
        id: { type: GraphQLString },
        id_table: { type: GraphQLInt},
        ordertime: {type: GraphQLFloat},
        price: { type: GraphQLFloat},
        status: { type: GraphQLString },
        archieved:  { type: GraphQLBoolean}
    })
});

const ArticleinorderType = new GraphQLObjectType({
    name: 'Articleinorder',
    fields: () => ({
      id_article: { type: GraphQLInt },
      id_order: { type: GraphQLString },
      price_article: { type: GraphQLFloat},
      price_total: { type: GraphQLFloat},
      quantity: { type: GraphQLInt},
      name: { type: GraphQLString }
    })
});

// RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        employees: {// only via graphql
            type: new GraphQLList(EmployeeType),
            resolve(parent, args){
                return Employee.find({});
            }
        },
        getEmployee: {
            type: new GraphQLList(EmployeeType),
            args: { email: { type: GraphQLString }, password: {type: GraphQLString} },
            resolve(parent, args){
                return Employee.find({email : args.email, password: args.password});
            }
        },
        getArticles: {
            type: new GraphQLList(ArticleType),
            resolve(parent, args){
                return Article.find({});
            }
        },
        article: {// only via graphql
            type: ArticleType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Article.findById(args.id);
            }
        },
        getGuestorders: {
            type: new GraphQLList(GuestorderType),
            resolve(parent, args){
                return Guestorder.find({});
            }
        },
        getGuestordersOnTable:{
            type: new GraphQLList(GuestorderType),
            args: { id_table: { type: GraphQLInt } },
            resolve(parent, args){
                return Guestorder.find({ id_table: args.id_table });
            }
        },
        guestorder: {// only via graphql
            type: GuestorderType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Guestorder.findById(args.id);
            }
        },
        articlesinorder: {// only via graphql
            type: new GraphQLList(ArticleinorderType),
            args: { id_order: { type: GraphQLString } },
            resolve(parent, args){
              return Articleinorder.find({ id_order: args.id_order });
            }
        },
        getArticlesinorders: {
          type: new GraphQLList(ArticleinorderType),
          resolve(parent, args){
            return Articleinorder.find({});
          }
        }

    }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        addEmployee: { // only via graphql
            type: EmployeeType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let employee = new Employee({
                    email: args.email,
                    password: args.password
                });
                return employee.save();
            }
        },

        addArticle: { // only via graphql
            type: ArticleType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                active: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parent, args){
                let article = new Article({
                    id: args.id,
                    name: args.name,
                    price: args.price,
                    active: args.active
                });
                return article.save();
            }
        },

        createGuestOrder:{
                  type: GuestorderType,
                  args: {
                    id: { type: new GraphQLNonNull(GraphQLString) },
                    id_table: { type: new GraphQLNonNull(GraphQLInt) },
                    price: { type: new GraphQLNonNull(GraphQLFloat) },
                  },
                  resolve(parent, args){
                      let guestorder = new Guestorder({
                          id: args.id,
                          id_table: args.id_table,
                          ordertime: Date.now(),
                          price: args.price,
                          status: "ordered",
                          archieved: false
                      });
                      return guestorder.save();
                  }
          },

          createArticleInOrder:{
            type: ArticleinorderType,
            args: {
              id_article: { type: new GraphQLNonNull(GraphQLInt) },
              id_order: { type: new GraphQLNonNull(GraphQLString) },
              price_article: { type: new GraphQLNonNull(GraphQLFloat) },
              price_total: { type: new GraphQLNonNull(GraphQLFloat) },
              quantity: { type: new GraphQLNonNull(GraphQLInt) },
              name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
              let addarticleinorder = new Articleinorder({
                id_article: args.id_article,
                id_order: args.id_order,
                price_article: args.price_article,
                price_total: args.price_total,
                quantity: args.quantity,
                name: args.name
              });
              return addarticleinorder.save();
            }
          },

          updateGuestOrderStatus: {
            type: GuestorderType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLString) },
              status: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
              Guestorder.findOneAndUpdate({id:args.id}, {$set:{status:args.status}}, {new: true}, (err, doc) => {
                  if (err) {
                      console.log("Something wrong when updating status!");
                  }
                  console.log(doc);
                  return doc;
              });

            }
          },

          updateGuestOrderArchieved: {
            type: GuestorderType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLString) },
              archieved: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve(parent, args){
              Guestorder.findOneAndUpdate({id:args.id}, {$set:{archieved:args.archieved}}, {new: true}, (err, doc) => {
                  if (err) {
                      console.log("Something wrong when updating archieved!");
                  }
                  console.log(doc);
                  return doc;
              });
            }
          },

          deleteGuestOrderArchieved: {
            type: GuestorderType,
            args: {
              id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
              //delete selected order
              try {
                let result = Guestorder.deleteOne( { "id" : args.id } );
                return result;
              } catch (e) {print (e);}
              return null;
            }
          },

          deleteArticleInOrderArchieved: {
            type: ArticleinorderType,
            args: {
              id_order: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                try{
                  const result = Articleinorder.deleteMany({ "id_order" : args.id_order });
                  return result;
                } catch (e) {print (e);}
                return result;
            }
          }

    }//fields
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
