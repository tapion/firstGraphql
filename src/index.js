const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { ApolloServer, PubSub } = require("apollo-server");
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const Vote = require('./resolvers/Votes');
const Subscription = require('./resolvers/Subscription');

const prisma = new PrismaClient();
const pubSub = new PubSub();

let links = [
  {
    id: "link-0",
    description: "Description`s link",
    url: "www.url.com",
    hola: "amigosss",
  },
  {
    id: "link-1",
    description: "New description`s link",
    url: "www.url2123123.com",
    hola: "amigo",
  },
];

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
}
// const resolvers = {
//   Query: {
//     info: () => "Esto es un texto que no puede ser nulo",
//     feed: async (parent, args, context) => {
//       return context.prisma.link.findMany();
//     },
//     link: (parent, args) => links.find((link) => link.id == args.id),
//   },
//   //   Link: {
//   //     id: (parent) => parent.id,
//   //     description: (parent) => parent.description,
//   //     url: (parent) => parent.url,
//   //   }
//   Mutation: {
//     post: async (parent, args, context) => {
//       const newLink = await context.prisma.link.create({
//         data: {
//           description: args.description,
//           url: args.url,
//         },
//       });
//       //   const id = links.length;
//       //   const link = {
//       //     id: `link-${id}`,
//       //     description:
//       //     url: ,
//       //   };
//       //   links.push(link);
//       return newLink;
//     },
//     updateLink: (parent, args) => {
//       const linkIndex = links.findIndex((link) => link.id === args.id);
//       if (linkIndex >= 0) {
//         console.log("lo encontro");
//         links[linkIndex] = {
//           ...links[linkIndex],
//           description: args.description,
//           url: args.url,
//         };
//         return links[linkIndex];
//       }
//     },
//     deleteLink: (parent, args) => {
//       const linkIndex = links.findIndex((link) => link.id === args.id);
//       if (linkIndex >= 0) {
//         const link = links[linkIndex];
//         links = links.filter((link) => link.id !== args.id);
//         return link;
//       }
//     },
//   },
// };

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubSub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
