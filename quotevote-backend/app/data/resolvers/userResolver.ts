import User from '../models/User';
import type * as Common from '~/types/common';

export const userResolver = {
  Query: {
    searchUser: async (
      _parent: unknown,
      args: { queryName: string }
    ): Promise<Common.User[]> => {
      const queryName = args.queryName?.trim();
      if (!queryName) {
        return [];
      }

      // Case-insensitive regex search on name and username
      const regex = new RegExp(queryName, 'i');
      const users = await User.find({
        $or: [{ name: regex }, { username: regex }],
        accountStatus: 'active',
      })
        .limit(10)
        .lean();

      return users.map((user) => ({
        ...user,
        _id: user._id.toString(),
      })) as unknown as Common.User[];
    },
  },
};
