//Written by Zenegrad / Kyle Murphy
//9-25-2019 last updated

const Discord = require('discord.js');
const client = new Discord.Client();

var assignedChannel;
var regexPattern = /(~\S+).(\S+).(.*)/;

if(client.guilds)
client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
});


//Calls this function when a message is sent on discord
client.on('message', (receivedMessage) => {

  //Switch this to regex so it finds the key words.
  let messageArguments = receivedMessage.content.match(regexPattern);

  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }
  
  //Checks to make sure the message is sent in the assigned channel. (If there is one).
  if(receivedMessage.channel == assignedChannel || assignedChannel == null){
    try{
      //Checks to make sure the message is actually a command so the bot doesnt break for reg messages. 
      if(receivedMessage.content.charAt(0) == "~"){
        console.log(messageArguments);
        console.log("first arg: ", messageArguments[1]);
        //call the right heckin method
        if(messageArguments[1].toLowerCase() == "~dm " || messageArguments[1].toLowerCase() == "~dm"){
          dmCommand(receivedMessage);
        }
        else if(receivedMessage.content.substring(0, 14).toLowerCase() == "~assignchannel"){
          assignChannel(receivedMessage);
        }
        else{
          console.log("Invalid input: ", messageArguments[0]);
        }
      } 
    }
    catch(error){
      console.log("Some noob put a space between ~ and dm....");
      receivedMessage.channel.send("Somethings not right... make sure you used the correct command format! ``~dm  @role  message``");

    }
  }
});

//Returns the role ID from a mention/ping
function getIdFromMention(mention){

  //Role parse.
  if(mention.startsWith('<@&') && mention.endsWith('>')){
    mention = mention.slice(3,-1);
    
    //@here @everyone parse.
    if(mention.startsWith('!')){
      mention = mention.slice(1);
    }
    return mention;
  }
  return null;
}

//Returns ID of pinged channels
function getChannelId(mention){
  
  if(mention.startsWith('<#') && mention.endsWith('>')){
    mention = mention.slice(2,-1);
    return mention;
  }

  return null;
}
//Function that handles ~dm command (sends a DM to all members involved)
function dmCommand(receivedMessage){
  var messageArguments = receivedMessage.content.split(" ");
  var rolesListed = [];
  var message = "";

  console.log(messageArguments[0]);
  //DM Command
  if(messageArguments[0].toLowerCase() === "~dm"){
    
    //makes sure the command has correct number of args
    if(messageArguments.length >= 3){

      //gets the @roles ready for parsing
      for(var index = 0; index < messageArguments.length; index++){

        if(messageArguments[index].startsWith('<@&')){
          rolesListed.push(messageArguments[index]);
          console.log("Roles listed: ", rolesListed);
        }
        //If it isnt a role and isnt the first command (~dm) then it has to be part of the message.
        else if(index >= 2 && !messageArguments[index].startsWith('<@')){
          message += messageArguments[index] + ' ';
        }
      }
      
      //User[] of all the users with the role
      var membersWithRole = [];

      //Doesnt kill the bot if it hits an error.
      try{
        //Finds all users with the roles pinged.
        for(var i = 0; i < rolesListed.length; i++){
          try{
            membersWithRole = membersWithRole.concat(receivedMessage.guild.roles.get(getIdFromMention(rolesListed[i])).members.map(m=>m.user));
          }catch(error){
            console.error(error);
          }
        }

        //loops through membersWithRole and sends them a message, if blocked will send a message back in the channel saying who blocked the bot.
        for(var i = 0; membersWithRole.length > i; i++){
          let username = membersWithRole[i].username;
          
          membersWithRole[i].send(message).catch(error => {
            if(error.code === 50007){
              receivedMessage.channel.send(username + " has blocked the bot.");
            }
          });
            
        }
      }catch(e){
        console.error(e);
        receivedMessage.channel.send("Somethings not right... make sure you used the correct command format! ``~dm @role message``");
      }
    }
  }
}

function assignChannel(receivedMessage){
  var channelArray;
  var pingedChannel;
  var channelCount = 0;
  let messageArguments = receivedMessage.content.split(" ");
 
  //checks prefixs
  if(messageArguments[0].toLowerCase() == "~assignchannel"){
    console.log("message args: " , messageArguments.length);
    switch(messageArguments.length){
      case 1: 
        assignedChannel = receivedMessage.channel;
        break;
      
      //If assignChannel command has a second paramater get the channel
      case 2: 
        pingedChannel = getChannelId(messageArguments[1]);
        
        try{
          channelArray = receivedMessage.guild.channels;
        }catch(error){
          console.log(error);
        }

        //Gets all channels and looks for only text channels and which channel has the same ID as the pinged channed in recievedMessage.
        channelArray.forEach(TextChannel => {
          if(TextChannel.type == 'text'){
            if(TextChannel.id == pingedChannel)
            assignedChannel = TextChannel;
          }
        });
        break;
    }
    receivedMessage.channel.send("Assigned " + assignedChannel.name + " for all future bot commands.");
  }
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const bot_secret_token = "";

client.login(bot_secret_token);
