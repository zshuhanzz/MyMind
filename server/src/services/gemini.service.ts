import ai, { CHAT_MODEL } from '../config/gemini.js';
import { messageRepository } from '../repositories/message.repository.js';
import { moodEntryRepository } from '../repositories/mood-entry.repository.js';
import { checkInRepository } from '../repositories/check-in.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { conversationRepository } from '../repositories/conversation.repository.js';
import { crisisDetectionService } from './crisis-detection.service.js';
import { buildSystemPrompt } from '../prompts/system-prompt.js';
import logger from '../utils/logger.js';

export const geminiService = {
  // get info about the user so luna knows whats going on
  async buildUserContext(userId: string): Promise<any> {
    const user = await userRepository.findById(userId);
    const latestMood = await moodEntryRepository.getLatest(userId);
    const recentMoods = await moodEntryRepository.findByUser(userId, 5);
    const streak = await checkInRepository.getStreak(userId);

    // get unique emotions from recent moods
    let uniqueEmotions: string[] = [];
    for (let i = 0; i < recentMoods.length; i++) {
      const tags = recentMoods[i].emotion_tags;
      for (let j = 0; j < tags.length; j++) {
        if (!uniqueEmotions.includes(tags[j])) {
          uniqueEmotions.push(tags[j]);
        }
      }
    }
    uniqueEmotions = uniqueEmotions.slice(0, 5);

    // figure out mood trend. Just compare first and last mood
    let moodTrend: string | null = null;
    if (recentMoods.length >= 3) {
      const oldest = recentMoods[recentMoods.length - 1].rating;
      const newest = recentMoods[0].rating;
      if (newest - oldest > 1) {
        moodTrend = 'improving recently';
      }
      else if (oldest - newest > 1) {
        moodTrend = 'declining recently';
      }
      else {
        moodTrend = 'fairly steady';
      }
    }

    // time of day
    const hour = new Date().getHours();
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon';
    }
    else if (hour >= 17 && hour < 21) {
      timeOfDay = 'evening'; 
    }  
    else if (hour >= 21 || hour < 5) {
      timeOfDay = 'late night';
    }
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

  async sendMessage(conversationId: string, userMessage: string, userId: string): Promise<any> {
    // check for crisis keywords first
    const crisisCheck = crisisDetectionService.detectInUserMessage(userMessage);

    // save the users message to db
    const userMsg = await messageRepository.create({
      conversationId,
      role: 'user',
      content: userMessage,
      isCrisisFlagged: crisisCheck.severity === 'high',
    });

    // if its a high severity crisis, skip the AI and respond right away with resources
    if (crisisCheck.severity === 'high') {
      const cResponse = crisisDetectionService.crisisResponse();
      const assistantMsg = await messageRepository.create({
        conversationId,
        role: 'assistant',
        content: cResponse,
        isCrisisFlagged: true,
      });
      await crisisDetectionService.logCrisisEvent(userId, userMsg.id, crisisCheck);
      await conversationRepository.updateTimestamp(conversationId);
      return { fullResponse: cResponse, crisisDetected: true, messageId: assistantMsg.id };
    }

    // get conversation history and build the prompt
    const history = await messageRepository.getRecent(conversationId, 20);
    const userContext = await this.buildUserContext(userId);
    const systemPrompt = buildSystemPrompt(userContext);

    // format messages for gemini api
    const contents: any[] = [];
    for (let i = 0; i < history.length; i++) {
      if (history[i].role === 'system') {
        continue;
      }
      contents.push({
        role: history[i].role === 'assistant' ? 'model' : 'user',
        parts: [{ text: history[i].content }],
      });
    }

    try {
      // call gemini
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

      let responseText = response.text || "I'm here for you. Could you tell me more about what's on your mind?";

      // check if the AI flagged a crisis in its response
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

      if (crisisCheck.severity === 'medium' && !aiCrisisDetected) {
        await crisisDetectionService.logCrisisEvent(userId, userMsg.id, crisisCheck);
      }

      // save lunas response
      const assistantMsg = await messageRepository.create({
        conversationId,
        role: 'assistant',
        content: responseText,
        isCrisisFlagged: isCrisis,
      });

      await conversationRepository.updateTimestamp(conversationId);

      // set conversation title to the first message
      const msgCount = await messageRepository.countByConversation(conversationId);
      if (msgCount <= 2) {
        await conversationRepository.updateTitle(conversationId, userMessage.substring(0, 50));
      }

      return { fullResponse: responseText, crisisDetected: isCrisis, messageId: assistantMsg.id };
    } catch (err) {
      logger.error('Gemini API error:', err);
      const fallback = "Something happened. Please try sending that again.";
      const assistantMsg = await messageRepository.create({
        conversationId,
        role: 'assistant',
        content: fallback,
      });
      return { fullResponse: fallback, crisisDetected: false, messageId: assistantMsg.id };
    }
  },
};
