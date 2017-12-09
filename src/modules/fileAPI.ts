import { v4 as uuid } from 'uuid'

const mime = require('mime-types')
const multiparty = require('multiparty')

export default ({graphcool, s3}) => (req, res, next) => {
  try {
    let form = new multiparty.Form()

    form.on('part', async function(part) {
      if (part.name !== 'data') {
        return
      }

      const name = part.filename
      const secret = uuid()
      const size = part.byteCount
      const contentType = mime.lookup(name)

      const response = await s3.upload({
        Key: secret,
        ACL: 'public-read',
        Body: part,
        ContentLength: size,
        ContentType: contentType
      }).promise()

      const url = response.Location

      const { id }: { id: string } = await graphcool.mutation.createPicture({name, size, contentType, url, secret}, `{ id }`)

      return res.json({
        id,
        name,
        secret,
        contentType,
        size,
        url
      })
    })

    form.on('error', () => {
      Promise.reject('Something went wrong.')
    })

    form.parse(req)

  } catch (err) {
    throw err
  }
}
