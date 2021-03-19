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


const Discord = require("discord.js");
const prefix = "rr!"

module.exports = {
	name: 'help',
	description: 'Returns information on a command, or lists commands.',
    aliases: ['help', '?', 'cmds', 'commands'],
    usage: "<command>",
	async execute(message, args) {
    
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const { commands } = message.client;

    if (!args.length) {
        
        let helpembed = new Discord.MessageEmbed()
        .setTitle('Command list')
        .setDescription(commands.map(command => command.name).join(', '))
        .setFooter(`Run ${prefix}help <command> to get information on a specific command!`);
        return message.channel.send(helpembed);
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
    
    if (!command) {
        return message.channel.send(`Couldn't find that command! Run ${prefix}help for a list of commands.`);
    }
    
    let helpembed2 = new Discord.MessageEmbed()
    .setTitle(`Command Help: ${command.name}`);   
    if (command.aliases) helpembed2.addField('Aliases',command.aliases.join(', '));
    if (command.description) helpembed2.addField('Description',command.description);
    if (command.usage) helpembed2.addField(`Usage`, `${prefix}${command.name} ${command.usage}` );
    helpembed2.setFooter(`School Simplified (c) 2021`);


    message.channel.send(helpembed2);
    
	},
};