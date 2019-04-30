const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({disableEveryone: true});
const active = new Map();
bot.commands = new Discord.Collection();
let coins = require("./coins.json");
let xp = require("./xp.json");
let ops = {
  ownerID: '297460610466316288',
  active: active
}

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Commands Not Found! Sorry!");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on('ready', async () => {
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity('ppl hit girls', {type: "WATCHING"});
})

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = config.prefix
    if (!message.content.startsWith(`${prefix}`)) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args, ops);
})

bot.login(config.token)