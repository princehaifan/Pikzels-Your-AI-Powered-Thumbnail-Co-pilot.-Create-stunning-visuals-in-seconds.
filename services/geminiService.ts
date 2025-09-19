import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateThumbnail = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a vibrant, eye-catching, high-resolution YouTube thumbnail. The thumbnail should be visually appealing and clickable. Theme: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

export const generateTitles = async (description: string): Promise<string[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the following video description, generate 5 catchy, SEO-friendly YouTube titles. Description: "${description}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    titles: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                        },
                    },
                },
            },
        },
    });
    
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    return result.titles || [];
};

export const faceSwap = async (baseImageFile: File, faceImageFile: File, intensity: number): Promise<string> => {
    const [baseImage, faceImage] = await Promise.all([
        fileToBase64(baseImageFile),
        fileToBase64(faceImageFile),
    ]);

    const promptText = `**Objective:** Perform a highly realistic face swap.

**Image 1 (Base Thumbnail):** This is the target image. Your first task is to identify the primary human face in this image. Pay close attention to its position, orientation, head angle, and the lighting conditions (direction, color, and softness of light).

**Image 2 (Source Face):** This image contains the face that needs to be swapped *onto* the base thumbnail.

**Instructions:**
1.  **Feature Mapping:** Carefully extract the facial features (eyes, nose, mouth, eyebrows) from the Source Face.
2.  **Seamless Integration:** Replace the face in the Base Thumbnail with the features from the Source Face. This is not a simple cut-and-paste. You must perform a photorealistic blend.
3.  **Critical Blending Details:**
    *   **Lighting & Shading:** The new face *must* match the exact lighting of the Base Thumbnail. This includes recreating shadows and highlights that are consistent with the original scene's light source(s).
    *   **Color & Tone:** Adjust the skin tone, color grading, and saturation of the swapped face to match the Base Thumbnail's aesthetic perfectly.
    *   **Perspective & Alignment:** Align the swapped facial features (eyes, nose, mouth) to the original face's perspective and head tilt. The new face should look naturally positioned on the original head.
    *   **Texture:** Retain a natural skin texture. Avoid an overly smooth or "plastic" look.
4.  **Intensity Control:** The user has specified an intensity of ${Math.round(intensity * 100)}%.
    *   At 100%, perform a complete and opaque replacement.
    *   At lower percentages, create a subtle, semi-transparent blend, merging the features of the source face with the original face.
5.  **Preservation:** The background, hair, clothing, and all other elements of the Base Thumbnail must remain completely unchanged.

The final output should be a single, high-quality image where the face swap is so realistic it is virtually undetectable.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: baseImage.data, mimeType: baseImage.mimeType } },
                { inlineData: { data: faceImage.data, mimeType: faceImage.mimeType } },
                { text: promptText },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("No image was generated by the model.");
};

export const recreateThumbnail = async (thumbnailFile: File, prompt: string): Promise<string> => {
    const thumbnail = await fileToBase64(thumbnailFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: thumbnail.data, mimeType: thumbnail.mimeType } },
                { text: `Recreate the provided thumbnail image with the following changes: "${prompt}". Maintain a similar style and layout unless specified otherwise. The output must be a high-quality image.` },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType;
            return `data:${mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("No image was generated by the model.");
};