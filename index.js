require('dotenv').config()

// const axios = require('axios')
// const params = { 
//   api_key: process.env.GIPHY_API_KEY,
//   limit: 1,   
// }

// const fetch = async () => {
//   try {
//     const res = await axios.get('https://api.giphy.com/v1/gifs/trending', { params })
//     console.log(res)
//   } catch (err) {
//     console.log(err)
//   }
// }
// fetch()

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
    organization: 'org-LdGf0GJuqZWkSR8buj7OKJCz',
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const generateText = async () => {
  try {
    // const res = await openai.listEngines()
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system', 
          content: 'Write me a catchy twitter post about javascript array methods with emojis' 
        }, 
      ],
    })
    console.log(completion)
  } catch (err) {
    console.error(err)
  }
}
generateText()
