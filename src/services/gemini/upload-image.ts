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
    const { mimeType, base64Data } = extractMimeTypeAndData(imageBase64);
    const extension = mimeType.split("/")[1];

    const tempFilePath = await base64ToTempFile(base64Data, extension);
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
async function base64ToTempFile(image: string, extension: string) {
  const buffer = Buffer.from(image, "base64");
  const tempFilePath = path.join(__dirname, `temp-${uuidv4()}.${extension}`);
  await fs.promises.writeFile(tempFilePath, buffer);
  return tempFilePath;
}

// Função para extrair o MIME type e os dados base64 da string
function extractMimeTypeAndData(base64String: string) {
  const match = base64String.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    throw new Error("Formato base64 inválido");
  }
  const mimeType = match[1];
  const base64Data = match[2];
  return { mimeType, base64Data };
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
