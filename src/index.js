const env = require('dotenv').config()

const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
    link: (root, args, context, info) => {
      const queriedLinks = context.db.query.links
      return queriedLinks.find(link => link.id === args.id)
    }
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description
          }
        },
        info
      )
    },
    update: (root, args, context, info) => {
      return context.db.mutation.updateLink(
        {
          data: {
            url: args.url,
            description: args.description
          },
          where: {
            id: args.id
          }
        },
        info
      )
    },
    delete: (root, args, context, info) => {
      return context.db.mutation.deleteLink(
        {
          where: {
            id: args.id
          }
        },
        info
      )
    }
  }
}
const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: true
})

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db
  })
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
