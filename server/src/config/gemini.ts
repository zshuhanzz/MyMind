import { GoogleGenAI } from '@google/genai';
import { env } from './environment.js';

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

export const CHAT_MODEL = 'gemini-2.5-flash';
export const INSIGHT_MODEL = 'gemini-2.5-pro';

export default ai;
