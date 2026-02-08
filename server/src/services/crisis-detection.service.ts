import { CRISIS_PATTERNS, CRISIS_RESOURCES, type CrisisAssessment } from '../utils/crisis-keywords.js';
import { query } from '../config/database.js';

export const crisisDetectionService = {
  detectInUserMessage(content: string): CrisisAssessment {
    for (const pattern of CRISIS_PATTERNS.high_severity) {
      if (pattern.test(content)) {
        return { detected: true, severity: 'high', trigger: 'keyword', pattern: pattern.source };
      }
    }
    for (const pattern of CRISIS_PATTERNS.medium_severity) {
      if (pattern.test(content)) {
        return { detected: true, severity: 'medium', trigger: 'keyword', pattern: pattern.source };
      }
    }
    for (const pattern of CRISIS_PATTERNS.low_severity) {
      if (pattern.test(content)) {
        return { detected: true, severity: 'low', trigger: 'keyword', pattern: pattern.source };
      }
    }
    return { detected: false, severity: 'none', trigger: null, pattern: null };
  },

  detectInAiResponse(response: string): boolean {
    return response.includes('[CRISIS_DETECTED]');
  },

  cleanCrisisMarker(response: string): string {
    return response.replace(/\[CRISIS_DETECTED\]\s*/g, '');
  },

  async logCrisisEvent(userId: string, messageId: string | null, assessment: CrisisAssessment) {
    await query(
      `INSERT INTO crisis_events (user_id, message_id, trigger_type, trigger_details, resources_shown)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        messageId,
        assessment.trigger || 'ai_detected',
        JSON.stringify({ severity: assessment.severity, pattern: assessment.pattern }),
        CRISIS_RESOURCES.map((r) => r.name),
      ]
    );
  },

  getResources() {
    return CRISIS_RESOURCES;
  },

  buildImmediateCrisisResponse(): string {
    return `I'm really glad you shared that with me. Your safety matters deeply, and I want to make sure you get the support you need right now.

Please reach out to people who are trained to help:

- **988 Suicide & Crisis Lifeline** — Call or text 988 (available 24/7)
- **Crisis Text Line** — Text HOME to 741741 (available 24/7)
- **Emergency Services** — Call 911 or your local emergency number

You don't have to go through this alone. These are people who genuinely care and want to help. Will you reach out to one of them?`;
  },
};
