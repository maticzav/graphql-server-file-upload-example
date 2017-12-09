import { Graphcool } from "graphcool-binding"
import { importSchema } from "graphql-import"
import { GraphQLServer } from "graphql-yoga"
import { S3 } from 'aws-sdk'
import { v5 as uuid } from 'uuid'
import { resolvers } from "./resolvers"

const multiparty = require('multiparty')

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

server.express.post('/upload', (req, res, next) => {
  try {
    let form = new multiparty.Form()

    form.on('part', async function(part) {
      const name = part.filename
      const secret = uuid()
      const size = part.byteCount
      const contentType = part.headers['content-type']

      const res = await s3.upload({
        Bucket: process.env.S3_BUCKET,
        Key: secret,
        ACL: 'public-read',
        Body: part,
        ContentLength: part.byteCount,
      }).promise()

      const url = res.Location

      const file: { id: string } = await graphcool.mutation.createPicture({name, size, contentType, url, secret}, `{ id }`)

      part.resume()
    })

    form.on('error', () => {
      Promise.reject('Something went wrong.')
    })

    form.on('close', () => {
      return res.sendStatus(200)
    })

    form.parse(req)

  } catch (err) {
    throw err
  }
})

// Start ---------------------------------------------------------------------

server.start(() => console.log(`Server is running on http://localhost:5000`))

// ---------------------------------------------------------------------------
