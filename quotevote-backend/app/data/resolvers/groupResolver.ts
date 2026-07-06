import Group from '../models/Group';
import type * as Common from '~/types/common';

export const groupResolver = {
  Query: {
    group: async (
      _parent: unknown,
      args: { groupId: string }
    ): Promise<Common.Group | null> => {
      const group = await Group.findById(args.groupId).lean();
      if (!group) return null;
      return {
        ...group,
        _id: group._id.toString(),
        creatorId: group.creatorId.toString(),
        adminIds: group.adminIds?.map((id) => id.toString()) || [],
        allowedUserIds: group.allowedUserIds?.map((id) => id.toString()) || [],
      } as unknown as Common.Group;
    },
    groups: async (
      _parent: unknown,
      args: { limit: number }
    ): Promise<Common.Group[]> => {
      const groups = await Group.find({}).limit(args.limit).lean();
      return groups.map((g) => ({
        ...g,
        _id: g._id.toString(),
        creatorId: g.creatorId.toString(),
        adminIds: g.adminIds?.map((id) => id.toString()) || [],
        allowedUserIds: g.allowedUserIds?.map((id) => id.toString()) || [],
      })) as unknown as Common.Group[];
    },
  },
};
