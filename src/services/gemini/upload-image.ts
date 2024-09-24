import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const fileManager = new GoogleAIFileManager(
  process.env.GEMINI_API_KEY as string,
);

export async function uploadImage(imageBase64: string) {
  try {
    const tempFilePath = await base64ToTempFile(imageBase64);
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: "image/jpeg",
      displayName: "Upload Image",
    });

    await fs.promises.unlink(tempFilePath);
    return {
      mime_type: uploadResponse.file.mimeType,
      image_url: uploadResponse.file.uri,
    };
  } catch (error) {
    // Tratamento de erro
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}

// Converção de base64 para uma imagem .jpeg
async function base64ToTempFile(image: string) {
  const buffer = Buffer.from(image, "base64");
  const tempFilePath = path.join(__dirname, `temp-${uuidv4()}.jpeg`);
  await fs.promises.writeFile(tempFilePath, buffer);
  return tempFilePath;
}

// Recuperação da descrição da imagem
export async function getMeasureValue(mimeType: string, fileUri: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType,
          fileUri,
        },
      },
      { text: "Qual o valor númérico da medição nesta imagem?" },
    ]);

    if (result.response && result.response.text()) {
      const text = result.response.text();
      const match = text.match(/\d+([.,]\d+)?/);
      if (match) {
        return parseInt(match[0]);
      } else {
        throw new Error("Nenhum valor numérico encontrado na resposta.");
      }
    } else {
      throw new Error("Resposta inválida do modelo.");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}
