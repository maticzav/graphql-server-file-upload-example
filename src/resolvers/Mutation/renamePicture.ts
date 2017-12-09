import { Context } from '../../utils'

export const renamePicture = (parent, {id, name}, ctx: Context, info) => {
  return ctx.db.mutation.updatePicture({ id, name }, info)
}
