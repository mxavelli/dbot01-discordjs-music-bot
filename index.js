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

const commandsHelp = `
Available commands:

Play music:
/music play URL
ex:
/music play https://www.youtube.com/watch?v=iBYndEtOVv4

Stop music:
/music stop

Pause music:
/music pause

Resume current music:
/music resume

/music help 
`;

const unknownCommandText = `Unknown command.\n${commandsHelp}`;
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.split(' ')
  const { guildId } = message;
  if (!args[1]) return message.channel.send(unknownCommandText);
  switch (args[1]) {
    case 'play':
      if (args[2]) {
        message.channel.send(`Playing ${args[2]}`)
        try {
          client.DisTube.play(message.member.voice.channel, args[2], {
            member: message.member,
            textChannel: message.channel,
            message,
            skip: true,
          })
        } catch (error) {
          console.log(error.toString())
        }
      }
      break;
    case 'pause':
      message.channel.send(`Pausing...`)
      client.DisTube.pause(guildId)
      break;
    case 'resume':
      message.channel.send('Resuming...')
      client.DisTube.resume(guildId)
      break;
    case 'stop':
      message.channel.send(`Stopping...`)
      client.DisTube.stop(guildId)
      break;
    case 'help':
      message.channel.send(commandsHelp);
      break;
    default:
      message.channel.send(unknownCommandText)
      console.log('Not implemented');
  }



});

client.login(config.token);
