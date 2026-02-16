import { GoogleGenerativeAI } from '@google/generative-ai';
import { getChatbotContext } from '@/lib/context-loader';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        console.log('Incoming messages:', JSON.stringify(messages, null, 2));

        // Load the latest portfolio context
        const context = await getChatbotContext();

        // Get the model
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        // Convert messages to Gemini format (strip 'type' field from parts)
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: msg.parts
                ? msg.parts.map((part: any) => ({ text: part.text || part }))
                : [{ text: msg.content || '' }]
        }));

        const lastMessage = messages[messages.length - 1];
        const userMessage = lastMessage.parts?.[0]?.text || lastMessage.content || '';

        // Start chat with history and context
        const chat = model.startChat({
            history,
            systemInstruction: {
                role: 'user',
                parts: [{ text: context }]
            },
        });

        // Stream the response
        const result = await chat.sendMessageStream(userMessage);

        // Create a readable stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        controller.enqueue(encoder.encode(text));
                    }
                    controller.close();
                } catch (error) {
                    console.error('Stream error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error) {
        console.error('Error in chat route:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }), { status: 500 });
    }
}
