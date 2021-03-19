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

const mongoose = require('mongoose');
const Discord = require('discord.js')
const database = require('../core/database')
const fs = require('fs');


module.exports = {
    name: 'edit',
    aliases: ['edit'],
    usage: '<object id> <new channel id> <new role id> <new emoji id>',
    description: 'Edits a reaction role',
    async execute(message, args) {

        
    if (!message.member.permissions.has('ADMINISTRATOR')) return;

    const databaseEntry = await database.findOne({object_id: args[0]});

    const notFoundEmbed = new Discord.MessageEmbed()
    .setTitle("Error")
    .setDescription(`Could not find a reaction role with the Object ID **${args[0]}**. Please re-run the command, with a valid Object ID.`)
    .setFooter('School Simplified (c) 2021');

    if(databaseEntry == null) return message.channel.send(notFoundEmbed)

    const NaNEmbed = new Discord.MessageEmbed()
    .setTitle("Error")
    .setDescription('Failed to parse one of your arguments. Please make sure you are using IDs. \n ```ex. rr!edit b0773828-3623-4ba1-8fa3-862740ecafb2 818496005997461584 818885856029835287 821871097933725706 ```')
    .setFooter('School Simplified (c) 2021');

    if(isNaN(args[1])) return message.channel.send(NaNEmbed);
    if(isNaN(args[2])) return message.channel.send(NaNEmbed);
    if(isNaN(args[3])) return message.channel.send(NaNEmbed);


    databaseEntry.deleteOne();

    await database.create({object_id: args[0], channel_id: args[1], emoji_id: args[3], role_id: args[2]});

    const successEmbed = new Discord.MessageEmbed()
    .setTitle('Success')
    .setDescription(`Successfully updated reaction role.`)
    .setFooter('School Simplified (c) 2021')

    message.channel.send(successEmbed);


    },
};
