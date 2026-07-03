import { AIResponse, TriageItem, ValidationError } from '../types';

const AI_LATENCY_MIN = 200;
const AI_LATENCY_MAX = 1200;
const FAILURE_RATE = 0.1; // 10% chance of failure

export interface AICache {
  [itemId: string]: {
    data: AIResponse;
    timestamp: number;
  };
}

const aiCache: AICache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function validateAIResponse(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  data?: AIResponse;
} {
  const errors: ValidationError[] = [];

  if (typeof data !== 'object' || data === null) {
    errors.push({ field: 'root', message: 'Response must be an object' });
    return { valid: false, errors };
  }

  const obj = data as Record<string, unknown>;

  // Validate summary_bullets
  if (!Array.isArray(obj.summary_bullets)) {
    errors.push({
      field: 'summary_bullets',
      message: 'Must be an array',
    });
  } else if (obj.summary_bullets.length < 1 || obj.summary_bullets.length > 4) {
    errors.push({
      field: 'summary_bullets',
      message: 'Must have 1-4 bullets',
    });
  } else if (!obj.summary_bullets.every((b) => typeof b === 'string')) {
    errors.push({
      field: 'summary_bullets',
      message: 'All bullets must be strings',
    });
  }

  // Validate category
  const validCategories = [
    'Billing',
    'Claims',
    'Endorsement',
    'General',
    'Urgent',
    'Spam',
  ];
  if (!validCategories.includes(obj.category as string)) {
    errors.push({
      field: 'category',
      message: `Must be one of: ${validCategories.join(', ')}`,
    });
  }

  // Validate priority
  const validPriorities = ['P1', 'P2', 'P3'];
  if (!validPriorities.includes(obj.priority as string)) {
    errors.push({
      field: 'priority',
      message: 'Must be P1, P2, or P3',
    });
  }

  // Validate suggested_action
  if (typeof obj.suggested_action !== 'string' || obj.suggested_action.length === 0) {
    errors.push({
      field: 'suggested_action',
      message: 'Must be a non-empty string',
    });
  }

  // Validate draft_reply
  if (typeof obj.draft_reply !== 'string' || obj.draft_reply.length === 0) {
    errors.push({
      field: 'draft_reply',
      message: 'Must be a non-empty string',
    });
  }

  // Validate confidence
  if (typeof obj.confidence !== 'number' || obj.confidence < 0 || obj.confidence > 1) {
    errors.push({
      field: 'confidence',
      message: 'Must be a number between 0 and 1',
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      summary_bullets: obj.summary_bullets as string[],
      category: obj.category as AIResponse['category'],
      priority: obj.priority as AIResponse['priority'],
      suggested_action: obj.suggested_action as string,
      draft_reply: obj.draft_reply as string,
      confidence: obj.confidence as number,
    },
  };
}

// Deterministic mock AI based on item subject hash
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function generateMockAI(item: TriageItem): AIResponse {
  const hash = hashString(item.id);

  // Use hash to select consistent responses
  const categoryOptions: AIResponse['category'][] = [
    'Billing',
    'Claims',
    'Endorsement',
    'General',
    'Urgent',
    'Spam',
  ];

  // Determine response based on tags and hash
  let category: AIResponse['category'] = categoryOptions[hash % categoryOptions.length];

  // Override for known spam
  if (item.tags.includes('spam') || item.tags.includes('phishing')) {
    category = 'Spam';
  }

  // Override for claims
  if (item.tags.includes('claims')) {
    category = 'Claims';
  }

  // Override for urgent/fraud
  if (item.tags.includes('fraud-alert')) {
    category = 'Urgent';
  }

  const summaries: { [key: string]: string[] } = {
    Billing: [
      'Premium increased 29% on renewal despite no vehicle changes',
      'Policy TH-AB-48291 needs review for rate accuracy',
      'Customer requesting verification of charges',
    ],
    Claims: [
      'Motor vehicle accident claim worth ~45K THB',
      'Police report FR-2026-031562 available',
      'Third-party vehicle also involved',
      'Vehicle in repair, estimate requested',
    ],
    Endorsement: [
      'Vehicle plate change endorsement needed',
      'Policy TH-MTR-99210 effective March 18',
      'New registration documents provided',
    ],
    Urgent: [
      'Fraudulent phishing email with urgency tactics',
      'Attempting to collect banking and sensitive information',
      'Should be marked as spam and archived',
    ],
    Spam: [
      'Lottery scam claiming 500K THB prize',
      'Requesting payment for "processing fee"',
      'Multiple red flags: bit.ly link, fake credentials, urgency',
    ],
    General: [
      'Renewal reminder email with quote options',
      'Customer notification about expiring policy',
      'Standard administrative communication',
    ],
  };

  const actions: { [key: string]: string } = {
    Billing: 'Review renewal underwriting; compare quote with previous terms and market data',
    Claims: 'Log claim, contact adjuster for investigation, request supporting documents',
    Endorsement: 'Verify registration documents, process plate change endorsement within 24h',
    Urgent: 'FLAG: Potential fraud investigation, contact claimant, review claim history',
    Spam: 'Archive immediately, block sender, flag as phishing attempt',
    General: 'Acknowledge receipt, no immediate action needed',
  };

  const replies: { [key: string]: string } = {
    Billing: `Dear ${item.sender.name},

Thank you for reaching out. I've reviewed your renewal quote for policy TH-AB-48291. I understand your concern about the premium increase.

Let me investigate the rate change with our underwriting team. Typically, premium adjustments can be due to:
- Updated vehicle safety ratings
- Regional claims data changes
- Policy enhancement additions

I'll follow up with a detailed breakdown within 24 hours.

Best regards,
Claims Support Team`,
    Claims: `Dear ${item.sender.name},

Thank you for filing your claim. I've received all the information and we're ready to begin processing.

Your claim number is CLM-2026-[XXXXX]. I'll be assigning this to our claims adjuster who will contact you within 2 business hours to coordinate the vehicle inspection.

Please keep all documentation handy.

Best regards,
Claims Team`,
    Endorsement: `Dear ${item.sender.name},

Thank you for the endorsement request. I have your new registration documents and will process this change immediately.

Your policy will be updated effective March 18, 2026. You'll receive a new certificate within 24 hours.

No additional action needed.

Best regards,
Endorsements Team`,
    Urgent: `[INTERNAL ESCALATION] This item has been flagged as potential fraud and requires investigation.`,
    Spam: `[INTERNAL] Spam detected and archived. Sender blocked.`,
    General: `Dear ${item.sender.name},

Thank you for your inquiry. Your policy is currently active and all benefits are available.

If you need any assistance, please don't hesitate to reach out.

Best regards,
Support Team`,
  };

  const priorityMap: { [key: string]: AIResponse['priority'] } = {
    Billing: 'P2',
    Claims: 'P1',
    Endorsement: 'P3',
    Urgent: 'P1',
    Spam: 'P1',
    General: 'P3',
  };

  return {
    summary_bullets: summaries[category],
    category,
    priority: priorityMap[category],
    suggested_action: actions[category],
    draft_reply: replies[category],
    confidence: 0.75 + (hash % 100) / 500, // 0.75 - 0.95
  };
}

export async function generateAIResponse(
  item: TriageItem,
  options?: {
    signal?: AbortSignal;
    onPartialReply?: (chunk: string) => void;
  }
): Promise<AIResponse> {
  const { signal, onPartialReply } = options || {};

  // Check cache first
  const cached = aiCache[item.id];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  if (signal?.aborted) {
    return Promise.reject(new Error('AI request aborted'));
  }

  const latency = AI_LATENCY_MIN + Math.random() * (AI_LATENCY_MAX - AI_LATENCY_MIN);

  return new Promise((resolve, reject) => {
    let latencyTimer: number | null = null;
    let streamTimer: number | null = null;
    let finished = false;

    const cleanUp = () => {
      finished = true;
      if (latencyTimer !== null) {
        window.clearTimeout(latencyTimer);
      }
      if (streamTimer !== null) {
        window.clearTimeout(streamTimer);
      }
      signal?.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      if (finished) return;
      cleanUp();
      reject(new Error('AI request aborted'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });

    latencyTimer = window.setTimeout(() => {
      if (finished || signal?.aborted) {
        cleanUp();
        return;
      }

      if (Math.random() < FAILURE_RATE) {
        cleanUp();
        reject(new Error('AI service timeout - please try again'));
        return;
      }

      try {
        const response = generateMockAI(item);

        const validation = validateAIResponse(response);
        if (!validation.valid) {
          cleanUp();
          reject(
            new Error(
              `Validation failed: ${validation.errors.map((e) => e.message).join(', ')}`
            )
          );
          return;
        }

        aiCache[item.id] = {
          data: response,
          timestamp: Date.now(),
        };

        if (onPartialReply) {
          const draftReply = response.draft_reply;
          const charDelay = 20;
          let charIndex = 0;

          const streamChar = () => {
            if (finished || signal?.aborted) {
              cleanUp();
              return;
            }
            if (charIndex < draftReply.length) {
              onPartialReply(draftReply[charIndex]);
              charIndex++;
              streamTimer = window.setTimeout(streamChar, charDelay);
            } else {
              cleanUp();
              resolve(response);
            }
          };

          streamChar();
        } else {
          cleanUp();
          resolve(response);
        }
      } catch (error) {
        cleanUp();
        reject(error);
      }
    }, latency);
  });
}

export function clearAICache(itemId?: string): void {
  if (itemId) {
    delete aiCache[itemId];
  } else {
    Object.keys(aiCache).forEach((key) => {
      delete aiCache[key];
    });
  }
}
