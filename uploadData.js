const OpenAI = require("openai");
const fs = require("fs");
require('dotenv').config()

// openai client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API
});

// upload training or validation data to openai
async function main() {
    if(process.argv[2] === "training_data") {
        const fileUploadObject = await openai.files.create({ file: fs.createReadStream('training_data.jsonl'), purpose: 'fine-tune' });
        const fileId = fileUploadObject.id;
        fs.readFile('uploadedFileId.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            let configData = JSON.parse(data);

            configData.trainingFileId = fileId;
        
            const updatedData = JSON.stringify(configData, null, 4);

            fs.writeFile('uploadedFileId.json', updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the file:', err);
                    return;
                }
                console.log('File has been updated.');
            });
        });
    } else if(process.argv[2] === "validation_data") {
        const fileUploadObject = await openai.files.create({ file: fs.createReadStream('validation_data.jsonl'), purpose: 'fine-tune' });
        const fileId = fileUploadObject.id;
        fs.readFile('uploadedFileId.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }

            let configData = JSON.parse(data);

            configData.validationFileId = fileId;
        
            const updatedData = JSON.stringify(configData, null, 4);

            fs.writeFile('uploadedFileId.json', updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the file:', err);
                    return;
                }
                console.log('File has been updated.');
            });
        });
    } else {
        console.log("Invalid argument");
    }
    
}

main().catch(err => {
    console.log(err);
})