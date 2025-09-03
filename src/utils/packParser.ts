import { z } from "zod";
import { packSchema, type PackSchema } from "./schema";

export interface ParseResult {
  success: boolean;
  data?: PackSchema;
  error?: string;
  validationErrors?: string[];
}

export interface JsonSource {
  type: "text" | "file" | "url";
  content: string | File | string;
}

/**
 * Advanced JSON parser for learning packs with comprehensive validation
 */
export class PackParser {
  /**
   * Parse JSON from multiple sources (text, file, URL)
   */
  static async parseFromSource(source: JsonSource): Promise<ParseResult> {
    try {
      let jsonContent: string;

      switch (source.type) {
        case "text":
          jsonContent = source.content as string;
          break;
        
        case "file":
          const file = source.content as File;
          jsonContent = await this.readFileAsText(file);
          break;
        
        case "url":
          const url = source.content as string;
          jsonContent = await this.fetchFromUrl(url);
          break;
        
        default:
          return {
            success: false,
            error: "Unsupported source type",
          };
      }

      return this.parseJsonText(jsonContent);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown parsing error",
      };
    }
  }

  /**
   * Parse JSON text with enhanced error handling
   */
  static parseJsonText(jsonText: string): ParseResult {
    try {
      // Clean and preprocess JSON
      const cleanedJson = this.preprocessJson(jsonText);
      
      // Parse JSON
      const parsedData = JSON.parse(cleanedJson);
      
      // Validate with Zod schema
      const validationResult = packSchema.safeParse(parsedData);
      
      if (validationResult.success) {
        return {
          success: true,
          data: validationResult.data,
        };
      } else {
        // Extract detailed validation errors
        const validationErrors = this.extractValidationErrors(validationResult.error);
        
        return {
          success: false,
          error: "JSON structure validation failed",
          validationErrors,
        };
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          error: `JSON syntax error: ${error.message}`,
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown JSON parsing error",
      };
    }
  }

  /**
   * Preprocess JSON to handle common formatting issues
   */
  private static preprocessJson(jsonText: string): string {
    let cleaned = jsonText.trim();
    
    // Remove BOM if present
    if (cleaned.charCodeAt(0) === 0xFEFF) {
      cleaned = cleaned.slice(1);
    }
    
    // Handle common JSON issues
    cleaned = cleaned
      // Fix trailing commas in objects and arrays
      .replace(/,\s*([}\]])/g, '$1')
      // Fix single quotes to double quotes (basic cases)
      .replace(/'/g, '"')
      // Remove comments (basic /* */ and // style)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
    
    return cleaned;
  }

  /**
   * Extract user-friendly validation errors from Zod error
   */
  private static extractValidationErrors(error: z.ZodError): string[] {
    return error.errors.map(err => {
      const path = err.path.length > 0 ? ` at "${err.path.join('.')}"` : '';
      return `${err.message}${path}`;
    });
  }

  /**
   * Read file as text
   */
  private static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  /**
   * Fetch JSON from URL
   */
  private static async fetchFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Auto-detect and fix common JSON pack structure issues
   */
  static autoFixPack(data: any): any {
    const fixed = { ...data };

    // Ensure required top-level fields
    if (!fixed.title) fixed.title = "Untitled Pack";
    if (!fixed.description) fixed.description = "";
    if (!fixed.tags) fixed.tags = [];
    if (!fixed.items) fixed.items = [];
    if (typeof fixed.public !== "boolean") fixed.public = false;

    // Fix items array
    fixed.items = fixed.items.map((item: any, index: number) => {
      const fixedItem = { ...item };
      
      // Generate ID if missing
      if (!fixedItem.id) {
        fixedItem.id = `item-${index + 1}`;
      }
      
      // Ensure text field
      if (!fixedItem.text) {
        fixedItem.text = `Question ${index + 1}`;
      }
      
      // Validate and fix type
      if (!["single", "multi", "text"].includes(fixedItem.type)) {
        // Try to auto-detect type based on options
        if (fixedItem.options && Array.isArray(fixedItem.options)) {
          const correctCount = fixedItem.options.filter((opt: any) => opt.correct).length;
          fixedItem.type = correctCount > 1 ? "multi" : "single";
        } else {
          fixedItem.type = "text";
        }
      }
      
      // Fix options for single/multi choice
      if (fixedItem.type !== "text" && fixedItem.options) {
        fixedItem.options = fixedItem.options.map((option: any, optIndex: number) => {
          const fixedOption = { ...option };
          
          // Generate ID if missing
          if (!fixedOption.id) {
            fixedOption.id = String.fromCharCode(97 + optIndex); // a, b, c, d...
          }
          
          // Ensure text field
          if (!fixedOption.text) {
            fixedOption.text = `Option ${optIndex + 1}`;
          }
          
          // Ensure correct is boolean
          if (typeof fixedOption.correct !== "boolean") {
            fixedOption.correct = false;
          }
          
          return fixedOption;
        });
      }
      
      return fixedItem;
    });

    return fixed;
  }

  /**
   * Validate pack completeness and provide suggestions
   */
  static validatePackQuality(pack: PackSchema): {
    score: number;
    suggestions: string[];
    warnings: string[];
  } {
    const suggestions: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check basic metadata
    if (!pack.description || pack.description.length < 20) {
      suggestions.push("Add a more detailed description (at least 20 characters)");
      score -= 10;
    }

    if (!pack.tags || pack.tags.length === 0) {
      suggestions.push("Add relevant tags to improve discoverability");
      score -= 5;
    }

    if (pack.tags && pack.tags.length > 10) {
      warnings.push("Too many tags might reduce focus - consider limiting to 8-10 tags");
      score -= 5;
    }

    // Check questions
    if (pack.items.length < 3) {
      warnings.push("Pack should have at least 3 questions for meaningful learning");
      score -= 15;
    }

    if (pack.items.length > 20) {
      suggestions.push("Consider splitting into multiple packs - large packs can be overwhelming");
      score -= 5;
    }

    // Check question quality
    pack.items.forEach((item, index) => {
      if (!item.explanation) {
        suggestions.push(`Question ${index + 1}: Add explanation for better learning experience`);
        score -= 3;
      }

      if (item.type !== "text" && (!item.options || item.options.length < 2)) {
        warnings.push(`Question ${index + 1}: Should have at least 2 options`);
        score -= 10;
      }

      if (item.type !== "text" && item.options) {
        const correctCount = item.options.filter(opt => opt.correct).length;
        
        if (correctCount === 0) {
          warnings.push(`Question ${index + 1}: No correct answer marked`);
          score -= 15;
        }
        
        if (item.type === "single" && correctCount > 1) {
          warnings.push(`Question ${index + 1}: Single choice should have exactly one correct answer`);
          score -= 10;
        }
        
        if (item.type === "multi" && correctCount === 1) {
          suggestions.push(`Question ${index + 1}: Consider changing to single choice or add more correct options`);
          score -= 5;
        }
      }
    });

    return {
      score: Math.max(0, score),
      suggestions,
      warnings,
    };
  }
}

