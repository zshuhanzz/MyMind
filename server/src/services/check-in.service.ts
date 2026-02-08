import { moodEntryRepository } from '../repositories/mood-entry.repository.js';
import { checkInRepository } from '../repositories/check-in.repository.js';

export const checkInService = {
  async complete(userId: string, data: {
    rating: number;
    emotionTags: string[];
    note?: string;
  }) {
    const moodEntry = await moodEntryRepository.create({
      userId,
      rating: data.rating,
      emotionTags: data.emotionTags,
      note: data.note,
      source: 'check_in',
    });

    const pending = await checkInRepository.findPending(userId);
    let checkIn;
    if (pending) {
      checkIn = await checkInRepository.complete(pending.id, moodEntry.id);
    } else {
      checkIn = await checkInRepository.create({
        userId,
        moodEntryId: moodEntry.id,
        status: 'completed',
      });
    }

    return { moodEntry, checkIn };
  },

  async getHistory(userId: string, limit = 30, offset = 0) {
    return checkInRepository.findByUser(userId, limit, offset);
  },

  async getPending(userId: string) {
    return checkInRepository.findPending(userId);
  },

  async getStreak(userId: string) {
    return checkInRepository.getStreak(userId);
  },
};
