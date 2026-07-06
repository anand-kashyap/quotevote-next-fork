import Quote from '../models/Quote';
import type * as Common from '~/types/common';

export const quoteResolver = {
  Query: {
    latestQuotes: async (
      _parent: unknown,
      args: { limit: number }
    ): Promise<Common.Quote[]> => {
      const quotes = await Quote.find({}).sort({ created: -1 }).limit(args.limit).lean();
      return quotes.map((q) => ({
        ...q,
        _id: q._id.toString(),
        userId: q.userId.toString(),
        postId: q.postId.toString(),
      })) as unknown as Common.Quote[];
    },
  },
};
