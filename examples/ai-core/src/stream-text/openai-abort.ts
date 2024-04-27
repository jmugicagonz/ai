import { openai } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    const { textStream } = await experimental_streamText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'Write a short story about a robot learning to love:\n\n',
      abortSignal: AbortSignal.timeout(3000),
    });

    for await (const textPart of textStream) {
      process.stdout.write(textPart);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'AbortError' || error.name === 'TimeoutError')
    ) {
      console.log('\n\nAbortError: The run was aborted.');
    }
  }
}

main().catch(console.error);
