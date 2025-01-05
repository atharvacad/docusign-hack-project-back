const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const sendToChatGPT = async (text) => {
    try {
        const gptQuery = `\
Here is the text which contains milestones related data and delivery date, next part is the detailed steps along with its delivery date. Details steps names only no description need but take status, dates. Dont forgot to take details steps of each milestones along with dates and status. Don't include any explanation in your response; rather, just generate the JSON object code. Json Object should look like this {
"milestones": [
{
"name": "",
"delivery_date": "",
"status": "",
"detailed_steps": [
{
"name": "",
"status": "",
"date": ""
}
]
}
]
}.

${text}`;

        const body = {
            "model": "gpt-3.5-turbo-0125",
            "messages": [
                {
                    "role": "user",
                    "content": gptQuery
                }
            ]
        };

        const response = await axios({
            method: "post",
            url: "https://api.openai.com/v1/chat/completions",
            data: body,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const gptResponse = response.data.choices[0].message.content;

        return gptResponse;
    } catch (error) {
        console.error('Error sending data to ChatGPT:', error);
        throw error;
    }
};

module.exports = sendToChatGPT;