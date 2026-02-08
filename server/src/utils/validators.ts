import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password should be at least 8 characters'),
  displayName: z.string().min(1, 'Please enter a name').max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const checkInSchema = z.object({
  rating: z.number().int().min(1).max(10),
  emotionTags: z.array(z.string()).default([]),
  note: z.string().max(2000).optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const journalSchema = z.object({
  title: z.string().max(300).optional(),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  moodEntryId: z.string().uuid().optional(),
});

export const scheduleSchema = z.object({
  frequency: z.enum(['daily', 'twice_daily', 'weekly', 'custom']),
  preferredTimes: z.array(z.string()).default(['09:00']),
  daysOfWeek: z.array(z.number().int().min(1).max(7)).default([1, 2, 3, 4, 5, 6, 7]),
  notifyEmail: z.boolean().default(false),
  notifyPush: z.boolean().default(true),
});
