import { Graphcool } from "graphcool-binding"
import { importSchema } from "graphql-import"
import { GraphQLServer } from "graphql-yoga"
import { S3 } from 'aws-sdk'
import { resolvers } from "./resolvers"
import fileAPI from './modules/fileAPI'

// Config --------------------------------------------------------------------

const APP_SCHEMA_PATH = './src/schemas/app.graphql'
const DATABASE_SCHEMA_PATH = './src/schemas/database.graphql'

const typeDefs = importSchema(APP_SCHEMA_PATH)


// Server --------------------------------------------------------------------

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    db: new Graphcool({
      schemaPath: DATABASE_SCHEMA_PATH,
      endpoint: process.env.GRAPHCOOL_ENDPOINT,
      secret: process.env.GRAPHCOOL_APIKEY,
    }),
  }),
  options: { port: 5000 },
})

// Middleware ----------------------------------------------------------------

server.express.post('/upload', fileAPI({
  graphcool: new Graphcool({
    schemaPath: DATABASE_SCHEMA_PATH,
    endpoint: process.env.GRAPHCOOL_ENDPOINT,
    secret: process.env.GRAPHCOOL_APIKEY,
  }),
  s3: new S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    params: {
      Bucket: process.env.S3_BUCKET
    }
  })
}))

// Start ---------------------------------------------------------------------

server.start(() => console.log(`Server is running on http://localhost:5000`))

// ---------------------------------------------------------------------------
