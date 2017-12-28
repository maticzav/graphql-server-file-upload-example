import { v4 as uuid } from 'uuid'

const mime = require('mime-types')
const multiparty = require('multiparty')

export default ({graphcool, s3}) => (req, res) => {
  try {
    let form = new multiparty.Form()
    let count = 0
    let files = []
    let finished = false


    form.on('part', async function(part) {
      count ++

      const name = part.name || part.filename
      const secret = uuid()
      const size = part.byteCount
      const contentType = mime.lookup(part.filename)

      // Upload to S3
      const response = await s3.upload({
        Key: secret,
        ACL: 'public-read',
        Body: part,
        ContentLength: size,
        ContentType: contentType
      }).promise()

      const url = response.Location

      // Sync with Graphcool
      const data = {
        name,
        size,
        secret,
        contentType,
        url
      }

      const { id }: { id: string } = await graphcool.mutation.createFile({ data }, ` { id } `)

      // Wait for all files to be uploaded
      const file = {
        id,
        name,
        secret,
        contentType,
        size,
        url
      }

      files.push(file)

      if (finished && count === files.length) {
        res.json(files)
      }
    })

    form.on('close', () => {
      finished = true
    })

    form.on('error', err => {
      throw err
    })

    form.parse(req)

  } catch(err) {
    console.log(err)
    res.sendStatus(500)
  }
}
