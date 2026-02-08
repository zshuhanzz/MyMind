import ai, { CHAT_MODEL } from '../config/gemini.js';
import { messageRepository } from '../repositories/message.repository.js';
import { moodEntryRepository } from '../repositories/mood-entry.repository.js';
import { checkInRepository } from '../repositories/check-in.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { conversationRepository } from '../repositories/conversation.repository.js';
import { crisisDetectionService } from './crisis-detection.service.js';
import { buildSystemPrompt, type UserContext } from '../prompts/system-prompt.js';
import logger from '../utils/logger.js';

export const geminiService = {
  async buildUserContext(userId: string): Promise<UserContext> {
    const user = await userRepository.findById(userId);
    const latestMood = await moodEntryRepository.getLatest(userId);
    const recentMoods = await moodEntryRepository.findByUser(userId, 5);
    const streak = await checkInRepository.getStreak(userId);

    const emotions = recentMoods.flatMap((m) => m.emotion_tags);
    const uniqueEmotions = [...new Set(emotions)].slice(0, 5);

    let moodTrend: string | null = null;
    if (recentMoods.length >= 3) {
      const avg = recentMoods.reduce((s, m) => s + m.rating, 0) / recentMoods.length;
      const firstHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
      const secondHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
      const avgFirst = firstHalf.reduce((s, m) => s + m.rating, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((s, m) => s + m.rating, 0) / secondHalf.length;
      if (avgSecond - avgFirst > 1) moodTrend = 'improving recently';
      else if (avgFirst - avgSecond > 1) moodTrend = 'declining recently';
      else moodTrend = `fairly steady around ${avg.toFixed(1)}/10`;
    }

    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else if (hour >= 21 || hour < 5) timeOfDay = 'late night';

    return {
      displayName: user?.display_name || 'Friend',
      currentMood: latestMood?.rating || null,
      recentEmotions: uniqueEmotions,
      moodTrend,
      localTime: timeOfDay,
      streak,
      recentInsights: null,
    };
  },

  async sendMessage(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<{ fullResponse: string; crisisDetected: boolean; messageId: string }> {
    // Pre-screen user message for crisis keywords
    const crisisCheck = crisisDetectionService.detectInUserMessage(userMessage);

    // Save user message
    const userMsg = await messageRepository.create({
      conversationId,
      role: 'user',
      content: userMessage,
      isCrisisFlagged: crisisCheck.severity === 'high',
    });

    // If high severity crisis, respond immediately without AI
    if (crisisCheck.severity === 'high') {
      const crisisResponse = crisisDetectionService.buildImmediateCrisisResponse();
      const assistantMsg = await messageRepository.create({
        conversationId,
        role: 'assistant',
        content: crisisResponse,
        isCrisisFlagged: true,
      });
      await crisisDetectionService.logCrisisEvent(userId, userMsg.id, crisisCheck);
      await conversationRepository.updateTimestamp(conversationId);
      return { fullResponse: crisisResponse, crisisDetected: true, messageId: assistantMsg.id };
    }

    // Build context
    const history = await messageRepository.getRecent(conversationId, 20);
    const userContext = await this.buildUserContext(userId);
    const systemPrompt = buildSystemPrompt(userContext);

    // Build message history for Gemini
    const contents = history
      .filter((m) => m.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: msg.content }],
      }));

    try {
      const response = await ai.models.generateContent({
        model: CHAT_MODEL,
        systemInstruction: systemPrompt,
        contents,
        config: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024,
        },
      } as any);

      let responseText = response.text || 'I\'m here for you. Could you tell me a bit more about what\'s on your mind?';

      // Check if AI detected crisis
      const aiCrisisDetected = crisisDetectionService.detectInAiResponse(responseText);
      if (aiCrisisDetected) {
        responseText = crisisDetectionService.cleanCrisisMarker(responseText);
        await crisisDetectionService.logCrisisEvent(userId, userMsg.id, {
          detected: true,
          severity: 'medium',
          trigger: null,
          pattern: 'ai_detected',
        });
      }

      const isCrisis = aiCrisisDetected || crisisCheck.severity === 'medium';

      // Log medium severity crisis
      if (crisisCheck.severity === 'medium' && !aiCrisisDetected) {
        await crisisDetectionService.logCrisisEvent(userId, userMsg.id, crisisCheck);
      }

      // Save assistant response
      const assistantMsg = await messageRepository.create({
        conversationId,
        role: 'assistant',
        content: responseText,
        isCrisisFlagged: isCrisis,
      });

      await conversationRepository.updateTimestamp(conversationId);

      // Auto-generate title if first message pair
      const msgCount = await messageRepository.countByConversation(conversationId);
      if (msgCount <= 2) {
        const title = userMessage.length > 50
          ? userMessage.substring(0, 47) + '...'
          : userMessage;
        await conversationRepository.updateTitle(conversationId, title);
      }

      return { fullResponse: responseText, crisisDetected: isCrisis, messageId: assistantMsg.id };
    } catch (err) {
      logger.error('Gemini API error:', err);
      const fallback = "I'm having a little trouble right now, but I'm still here. Could you try sending that again?";
      const assistantMsg = await messageRepository.create({
        conversationId,
        role: 'assistant',
        content: fallback,
      });
      return { fullResponse: fallback, crisisDetected: false, messageId: assistantMsg.id };
    }
  },
};
