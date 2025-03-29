import runGeminiModel  from "./geminiServices.js";

function modelsHandler(modelName){
    this.modelName = modelName.toUpperCase();
    console.log(`Calling ${this.modelName}`)
}

modelsHandler.prototype.geminiHandler = async function(query){
    return await runGeminiModel(query); 
}

modelsHandler.prototype.openAIHandler = async function(query){
    console.log("");
}

modelsHandler.prototype.getHandler = async function(query){
    switch(this.modelName){
        case "GEMINI":
            return await this.geminiHandler(query);
        case "OPENAI":
            throw new Error(`Not implemented yet: ${this.modelName}`)
            // return await this.openAIHandler(query);
        default:
            throw new Error(`Unsupported model: ${this.modelName}`)
    }
}

export default modelsHandler;

// var a = new modelsHandler("openai");
// var response = await a.getHandler("What is your name ?");

// console.log(response);