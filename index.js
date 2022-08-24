const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube')
const config = require('./config.json')
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ] });

client.DisTube = new DisTube(client, { 
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
})
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  
  const args = message.content.split(' ')
  switch (args[1]) {
    case 'play':
      if (args[2]) {
        message.channel.send(`Playing ${args[2]}`)
        client.DisTube.play(message.member.voice.channel, args[2], {
          member: message.member,
          textChannel: message.channel,
          message
        })
      }
      break;
    case 'pause':
      message.channel.send(`Pausing...`)
      client.DisTube.pause(message.guildId)
      break;
    case 'resume':
      message.channel.send('Resuming...')
      client.DisTube.resume(message.guildId)
      break;
    case 'stop':
      message.channel.send(`Stopping...`);
      client.DisTube.stop(message.guildId)
      break;
    default:
      console.log('Not implemented');
  }
  
  

});

client.login(config.token);