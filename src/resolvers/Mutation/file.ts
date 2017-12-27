import { v4 as uuid } from 'uuid'

import { Context } from '../../utils'

// Resolvers -----------------------------------------------------------------

export const file = {
  renameFile: async (parent, {id, name}, ctx: Context, info) => {
    return ctx.db.mutation.updateFile({ data: { name }, where: { id } }, info)
  },
  deleteFile: async (parent, { id }, ctx: Context, info) => {
    try {
      return await ctx.db.mutation.deleteFile({ where: { id } }, info)
    } catch(err) {
      console.log(err)
      return null
    }
  }
}

// ---------------------------------------------------------------------------
