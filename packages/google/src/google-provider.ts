import { Google } from './google-facade';
import { GoogleGenerativeAILanguageModel } from './google-generative-ai-language-model';
import {
  GoogleGenerativeAIModelId,
  GoogleGenerativeAISettings,
} from './google-generative-ai-settings';
import { GoogleAuth } from 'google-auth-library';

export interface GoogleGenerativeAIProvider {
  (
    modelId: GoogleGenerativeAIModelId,
    settings?: GoogleGenerativeAISettings,
  ): GoogleGenerativeAILanguageModel;

  chat(
    modelId: GoogleGenerativeAIModelId,
    settings?: GoogleGenerativeAISettings,
  ): GoogleGenerativeAILanguageModel;

  /**
   * @deprecated Use `chat()` instead.
   */
  generativeAI(
    modelId: GoogleGenerativeAIModelId,
    settings?: GoogleGenerativeAISettings,
  ): GoogleGenerativeAILanguageModel;
}

export interface GoogleGenerativeAIProviderSettings {
  /**
Use a different URL prefix for API calls, e.g. to use proxy servers.
The default prefix is `https://generativelanguage.googleapis.com/v1beta`.
   */
  baseURL?: string;

  /**
@deprecated Use `baseURL` instead.
   */
  baseUrl?: string;

  /**
API key that is being send using the `x-goog-api-key` header.
It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.
   */
  apiKey?: string;

  /**
   * Boolean to indicate if it should use VertexAI instead of the default API.
   */
  useVertexAI?: boolean;

  /**
   * The Google Auth client to use for authentication. This will be used if useVertexAI is true.
   */
  auth?: GoogleAuth;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  generateId?: () => string;
}

/**
Create a Google Generative AI provider instance.
 */
export function createGoogleGenerativeAI(
  options: GoogleGenerativeAIProviderSettings = {},
): GoogleGenerativeAIProvider {
  const google = new Google(options);

  const provider = function (
    modelId: GoogleGenerativeAIModelId,
    settings?: GoogleGenerativeAISettings,
  ) {
    if (new.target) {
      throw new Error(
        'The Google Generative AI model function cannot be called with the new keyword.',
      );
    }

    return google.chat(modelId, settings);
  };

  provider.chat = google.chat.bind(google);
  provider.generativeAI = google.generativeAI.bind(google);

  return provider as GoogleGenerativeAIProvider;
}

/**
Default Google Generative AI provider instance.
 */
export const google = createGoogleGenerativeAI();