/**
 * Helper function for common parsing scenarios
 */
export async function parsePackFromFile(file: File): Promise<ParseResult> {
  return PackParser.parseFromSource({ type: "file", content: file });
}

export function parsePackFromText(text: string): ParseResult {
  return PackParser.parseJsonText(text);
}

export async function parsePackFromUrl(url: string): Promise<ParseResult> {
  return PackParser.parseFromSource({ type: "url", content: url });
}

/**
 * Generate sample pack for testing
 */
export function generateSamplePack(): PackSchema {
  return {
    title: "Sample Learning Pack",
    description: "A sample pack demonstrating all question types and features",
    tags: ["sample", "demo", "testing"],
    public: true,
    items: [
      {
        id: "sample-1",
        text: "What is the capital of France?",
        type: "single",
        options: [
          { id: "a", text: "London", correct: false },
          { id: "b", text: "Paris", correct: true },
          { id: "c", text: "Berlin", correct: false },
          { id: "d", text: "Madrid", correct: false },
        ],
        explanation: "Paris is the capital and most populous city of France.",
      },
      {
        id: "sample-2",
        text: "Which of the following are programming languages?",
        type: "multi",
        options: [
          { id: "a", text: "JavaScript", correct: true },
          { id: "b", text: "HTML", correct: false },
          { id: "c", text: "Python", correct: true },
          { id: "d", text: "CSS", correct: false },
        ],
        explanation: "JavaScript and Python are programming languages, while HTML and CSS are markup and styling languages.",
      },
      {
        id: "sample-3",
        text: "Explain the concept of recursion in programming.",
        type: "text",
        explanation: "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.",
      },
    ],
  };
}