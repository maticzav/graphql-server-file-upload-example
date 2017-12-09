import { Context } from '../../utils'

export const deletePicture = (parent, {id}, context: Context, info) => {
  return context.db.mutation.deletePicture({id}, info)
}
