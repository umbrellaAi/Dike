import prompts from "./prompts.js";
import dotenv from "dotenv";

dotenv.config();

const {
    TASK_PLANNER, 
    TASK_CLASSIFIER_AND_COMPLEXITY_ANALYZER, 
    QA_GENERATOR, CASE_CATEGORIZER, 
    LEGAL_FACT_EXTRACTOR, 
    LEGAL_COMPLEXITY_EVALUATOR, 
    LEGAL_SENTIMENT_ANALYSER, 
    LAW_GENERATOR, 
    LEGAL_VALIDATOR, 
    AI_ETHICS_AND_BIAS_DETECTOR, 
    FALLBACK, 
    RESPONSE_BUILDER
    } = process.env;

function promptBuillder(task_name){
    this.task_name = task_name;
}

promptBuillder.prototype.taskPlanner = function(input, country){
    return prompts[this.task_name].replace("{{input}}", input).replace("{{country}}", country);
}

promptBuillder.prototype.taskClassifierAndComplexityAnalyzer = function(input){
    return prompts[this.task_name].replace("{{input}}", input);
}

promptBuillder.prototype.qaGenerator = function(input, country){
    return prompts[this.task_name].replace("{{input}}", input).replace("{{country}}", country);
}

promptBuillder.prototype.caseCategorizer = function(input, country){
    return prompts[this.task_name].replace("{{input}}", input).replace("{{country}}", country);
}

promptBuillder.prototype.legalFactExtractor = function(input, country, caseType){
    return prompts[this.task_name]
        .replace("{{input}}", input)
        .replace("{{country}}", country)
        .replace("{{caseType}}", caseType);
}

promptBuillder.prototype.legalComplexityEvaluator = function(input, caseType, country){
    return prompts[this.task_name]
        .replace("{{input}}", input)
        .replace("{{case type}}", caseType)
        .replace("{{country}}", country);
}

promptBuillder.prototype.legalSentimentAnalyser = function(input, country){
    return prompts[this.task_name]
        .replace("{{input}}", input)
        .replace("{{country}}", country);
}

promptBuillder.prototype.lawGenerator = function(input, country, caseType, analysis, extractedData){
    return prompts[this.task_name]
        .replace("{{input}}", input)
        .replace("{{country}}", country)
        .replace("{{case type}}", caseType)
        .replace("{{analysis}}", analysis)
        .replace("{{extracted data}}", JSON.stringify(extractedData));
}

promptBuillder.prototype.legalValidator = function(judgement, country){
    return prompts[this.task_name]
        .replace("{{judgement}}", judgement)
        .replace("{{country}}", country);
}

promptBuillder.prototype.aiEthicsAndBiasDetector = function(input){
    return prompts[this.task_name].replace("{{input}}", input);
}

promptBuillder.prototype.fallback = function(input, country){
    return prompts[this.task_name]
        .replace("{{input}}", input)
        .replace("{{country}}", country);
}

promptBuillder.prototype.responseBuilder = function(input, country){
    return prompts[this.task_name]
        .replace("{{input}}", input)
        .replace("{{country}}", country);
}

promptBuillder.prototype.getPrompt = function(kwargs){
    switch(this.task_name){
        case TASK_PLANNER:
            return this.taskPlanner(kwargs['Input'], kwargs['Country']);
        case TASK_CLASSIFIER_AND_COMPLEXITY_ANALYZER:
            return this.taskClassifierAndComplexityAnalyzer(kwargs['Input']);
        case QA_GENERATOR:
            return this.qaGenerator(kwargs['Input'], kwargs['Country']);
        case CASE_CATEGORIZER:
            return this.caseCategorizer(kwargs['Input'], kwargs['Country']);
        case LEGAL_FACT_EXTRACTOR:
            return this.legalFactExtractor(kwargs['Input'], kwargs['Country'], kwargs['CaseType']);
        case LEGAL_COMPLEXITY_EVALUATOR:
            return this.legalComplexityEvaluator(kwargs['Input'], kwargs['CaseType'], kwargs['Country']);
        case LEGAL_SENTIMENT_ANALYSER:
            return this.legalSentimentAnalyser(kwargs['Input'], kwargs['Country']);
        case LAW_GENERATOR:
            return this.lawGenerator(kwargs['Input'], kwargs['Country'], kwargs['CaseType'], kwargs['Analysis'], kwargs['ExtractedData']);
        case LEGAL_VALIDATOR:
            return this.legalValidator(kwargs['Judgement'], kwargs['Country']);
        case AI_ETHICS_AND_BIAS_DETECTOR:
            return this.aiEthicsAndBiasDetector(kwargs['Input']);
        case FALLBACK:
            return this.fallback(kwargs['Input'], kwargs['Country']);
        case RESPONSE_BUILDER:
            return this.responseBuilder(kwargs['Input'], kwargs['Country']);
        default:
            throw new Error(`Prompt type '${this.task_name}' not recognized.`);
    }
}

// var kwargs = {"Input":"Hi","Country":"Bye"}
// var a = new promptBuillder("Response_Builder");
// console.log(a.getPrompt(kwargs));

export default promptBuillder;