import {renamePicture} from './Mutation/renamePicture'
import {deletePicture} from './Mutation/deletePicture'

export const resolvers = {
  Query: {
    allPictures: async (parent, args, context, info) => {
      return context.db.query.allPictures(args, info)
    },
    picture: async (parent, {id}, context, info) => {
      return context.db.query.Picture({id}, info)
    },
  },
  Mutation: {
    renamePicture,
    deletePicture
  }
}
