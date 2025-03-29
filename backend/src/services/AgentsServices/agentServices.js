import modelsHandler from "../LLMServices/modelsServices.js";
import promptBuillder from "../Prompts/promptBuilder.js";
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
    RESPONSE_BUILDER,
    TOTAL_AGENTS
    } = process.env;

const logger = {
    info: (agentName, data) => {
        console.log(`[${new Date().toISOString()}] [${agentName}] INFO:`, data);
    },
    error: (agentName, error) => {
        console.error(`[${new Date().toISOString()}] [${agentName}] ERROR:`, error);
    }
};

function AgentService(LLM) {
    this.model = new modelsHandler(LLM);
}

AgentService.prototype.extractValidJSON = function(response,agent) {
    return response;
    // logger.info(agent,response);
    // try {
    //     const match = response.match(/\{[\s\S]*\}/);
    //     if (!match){
    //         console.error(response)
    //         throw new Error("No valid JSON found");
    //     } 
        
    //     let cleanJSON = match[0].replace(/`/g, "");
    //     var cleanedResponse = JSON.parse(cleanJSON);
    //     // logger.info(agent,cleanedResponse);
    //     return cleanedResponse;
    // } catch (error) {
    //     console.error("JSON Parsing Error:", error.message);
    //     console.error(response)
    //     return null;
    // }
}

AgentService.prototype.runAgent = async function(kwargs) {
    try {
        var taskPlanner = new promptBuillder(TASK_PLANNER);
        const taskPlannerPrompt = taskPlanner.getPrompt(kwargs);
        
        return this.model.getHandler(taskPlannerPrompt)
            .then(async taskPlannerResponse => {
                const taskPlan = this.extractValidJSON(taskPlannerResponse,'Task Planner');
                let currentResponse = taskPlan;

                if (taskPlan[TASK_CLASSIFIER_AND_COMPLEXITY_ANALYZER]) {
                    var classifier = new promptBuillder(TASK_CLASSIFIER_AND_COMPLEXITY_ANALYZER);
                    const classifierPrompt = classifier.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(classifierPrompt);
                    currentResponse = this.extractValidJSON(response,'Task Classifier');
                }

                if (taskPlan[QA_GENERATOR]) {
                    var qaGenerator = new promptBuillder(QA_GENERATOR);
                    const qaPrompt = qaGenerator.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(qaPrompt);
                    currentResponse = this.extractValidJSON(response,"QA Generator");
                }

                if (taskPlan[CASE_CATEGORIZER]) {
                    var categorizer = new promptBuillder(CASE_CATEGORIZER);
                    const categorizerPrompt = categorizer.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(categorizerPrompt);
                    kwargs['CaseType'] = response;
                    currentResponse = this.extractValidJSON(response,'Case Categorizer');
                }

                if (taskPlan[LEGAL_FACT_EXTRACTOR]) {
                    var factExtractor = new promptBuillder(LEGAL_FACT_EXTRACTOR);
                    const extractorPrompt = factExtractor.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(extractorPrompt);
                    kwargs['ExtractedData'] = response
                    currentResponse = this.extractValidJSON(response,'Legal Fact Extractor');
                }

                if (taskPlan[LEGAL_COMPLEXITY_EVALUATOR]) {
                    var complexityEvaluator = new promptBuillder(LEGAL_COMPLEXITY_EVALUATOR);
                    const evaluatorPrompt = complexityEvaluator.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(evaluatorPrompt);
                    kwargs['Analysis'] = response;
                    currentResponse = this.extractValidJSON(response,'Legal Complexity Evaluator');
                }

                if (taskPlan[LEGAL_SENTIMENT_ANALYSER]) {
                    var sentimentAnalyzer = new promptBuillder(LEGAL_SENTIMENT_ANALYSER);
                    console.log(kwargs)
                    const analyzerPrompt = sentimentAnalyzer.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(analyzerPrompt);
                    currentResponse = this.extractValidJSON(response,'Legal Sentiment Analyzer');
                }

                if (taskPlan[LAW_GENERATOR]) {
                    var lawGenerator = new promptBuillder(LAW_GENERATOR);
                    const generatorPrompt = lawGenerator.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(generatorPrompt);
                    kwargs['Judgement'] = response;
                    currentResponse = this.extractValidJSON(response,'Law Generator');
                }

                if (taskPlan[LEGAL_VALIDATOR]) {
                    var validator = new promptBuillder(LEGAL_VALIDATOR);
                    console.log(kwargs)
                    const validatorPrompt = validator.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(validatorPrompt);
                    currentResponse = this.extractValidJSON(response,'Legal Validator');
                }

                if (taskPlan[AI_ETHICS_AND_BIAS_DETECTOR]) {
                    var ethicsDetector = new promptBuillder(AI_ETHICS_AND_BIAS_DETECTOR);
                    console.log(kwargs)
                    const detectorPrompt = ethicsDetector.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(detectorPrompt);
                    currentResponse = this.extractValidJSON(response,'AI Ethics and Bias Detector');
                }

                if (taskPlan[FALLBACK]) {
                    var fallback = new promptBuillder(FALLBACK);
                    console.log(kwargs)
                    const fallbackPrompt = fallback.getPrompt({...kwargs, previousResponse: currentResponse});
                    const response = await this.model.getHandler(fallbackPrompt);
                    currentResponse = this.extractValidJSON(response,'Fallback');
                }

                // Final response builder
                var responseBuilder = new promptBuillder(RESPONSE_BUILDER);
                console.log(kwargs)
                const builderPrompt = responseBuilder.getPrompt({...kwargs, previousResponse: currentResponse});
                const finalResponse = await this.model.getHandler(builderPrompt);
                const finalJSON = this.extractValidJSON(finalResponse,'Response Builder');
                console.log("Printing the final kwargs")
                console.log(kwargs)
                return finalJSON;
            })
            .catch(error => {
                logger.error('Task Plan', error);
                throw error;
            });
    } catch (error) {
        logger.error('RunAgent', error);
        throw error;
    }
};

var kwargs = {"Input":"The client's name is Arumugam, and his brother's name is Arunachalam. They are aged 35 and 32, respectively. Their father owned a 32-acre land acquired 20 years ago. After his demise, the brothers wish to split the land equally, but one part is pure agricultural land (17 acres), and the other is muddy. Both are fighting for the agricultural area. How can this case be resolved?","Country":"India"};
var LLM_TYPE = "GEMINI";

var agent = new AgentService(LLM_TYPE);
var response = await agent.runAgent(kwargs);
// logger.info("Final Response",response);