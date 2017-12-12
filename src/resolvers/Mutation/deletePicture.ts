import { Context } from '../../utils'

export const deletePicture = async (parent, {id}, context: Context, info) => {
  try {
    const res = await context.db.mutation.deletePicture({ id })
    return { success: true }
  } catch(err) {
    console.log(err)
    return { success: false }
  }
}
