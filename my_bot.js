const Discord = require('discord.js');
const client = new Discord.Client();

var assignedChannel;
var regexPattern = new RegExp('(~\S+).(\S+).(.*)');

if(client.guilds)
client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    //console.log(client.guilds.tap(roles => console.log(roles.id)))
});


//Calls this function when a message is sent on discord
client.on('message', (receivedMessage) => {
  //Switch this to regex so it finds the key words.
  var messageArguments = receivedMessage.content.split("|");

  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }
  
  //Checks to make sure the message is sent in the assigned channel.
  if(receivedMessage.channel.id == assignedChannel || assignedChannel == null){  
    switch(messageArguments[0]){
      case "~dm":
      case "~dm ":
        dmCommand(receivedMessage);
        break;

      case "~assignChannel":
        assignChannel(receivedMessage);
        break;
    }
  }
});

//Finds the role ID from a mention/ping
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

//Function that handles ~dm command (sends a DM to all members involved)
function dmCommand(receivedMessage){
  
  var messageArguments = receivedMessage.content.split(regexPattern);

  //DM Command
  if(messageArguments.group(0) === "~dm"){
        
    //makes sure the command has correct number of args
    if(len(messageArguments.groups()) === 3){

      console.log("Recieved command");
      //gets the @roles ready for parsing
      let rolesListed = messageArguments.group(1).trim().split(" ");
      
      //User[] of all the users with the role
      let membersWithRole;

      //Doesnt kill the bot if it hits an error.
      try{
        //Finds all users with the roles pinged.
        for(var i = 0; i < rolesListed.length; i++){
          try{
            membersWithRole = receivedMessage.guild.roles.get(getIdFromMention(rolesListed[i])).members.map(m=>m.user);

          }catch(error){
            console.error(error);
          }
        }

        //loops through membersWithRole and sends them a message, if blocked will send a message back in the channel saying who blocked the bot.
        for(var i = 0; membersWithRole.length > i; i++){
          let username = membersWithRole[i].username;

          
          membersWithRole[i].send(messageArguments.group(2)).catch(error => {
            if(error.code === 50007){
              receivedMessage.channel.send(username + " has blocked the bot.");
            }
          });
            
        }
      }catch(e){
        console.error(e);
        receivedMessage.channel.send("Somethings not right... make sure you used the correct command format! ``~dm | @role | message``");
      }
    }
  }
}

function assignChannel(receivedMessage){
  
  //Figure out fucking regex properly.
  receivedMessage.split(" ");
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const bot_secret_token = "NjEyMTM5MTI2NjUyOTI4MDE3.XXnX2g.KGkpEwowRHHg4H874feqOQZEQqw";

client.login(bot_secret_token);
