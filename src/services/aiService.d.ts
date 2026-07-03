import { AIResponse, TriageItem, ValidationError } from '../types';
export interface AICache {
    [itemId: string]: {
        data: AIResponse;
        timestamp: number;
    };
}
export declare function validateAIResponse(data: unknown): {
    valid: boolean;
    errors: ValidationError[];
    data?: AIResponse;
};
export declare function generateAIResponse(item: TriageItem, options?: {
    signal?: AbortSignal;
    onPartialReply?: (chunk: string) => void;
}): Promise<AIResponse>;
export declare function clearAICache(itemId?: string): void;
//# sourceMappingURL=aiService.d.ts.map