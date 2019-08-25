const Discord = require('discord.js')
const client = new Discord.Client()

if(client.guilds)
client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    //console.log(client.guilds.tap(roles => console.log(roles.id)))
})

//Finds the role ID from a mention/ping
function getIdFromMention(mention){

  if(mention.startsWith('<@&') && mention.endsWith('>')){
    mention = mention.slice(3,-1);

    if(mention.startsWith('!')){
      mention = mention.slice(1);
    }
    return mention;
  }
  return null;
}

//Calls this function when a message is sent on discord
client.on('message', (receivedMessage) => {
    var messageArguments = receivedMessage.content.split("|");

    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return;
    }
    
    //makes sure the command has correct number of args
    if(messageArguments.length === 3){

      //checks for the correct prefix for command
      if(messageArguments[0] === "~dm" || messageArguments[0] === "~dm "){
        console.log("Recieved command");
        //gets the @roles ready for parsing
        let rolesListed = messageArguments[1].trim().split(" ");
        
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

            
            membersWithRole[i].send(messageArguments[2]).catch(error => {
              if(error.code === 50007){
                receivedMessage.channel.send(username + " has blocked the bot.");
              }
            });
              
          }
        }catch(e){
          console.error(e)
          receivedMessage.channel.send("Somethings not right... make sure you used the correct command format! ``~dm | @role | message``");
        }
        
      }
  }
  else{
    receivedMessage.channel.send("Incorrect number of arguments. ``~dm | @role | message``");
  }
})

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const bot_secret_token = "NTgxNTU2OTg2NzM5Njg3NDg4.XOg_iA.BWlCehG2-v9XSbV1HgPzLnejysA"

client.login(bot_secret_token)
