const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

const prefix = '(!)';
client.on('message', message => {
  if (message.author.bot) return;
  if (message.channel.type !== 'text') return;

  sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
    if (!row) {
      sql.run('INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
    } else {
      let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 0));
      if (curLevel > row.level) {
        row.level = curLevel;
        sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that kewl?`);
      }
      sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
    }
  }).catch(() => {
    console.error;
    sql.run('CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)').then(() => {
      sql.run('INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
    });
  });

  if (!message.content.startsWith(prefix)) return;

  if (message.content.startsWith(prefix + 'level')) {
    sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
      if (!row) return message.reply('Your current level is 0');
      message.reply(`Your current level is ${row.level}`);
    });
  } else

  if (message.content.startsWith(prefix + 'points')) {
    sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
      if (!row) return message.reply('sadly you do not have any points yet!');
      message.reply(`you currently have ${row.points} points, good going!`);
    });
  }
});



client.on('ready', () => {
    client.user.setGame("(!)help On " + client.guilds.size + " servers!");
});

client.on('ready', () => {
    client.user.setStatus('online');
});

client.on("guildMemberAdd", member => {
	let guild = member.guild;
	sql.get(`SELECT * FROM data WHERE guildId = '${guild.id}'`).then(row => {
  if(!row.joinMessage === ""){
	  if(!row.joinlogsID === ""){
			let joinlog1 = bot.channels.find('name', row.joinlogsID);

			if(!joinlog1) return guild.defaultChannel.sendMessage(`Error 404`);
			guild.channels.get(joinlog1.id).sendMessage(`Welcome ${member.user} ${row.joinMessage}`);
		  return;
	  }
	  guild.defaultChannel.sendMessage(`Welcome ${member.user} ${row.joinMessage}`);

	  return;
  }

  })
});

client.on("guildMemberRemove", member => {
	let guild = member.guild;
	sql.get(`SELECT * FROM data WHERE guildId = '${guild.id}'`).then(row => {
  if(!row.leaveMessage === ""){
	  if(!row.joinlogsID === ""){
			let joinlog1 = bot.channels.find('name', row.joinlogsID);

			if(!joinlog1) return guild.defaultChannel.sendMessage(`Error 404`);

			guild.channels.get(joinlog1.id).sendMessage(`Bye Bye ${member.user} ${row.leaveMessage}`);

		  return;
	  }
	  guild.defaultChannel.sendMessage(`Bye Bye ${member.user} ${row.leaveMessage}`);

	  return;
  }

  })
});

client.on("guildCreate", guild => {

  console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user.username}`);

});

