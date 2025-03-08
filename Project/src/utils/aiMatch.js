const axios = require('axios');

const matchdocuments  = async(documentText, storedDocuments)=>{

    const API_KEY = process.env.OPENAI_API_KEY;

    if(!API_KEY){
        console.log(err);
        return [];
    }

    const input = `Find the most similar document from the following dataset:\n\n${storedDocuments.join("\n\n")}\n\nDocument to match:\n${documentText}`

    try{
        const response = await axios.post("https://api.openai.com/v1/chat/completions",
            {
                mode:'gpt-4',
                messages:[{role:"user",content:input}]
            },
            {
                headers:{Authorization:`Bearer ${API_KEY}`}
            }
        )
        return response.data.choices[0].message.content;

    }catch(err){
        console.log(err)
        return [];

    }

}

module.exports = matchdocuments;