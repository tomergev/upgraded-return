require('dotenv').config()

const axios = require('axios')
const params = { 
  api_key: process.env.GIPHY_API_KEY,
  limit: 1,   
}

const fetch = async () => {
  try {
    const res = await axios.get('https://api.giphy.com/v1/gifs/trending', { params })
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}
fetch()