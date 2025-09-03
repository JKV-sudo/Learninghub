import { z } from 'zod'

export const optionSchema = z.object({
  id: z.string(),
  text: z.string(),
  correct: z.boolean(), // Remove .optional() - correct field is required
  explanation: z.string().optional(),
})

export const itemSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['single', 'multi', 'text']).default('single'),
  options: z.array(optionSchema).optional(),
  explanation: z.string().optional(),
}).refine((data) => {
  // Text questions shouldn't have options
  if (data.type === 'text' && data.options && data.options.length > 0) {
    return false;
  }
  // Single/Multi questions must have options
  if ((data.type === 'single' || data.type === 'multi') && (!data.options || data.options.length === 0)) {
    return false;
  }
  // Single questions must have exactly one correct answer
  if (data.type === 'single' && data.options) {
    const correctCount = data.options.filter(opt => opt.correct).length;
    return correctCount === 1;
  }
  // Multi questions must have at least one correct answer
  if (data.type === 'multi' && data.options) {
    const correctCount = data.options.filter(opt => opt.correct).length;
    return correctCount >= 1;
  }
  return true;
}, {
  message: "Invalid question type and options combination"
})

export const packSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  items: z.array(itemSchema),
  public: z.boolean().optional(),
})

export type PackSchema = z.infer<typeof packSchema>