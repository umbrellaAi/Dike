import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY_1;
const model_name = process.env.MODEL_NAME;
const temperature = parseFloat(process.env.TEMPERATURE);
const topK = parseInt(process.env.TOP_K);
const topP = parseFloat(process.env.TOP_P);
const maxOutputTokens = parseInt(process.env.MAX_OUTPUT_TOKENS);

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: model_name,
});

const generationConfig = {
    temperature: temperature,
    topP: topP,
    topK: topK,
    maxOutputTokens: maxOutputTokens,
    responseMimeType: "text/plain",
};

async function runGeminiModel(Query) {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });
    const result = (await chatSession.sendMessage(Query)).response.text();
    return result;
}
export default runGeminiModel;