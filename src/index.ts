import { GraphQLServer } from "graphql-yoga"
import { importSchema } from "graphql-import"
import { S3 } from 'aws-sdk'
import { Prisma } from "./generated/prisma"
import { resolvers } from "./resolvers"
import { files } from './files'

// Config --------------------------------------------------------------------

const APP_SCHEMA_PATH = './src/schema.graphql'

const typeDefs = importSchema(APP_SCHEMA_PATH)

const s3client = new S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  params: {
    Bucket: process.env.S3_BUCKET
  }
})


// Server --------------------------------------------------------------------

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
    }),
  }),
})

// Middleware ----------------------------------------------------------------

server.express.post('/upload', files({
  s3: s3client,
  graphcool: new Prisma({
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
  }),
}))

// Start ---------------------------------------------------------------------

server.start({ port: 5000 }, () => {
  console.log(`Server is running on http://localhost:5000`)
})

// ---------------------------------------------------------------------------
