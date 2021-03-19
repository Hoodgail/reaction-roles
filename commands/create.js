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
var uuid = require("uuid");

    module.exports = {
        name: 'create',
        aliases: ['create', 'make'],
        usage: '<channel id> <role id> <emoji id>',
        description: 'Creates a reaction role!',
        async execute(message, args) {

        if (!message.member.permissions.has('ADMINISTRATOR')) return;
        
        const NaNEmbed = new Discord.MessageEmbed()
        .setTitle("Error")
        .setDescription('Failed to parse one of your arguments. Please make sure you are using IDs. \n ```ex. rr!create 818496005997461584 818885856029835287 821871097933725706 ```')
        .setFooter('School Simplified (c) 2021');

        if(isNaN(args[0])) return message.channel.send(NaNEmbed);
        if(isNaN(args[1])) return message.channel.send(NaNEmbed);
        if(isNaN(args[2])) return message.channel.send(NaNEmbed);

        var object_id = uuid.v4();        
                
        var object_id_check = await database.findOne({object_id: object_id});

        const reRunEmbed = new Discord.MessageEmbed()
        .setTitle('Error')
        .setDescription('Please re-run the command. Error: \n  ```An duplicate object ID was generated.```')
        .setFooter('School Simplified (c) 2021')
        

        if(object_id_check !== null) return message.channel.send(reRunEmbed);

        await database.create({object_id: object_id, channel_id: args[0], emoji_id: args[2], role_id: args[1]});

        const successEmbed = new Discord.MessageEmbed()
        .setTitle('Success')
        .setDescription(`Successfully created reaction role. \n \`\`\` Object ID: ${object_id}  \`\`\` `)
        .setFooter('School Simplified (c) 2021')
        

        message.channel.send(successEmbed);


        },
    };
