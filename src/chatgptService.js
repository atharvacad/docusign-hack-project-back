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
            } ${text}`;

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

const sendToChatGPTWithQuery2 = async (text) => {
    try {
        console.error(' ChatGPT Input Text:', text);

        const query2 = `give me the Analyze the following Milestones Deliveriables data and provide insights for this ${text}.  Don't include any explanation in your response; rather, just generate the JSON object code. Json Object should look like this "overall_project_status": {
            "completed_milestones": [],
            "delayed_milestones": [],
            "at_risk_milestones": [],
            "on_track_milestones": [],
            "not_started_milestones": []
        },
        "areas_of_concern": {
            "delayed_audit": {
                "milestone": "",
                "issue": ""
            },
            "delayed_performance_metrics": {
                "milestone": "",
                "issue": ""
            },
            "final_milestone_dependency": {
                "milestone": "",
                "issue": ""
            }
        },
        "strengths": {
            "early_completion": [],
            "proactive_audit_preparation": ""
        },
        "recommendations": [
            {
                "action": "",
                "details": ""
            },
            {
                "action": "",
                "details": ""
            },
            {
                "action": "",
                "details": ""
            },
            {
                "action": "",
                "details": ""
            }
        ]
    } Provide me the AI insights for this data. Do Some ChatGPT AI analysis on this data.`;

    // console.error(' ChatGPT Input Text:', text);
    console.error(' ChatGPT Query:', query2);   

        const body = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": query2
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
        console.error(' ChatGPT:', gptResponse);
        return gptResponse;
    } catch (error) {
        console.error('Error sending data to ChatGPT:', error);
        throw error;
    }
};

const sendToChatGPTWithQuery3 = async (text) => {
    try {
        console.error(' ChatGPT Input Text:', text);

        const query3 = ` ${text}.  Don't include any explanation in your response; rather, just generate the JSON object code. Json Object should look like this {
        "overall_project_status": {
            "points": [
            ]
        },
        "areas_of_concern": {
            "points": [
            ]
        },
        "strengths": {
            "points": [
            ]
        },
        "recommendations": {
            "points": [
            ]
        },
        "overall_progress_status": {
            "points": [
            ]
        }
} Provide me the AI insights for this data. Do Some ChatGPT AI analysis on this data.`;

    // console.error(' ChatGPT Input Text:', text);
    console.error(' ChatGPT Query:', query3);   

        const body = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": query3
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
        console.error(' ChatGPT:', gptResponse);
        return gptResponse;
    } catch (error) {
        console.error('Error sending data to ChatGPT:', error);
        throw error;
    }
};

module.exports = { sendToChatGPT, sendToChatGPTWithQuery2,sendToChatGPTWithQuery3 };
