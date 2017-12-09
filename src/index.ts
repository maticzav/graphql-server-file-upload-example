import { Graphcool } from "graphcool-binding"
import { importSchema } from "graphql-import"
import { GraphQLServer } from "graphql-yoga"
import { S3 } from 'aws-sdk'
import { resolvers } from "./resolvers"
import fileAPI from './modules/fileAPI'

// Config --------------------------------------------------------------------

const typeDefs = importSchema("./src/schema.graphql")

const graphcool = new Graphcool({
  schemaPath: "schemas/database.graphql",
  endpoint: process.env.GRAPHCOOL_ENDPOINT,
  secret: process.env.GRAPHCOOL_APIKEY,
})

const s3 = new S3({
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  params: {
    Bucket: process.env.S3_BUCKET
  }
});


// Server --------------------------------------------------------------------

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    db: graphcool,
  }),
  options: { port: 5000 },
})

// Middleware ----------------------------------------------------------------

server.express.post('/upload', fileAPI({graphcool, s3}))

// Start ---------------------------------------------------------------------

server.start(() => console.log(`Server is running on http://localhost:5000`))

// ---------------------------------------------------------------------------
