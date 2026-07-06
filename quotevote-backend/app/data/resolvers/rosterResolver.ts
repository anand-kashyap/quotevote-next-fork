import Roster from '../models/Roster';
import User from '../models/User';
import Presence from '../models/Presence';
import type * as Common from '~/types/common';

export const rosterResolver = {
  Query: {
    getBuddyList: async (
      _parent: unknown,
      _args: unknown,
      context: { userId?: string }
    ): Promise<{ user: Common.User; presence: Common.Presence | null; roster: Common.Roster }[]> => {
      if (!context.userId) return [];
      const entries = await Roster.find({
        $or: [{ userId: context.userId }, { buddyId: context.userId }],
        status: 'accepted',
      }).lean();

      const results = [];
      for (const entry of entries) {
        const buddyId = entry.userId.toString() === context.userId
          ? entry.buddyId.toString()
          : entry.userId.toString();
        
        const user = await User.findById(buddyId).lean();
        if (!user) continue;

        const presence = await Presence.findOne({ userId: buddyId }).lean();

        results.push({
          user: {
            ...user,
            _id: user._id.toString(),
          },
          presence: presence ? {
            ...presence,
            _id: presence._id.toString(),
            userId: presence.userId.toString(),
          } : null,
          roster: {
            ...entry,
            _id: entry._id.toString(),
            userId: entry.userId.toString(),
            buddyId: entry.buddyId.toString(),
            initiatedBy: entry.initiatedBy.toString(),
          },
        });
      }
      return results as unknown as { user: Common.User; presence: Common.Presence | null; roster: Common.Roster }[];
    },

    getRoster: async (
      _parent: unknown,
      _args: unknown,
      context: { userId?: string }
    ): Promise<(Common.Roster & { buddy: Common.User })[]> => {
      if (!context.userId) return [];
      const entries = await Roster.find({
        $or: [{ userId: context.userId }, { buddyId: context.userId }],
      }).lean();

      const results = [];
      for (const entry of entries) {
        const buddyId = entry.userId.toString() === context.userId
          ? entry.buddyId.toString()
          : entry.userId.toString();

        const buddy = await User.findById(buddyId).lean();
        if (!buddy) continue;

        results.push({
          ...entry,
          _id: entry._id.toString(),
          userId: entry.userId.toString(),
          buddyId: entry.buddyId.toString(),
          initiatedBy: entry.initiatedBy.toString(),
          buddy: {
            ...buddy,
            _id: buddy._id.toString(),
          },
        });
      }
      return results as unknown as (Common.Roster & { buddy: Common.User })[];
    },
  },
};
