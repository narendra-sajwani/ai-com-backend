const OpenAI = require("openai");
const fs = require("fs");
require('dotenv').config()

// openai client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API
});

async function main() {
    const configObject = JSON.parse(fs.readFileSync('uploadedFileId.json', 'utf8'));
    const trainFileId = configObject.trainingFileId;
    const valFileId = configObject.validationFileId;
    const fineTuneJob = await openai.fineTuning.jobs.create({ training_file: trainFileId, validation_file: valFileId, model: 'gpt-3.5-turbo'});
}

main().catch(err => {
    console.log(err);
})