client.on('message', msg => {
  if (msg.author.bot) return;
  if(!msg.content.startsWith(config.prefix)) return;

let command = msg.content.split(" ")[0];
command = command.slice(config.prefix.length);

sql.get(`SELECT * FROM data WHERE guildId = '${msg.guild.id}'`).then(row => {
	if(msg.guild.id === row.guildId){
		if(!row.customPrefix === ""){

			command = command.slice(row.customPrefix.length);

		}

	}

});

let args = msg.content.split(" ").splice(1);

if(command === 'add'){
        let numArray = args.map(n=> parseInt(n));
        let total = numArray.reduce( (p, c) => p+c);
        msg.channel.send(total);
    }


if (command === "say") {
  let modRole = msg.guild.roles.find("name", "Moderator");
  if(msg.member.roles.has(modRole.id)) {
  msg.channel.send(args.join(" "));
} else {
  msg.reply("You Don't have the permissions to use this command!");
}
}

if (command === "kick") {
  let modRole = msg.guild.roles.find("name", "Moderator");
  if(!msg.member.roles.has(modRole.id)) {
return msg.reply("You don't have the permission to use this command!");
if(!modRole) return;
  }
if(msg.mentions.users.size === 0) {
  return msg.reply("Please Mention A user to kick!");
}
let kickMember = msg.guild.member(msg.mentions.users.first());
if(!kickMember) {
  return msg.reply("That user does not seem valid");
}
if(!msg.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
  return msg.reply("I don't have the permissions (KICK_MEMBERS) to do this.");
}
kickMember.kick();
  }

  if (command === "ban") {
    let modRole = msg.guild.roles.find("name", "Administrator");
    if(!msg.member.roles.has(modRole.id)) {
  return msg.reply("You don't have the permission to use this command!");
  if(!modRole) return;
    }
  if(msg.mentions.users.size === 0) {
    return msg.reply("Please Mention A user to ban!");
  }
  let banMember = msg.guild.member(msg.mentions.users.first());
  if(!banMember) {
    return msg.reply("That user does not seem valid");
  }
  if(!msg.guild.member(client.user).hasPermission("BAN_MEMBERS")) {
    return msg.reply("I don't have the permissions (BAN_MEMBERS) to do this.");
  }
  banMember.ban();
    }


if (command === "help") {msg.author.sendEmbed(new Discord.RichEmbed().setColor(0x00FF00).addField(config.prefix + "help", "You're in it right now! Gives you a list of commands!").addField(config.prefix + "ping", "Reply's with pong! Cool, huh? :)").addField(config.prefix + "foo", "Reply's with Bar!").addField(config.prefix + "tongue", "Reacts a person sticking out their tongue.").addField(config.prefix + "requesthelp", "Sends a DM to the server that says you need help!").addField(config.prefix + "8ball", "Tells your future.").addField(config.prefix + "invite", "Invites Wired to your server! ").addField(config.prefix + "serverinvite", "Gives you the Wired server!").addField(config.prefix + "stats", "Shows the stats of Wired").addField(config.prefix + "kick @user", "Kicks the user who you tag... Requires Moderator role").addField(config.prefix + "ban @user", "Bans the user who you tag... Requires Administrator role").addField(config.prefix + "settings", "Let's you configure the settings of wired (Not Stable)"))
 } else


 if (command === "invite") {msg.author.send('https://discordapp.com/oauth2/authorize?client_id=315323312379133972&scope=bot&permissions=2146958591')
  } else


  if(command === "8ball")
{
    msg.reply(':8ball: Your answer is: ' + doMagic8BallVoodoo());
}

function doMagic8BallVoodoo() {
    var rand = ['Yes', 'No', 'It is certain.', 'What do you think? NO', 'Maybe', 'Never', 'Yep', 'In the future.'];

    return rand[Math.floor(Math.random()*rand.length)];
}


  if (command === "ping") {
    msg.channel.send("pong!");
  } else

  if (command === "tongue") {
    msg.channel.send(":stuck_out_tongue:");
  } else

  if (command === "requesthelp") {
    msg.guild.owner.send(`Someone needs your help!!`)
  } else

  if (command === "idea"){
    if(msg.guild.id !== "315585488540925955") return;
    msg.react("✅")
    msg.react("❌")
}


  if (command === "mcqueen") {
    msg.channel.send("Kachow!!");
  } else

  if(command === "mcqueenpics")
{
    msg.reply(':grin: Here\'s your picture! ' + mcqueenpicgather());
}

function mcqueenpicgather() {
    var rand = ['https://upload.wikimedia.org/wikipedia/en/2/27/LightningMcQueen.jpg', 'https://i.ytimg.com/vi/kLAnVd5y7M4/maxresdefault.jpg', 'https://cdn0.vox-cdn.com/thumbor/L6jLuU0zWbVkbs2Sj0wFlUKenwY=/434x0:1858x801/1600x900/cdn0.vox-cdn.com/uploads/chorus_image/image/52679299/lightning_mcqueen.0.jpg', 'https://img.clipartfest.com/b8827585422d6195a4d0d85344b68012_showing-post-media-for-lightening-mcqueen-cartoon-www-lightning-mcqueen-cartoon_1920-1080.jpeg', 'https://vignette2.wikia.nocookie.net/disney/images/2/24/Ha.jpg/revision/latest?cb=20131207161813', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw08tSWhsl5cQO74Diyi23e0h-mTBaLGdpp76w1HPE2aAqaX0M', 'Kachow', 'Vroom Vroom!'];

    return rand[Math.floor(Math.random()*rand.length)];
}


  if (command === "serverinvite") {
    msg.channel.send("Sooo... You want to see our server? The code is: 92AdcuY ");
  } else

  if (command === "stats"){

    let os = require('os')

    msg.channel.sendEmbed(new Discord.RichEmbed().setTitle(":desktop: Wired Bot Status :bar_chart:").addField("client name:", client.user.username + "#" + client.user.discriminator + " (" + client.user.id + ")", true).addField("Library", "discord.js").addField('Guilds', client.guilds.size, true).addField('Visible Users', client.users.size, true).addField("Visible Channels", client.channels.size, true).addField('Memory', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB", true).addField("Uptime", (Math.round(client.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(client.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(client.uptime / 1000) % 60) + " seconds.", true).addField("Home Directory", os.homedir()).addField("Ping", client.ping, true).setThumbnail(client.user.avatarURL).setColor(0x4286f4).setFooter("Command made by FireMario211"))
}


  if(msg.channel.type === 'dm'){
  msg.reply('I cannot respond with DMs!')
  return;
  }
  if(command === "restart"){
  if(msg.author.id !== "263136043996282880") return;
  process.exit()
  }

  if (command === "foo") {
    msg.channel.send("bar!");
  }

if (command === "settings"){
    if(!msg.member.hasPermission('ADMINISTRATOR')){
msg.reply("You have no permissions!")
return;
}
	let category = args[0]
	if(!category){
		msg.channel.sendEmbed(new Discord.RichEmbed()
		.setTitle("Settings Menu")
		.addField("Edit", "(!)settings edit allows you to edit certain features")
		.addField("Current Features", "Custom Prefix, Custom Join/Leave msg, Join log channel")
		.setColor(0x00FF00))
		return;
	}

	if(category === "edit"){
		let editcategory = args[1]
		if(!editcategory){
		msg.channel.sendEmbed(new Discord.RichEmbed()
		.setTitle("Edit Settings Menu")
		.addField("Editable Features", "(!)settings edit custom_prefix (prefix with no spaces) is a feature, (!)settings edit join_msg (your msg with spaces, do not put a mention, it will say Welcome @user (your msg)), (!)settings edit leave_msg (your msg with spaces, do not put a mention, it will say Bye @user (your msg)), (!)settings edit joinlogs #channel")
		.addField("Current Features", "Custom Prefix, Custom Join/Leave msg, Join log channel")
		.setColor(0x00FF00))
		return;
		}
		if(editcategory === "custom_prefix"){
			let customprefix1 = args[2]


			if(!customprefix1) return msg.reply("Please input this: (!)settings edit custom_prefix (your prefix)")

			sql.get(`SELECT * FROM data WHERE guildId = '${msg.guild.id}'`).then(row => {
				if (!row) {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, "", customprefix1, "", ""]);
					msg.reply("Successfully put your data in the Database!\nPlease type the command again to edit!")
				} else {

					sql.run(`UPDATE data SET customPrefix = ${row.customPrefix = customprefix1} WHERE guildId = ${msg.guild.id}`);
					msg.reply("Successfully set prefix to " + customprefix1 + "!")
				}
			}).catch(() => {
				console.error;
				sql.run('CREATE TABLE IF NOT EXISTS data (guildId TEXT, joinlogsID TEXT, customPrefix TEXT, joinMsg TEXT, leaveMsg TEXT)').then(() => {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, "", customprefix1, "", ""]);
					msg.reply("Created Table: `data` and put information in `data.sqlite`!\nPlease type in the command again to set it")
				});
			});

			return;
		}

		if(editcategory === "join_msg"){

			let joinmsg = args.splice(2).join(' ');


			if(joinmsg < 1) return msg.reply("Please input this: (!)settings edit join_msg (yourmsg)")

			sql.get(`SELECT * FROM data WHERE guildId = '${msg.guild.id}'`).then(row => {
				if (!row) {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, "", "", joinMsg, ""]);
					msg.reply("Successfully put your data in the Database!\nPlease type the command again to edit!")
				} else {

					sql.run(`UPDATE data SET joinmsg = ${row.joinMssg = joinmsg} WHERE guildId = ${msg.guild.id}`);
					msg.reply("Successfully set Join msg to " + joinmsg + "!")
				}
			}).catch(() => {
				console.error;
				sql.run('CREATE TABLE IF NOT EXISTS data (guildId TEXT, joinlogsID TEXT, customPrefix TEXT, joinMsg TEXT, leaveMsg TEXT)').then(() => {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, "", "", joinMsg, ""]);
					msg.reply("Created Table: `data` and put information in `data.sqlite`!\nPlease type in the command again to set it")
				});
			});

			return;
		}

		if(editcategory === "leave_msg"){

			let leavemsg = args.splice(2).join(' ');

			if(leavemsg < 1) return msg.reply("Please input this: (!)settings edit leave_msg (yourmsg)")
			sql.get(`SELECT * FROM data WHERE guildId = '${msg.guild.id}'`).then(row => {
				if (!row) {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, "", "", "", leaveMsg]);
					msg.reply("Successfully put your data in the Database!\nPlease type the command again to edit!")
				} else {

					sql.run(`UPDATE data SET leavemsg = ${row.leaveMsg = leavemsg} WHERE guildId = ${msg.guild.id}`);
					msg.reply("Successfully set Left msg to " + leavemsg + "!")
				}
			}).catch(() => {
				console.error;
				sql.run('CREATE TABLE IF NOT EXISTS data (guildId TEXT, joinlogsID TEXT, customPrefix TEXT, joinMsg TEXT, leaveMsg TEXT)').then(() => {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, "", "", "", leaveMsg]);
					msg.reply("Created Table: `data` and put information in `data.sqlite`!\nPlease type in the command again to set it")
				});
			});

			return;
		}

		if(editcategory === "joinlogs"){


			let joinlogargs = args[2]
			if(!joinlogargs){
				msg.reply("Please input this: (!)settings edit joinlogs (yourchannel)")
				return;
			}

			let joinlog1 = client.channels.find('name', joinlogargs);

			if(!joinlog1) return msg.reply(joinlogargs + " doesn't exist! Or I cannot see it!")

			sql.get(`SELECT * FROM data WHERE guildId = '${msg.guild.id}'`).then(row => {
				if (!row) {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, joinlog1.id, "", "", ""]);
					msg.reply("Successfully put your data in the Database!\nPlease type the command again to edit!")
				} else {

					sql.run(`UPDATE data SET joinlogsID = ${row.joinlogsID = joinlog1.id} WHERE guildId = ${msg.guild.id}`);
					msg.reply("Successfully set Join Logs to <#" + joinlog1.id + ">!")
				}
			}).catch(() => {
				console.error;
				sql.run('CREATE TABLE IF NOT EXISTS data (guildId TEXT, joinlogsID TEXT, customPrefix TEXT, joinMsg TEXT, leaveMsg TEXT)').then(() => {
					sql.run('INSERT INTO data (guildId, joinlogsID, customPrefix, joinMsg, leaveMsg) VALUES (?, ?, ?, ?, ?)', [msg.guild.id, joinlog1.id, "", "", ""]);
					msg.reply("Created Table: `data` and put information in `data.sqlite`!\nPlease type in the command again to set it")
				});
			});


	return;
		}






	}
}



});

client.login(config.token);
