/*
   Copyright 2021 School Simplified Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const database = require('./core/database')
const ms = require('ms');

var client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

dotenv.config();

(async () => {
    mongoose.connect(process.env.mongodb, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Connected to database!'));
})();



client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return; 
    if(!reaction.message.guild) return;

    const databaseEntry = await database.findOne({emoji_id: reaction.emoji.id});
    if(databaseEntry == null) return;   
    if(!databaseEntry.channel_id === reaction.message.channel.id) return;
    const role = reaction.message.guild.roles.cache.find(role => role.id === databaseEntry.role_id);

    await reaction.message.guild.members.cache.get(user.id).roles.add(role);

})

client.on('messageReactionRemove', async (reaction, user) => {
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(user.bot) return; 
    if(!reaction.message.guild) return;
    /* Todo: fix bug where bot doesn't remove role if the person got the role on a different startup. */
    const databaseEntry = await database.findOne({emoji_id: reaction.emoji.id});
    if(databaseEntry == null) return;
    if(!databaseEntry.channel_id === reaction.message.channel.id) return;
    const role = reaction.message.guild.roles.cache.find(role => role.id === databaseEntry.role_id);

    await reaction.message.guild.members.cache.get(user.id).roles.remove(role);
})


client.on('ready', () => {
    console.log('Bot online!')
})


const prefix = "rr!";


Object.size = function(obj) {
    var size = 0,
    key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
  

function fetchStatus() {
    const numstatus = client.ws.status;
    if(numstatus == 0) return "Ready";
    if(numstatus == 1) return "Connecting";
    if(numstatus == 2) return "Reconnecting";
    if(numstatus == 3) return "Idle";
    if(numstatus == 4) return "Nearly";
    if(numstatus == 5) return "Disconnected";
    if(numstatus == 6) return "Waiting for guilds";
    if(numstatus == 7) return "Identifying";
    if(numstatus == 8) return "Resuming";
    return "Could not fetch status.";
}


client.on('message', async message => {
    if(message.content === "<@!821455762408603658>") {
       const statusembed = new Discord.MessageEmbed()
       .setTitle('Bot information')
       .addFields(
	{ name: 'Client Uptime', value: ms(client.uptime, { long: true }) , inline: true },
        { name: 'Channels Being Held By Client', value: Object.size(client.channels) , inline: true },
        { name: 'Last Client Ready', value: client.readyAt , inline: true },    
        { name: 'Client User', value: client.user , inline: true }, 
        { name: 'Client Status', value: fetchStatus() , inline: true }, 
        )
        .setTimestamp();        
         message.channel.send(statusembed)
        return;     
    } 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let args = message.content.substring(prefix.length).split(" ")
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (message.channel.type === 'dm') return;
    try {
        command.execute(message, args);
    } catch (error) {
        const indexerror = new Discord.MessageEmbed()
            .setTitle("An error occured!")
            .setColor('BLUE')
            .setDescription(`Failed to execute file, ${message.author}. Developers have been notified!`)
            .setTimestamp();
        message.channel.send(indexerror);
    }
});

client.login(process.env.token);
