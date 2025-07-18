import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handleImage(prompt: string, context?: string, isChained?: boolean): Promise<string> {
  try {
    // Create an enhanced prompt for image generation
    let imagePrompt = prompt;
    
    if (isChained && context) {
      // For chained conversations, create a more contextual image prompt
      imagePrompt = `Create a visual representation of: ${prompt}. Context: ${context}. Style: Educational, clear, colorful, suitable for learning materials. Important: Create a wide landscape image that fits properly in a 16:9 aspect ratio (1920x1080 equivalent) without any content being cut off. Ensure all elements are fully visible within the frame.`;
    } else {
      // For new conversations, enhance the prompt for better image generation
      imagePrompt = `Create a visual representation of: ${prompt}. Style: Educational, clear, colorful, suitable for learning materials, scientific illustration. Important: Create a wide landscape image that fits properly in a 16:9 aspect ratio (1920x1080 equivalent) without any content being cut off. Ensure all elements are fully visible within the frame.`;
    }

    console.log('Generating image with prompt:', imagePrompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    console.log('Generated image URL:', imageUrl);
    
    if (imageUrl) {
      return `Image generated successfully! Here's your image: ${imageUrl}`;
    } else {
      return "I'm sorry, I couldn't generate an image for your request. Please try again with a different prompt.";
    }
    
  } catch (error) {
    console.error('Error generating image:', error);
    return "I'm sorry, I encountered an error while generating your image. Please try again.";
  }
}
  