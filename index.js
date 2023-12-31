require('dotenv').config()

const { 
  Client, 
  Collection,
  Events, 
  GatewayIntentBits,
  REST, 
  Routes, 
  SlashCommandBuilder,
} = require('discord.js')
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits

try {
  const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] })
  
  client.login(process.env.DISCORD_TOKEN_SECRET)
  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })
  
  const pingCommand = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction) {
      await interaction.reply('Pong!')      
    },
  }
  const pingSecretCommand = {
    data: new SlashCommandBuilder().setName('secret').setDescription('Replies with Secret Pong!'),
    async execute(interaction) {
      await interaction.reply({ content: 'Secret Pong!', ephemeral: true })
    },
  }
  const pingAgainCommand = {
    data: new SlashCommandBuilder().setName('again').setDescription('Replies with Pong! and then Pong Again!'),
    async execute(interaction) {
      await interaction.reply('Pong!')
      await sleep(2000)
      await interaction.editReply('Pong again!')
    },
  }
  const choiceCommand = {
    data: new SlashCommandBuilder()
      .setName('choices')
      .setDescription('Select A, B, or C')
      .addStringOption((option) =>
        option.setName('category')
          .setDescription('A, B, or C')
          .setRequired(true)
          .addChoices(
            { name: 'A', value: 'a' },
            { name: 'B', value: 'b' },
            { name: 'C', value: 'c' },
          )
      ),
      async execute(interaction) {
        const category = interaction.options.getString('category')
        console.log(category)
        await interaction.reply(`Category selected: ${category}`)
      }
  }
  const subCommand = {
    data: new SlashCommandBuilder()
      .setName('subcommand')
      .setDescription('Get info about a user or a server!')
      .addSubcommand((subcommand) =>(
        subcommand
          .setName('user')
          .setDescription('Info about a user')
          .addUserOption(option => option.setName('target').setDescription('The user'))
      ))
      .addSubcommand((subcommand) =>(
        subcommand
          .setName('server')
          .setDescription('Info about the server')
      )),
  }
  const autoCompleteCommand = {
    data: new SlashCommandBuilder()
      .setName('autocomplete')
      .setDescription('Search discordjs.guide!')
      .addStringOption((option) =>
        option.setName('query')
          .setDescription('Phrase to search for')
          .setAutocomplete(true)
      )
  }
  const chatGptCommand = {
    data: new SlashCommandBuilder()
      .setName('chatgpt')
      .setDescription('What would you like to know?')
      .addStringOption((option) =>(
        option.setName('prompt')
          .setDescription('What would you like to ask me?')
          .setRequired(true)
      )),
      async execute(interaction) {
        const prompt = interaction.options.getString('prompt')
        await interaction.reply(`This was your prompt: ${prompt}`)
      },
  }

  client.commands = new Collection()
  client.commands.set(pingSecretCommand.data.name, pingSecretCommand)
  client.commands.set(pingAgainCommand.data.name, pingAgainCommand)
  client.commands.set(pingCommand.data.name, pingCommand)
  client.commands.set(choiceCommand.data.name, choiceCommand)
  client.commands.set(subCommand.data.name, subCommand)
  client.commands.set(autoCompleteCommand.data.name, autoCompleteCommand)
  client.commands.set(chatGptCommand.data.name, chatGptCommand)
  
  const rest = new REST().setToken(process.env.DISCORD_TOKEN_SECRET)
  const guildId = '1131699017898803391'
  rest.put(
    Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, guildId),
    { 
      body: [
        pingCommand.data,
        pingSecretCommand.data,
        pingAgainCommand.data,
        choiceCommand.data,
        autoCompleteCommand.data,
        chatGptCommand.data,
      ]
    },
  )

  client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return
  
    const command = interaction.client.commands.get(interaction.commandName)
  
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }
  
    command.execute(interaction).catch((err) => console.error(err))
  })

} catch (err) {
  console.error(err)
}

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

// const { Configuration, OpenAIApi } = require('openai')
// const configuration = new Configuration({
//     organization: 'org-LdGf0GJuqZWkSR8buj7OKJCz',
//     apiKey: process.env.OPENAI_API_KEY,
// })
// const openai = new OpenAIApi(configuration)

// const generateText = async () => {
//   try {
//     const completion = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages: [{
//         role: 'system', 
//         content: 'Write me a catchy twitter post about javascript array methods with emojis' 
//       }],
//     })
//     console.log(completion)
//   } catch (err) {
//     console.error(err)
//   }
// }
// generateText()


// // const { TwitterApi } = require('twitter-api-v2')
// // const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)
// const axios = require('axios')
// const crypto = require('crypto')
// const OAuth = require('oauth-1.0a')

// const getOAuth1aAuthorizationHeader = (url, method, data) => {
//   const oauth = OAuth({
//     consumer: { 
//       key: process.env.TWITTER_API_KEY, 
//       secret: process.env.TWITTER_API_KEY_SECRET,
//     },
//     hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64'),
//     signature_method: 'HMAC-SHA1',
//   })

//   const token = {
//     key: process.env.TWITTER_ACCESS_TOKEN,
//     secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//   }

//   const requestData = { url, method, data }
//   const authorization = oauth.authorize(requestData, token)

//   return oauth.toHeader(authorization)
// }

// const tweet = async () => {
//   try {
//     // const res = await twitterClient.v2.tweet('My tweet text with two images!')
//     // console.log(twitterClient)


//     // const url = 'https://api.twitter.com/2/tweets'
//     // const headers = {
//     //   'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
//     //   'Content-Type': 'application/json'
//     // }
//     // const data = {
//     //   text: 'First tweet!'
//     // }
//     // const response = await axios.post(url, data, { headers })
//     // console.log(response)

//     const data = { text: 'First Tweet' }
//     const url = 'https://api.twitter.com/2/statuses/update'
//     const headers = getOAuth1aAuthorizationHeader(url, 'POST', data)

//     const response = await axios.post(url, data, { headers })
//     console.log(response)
//   } catch (err) {
//     console.error(err)
//   }
// }
// tweet()
