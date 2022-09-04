const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	]
});

const Gamedig = require('gamedig');
const { token, channelID, ip, port } = require('./config.json');

client.on('ready', async () => {
    channel = client.channels.cache.get(channelID)

    await channel.bulkDelete(1, true)
	status = await channel.send('🤔')

	task = () => {
		Gamedig.query({
			type: 'garrysmod',
			host: ip,
			port: port,
		}).then((state) => {
			var playerList = ""

			if (state.raw.numplayers == 0) {
				playerList = " 🔸 There is no one on the server 😥"
			}
				    
			for (var i = 0; i < state.players.length; i++) {
				if (!state.players[i].name) {
					state.players[i].name = "*Connecting ...*"
				}

				playerList = playerList + "\n 🔹 " + state.players[i].name
			}

			let embedSatus = new MessageEmbed()
				.setTitle("🟢 " + state.name)
				.setColor("#5ad65c")
				.setDescription('━━━━━━━━━━━━━━━━━━━━━━━━\n\u200B')
				.setThumbnail('https://image.gametracker.com/images/maps/160x120/garrysmod/' + state.map + '.jpg')
				.addFields(
					{
						name: "🌍 ┃ Map ",
						value: " 🔹 `" + state.map + "` \n\u200B"
					},
					{
						name: "👥 ┃ Players connected `" + state.raw.numplayers + "/"+ state.maxplayers +"`",
						value: playerList
					},
					{
						name: "\u200B",
						value: "━━━━━━━━━━━━━━━━━━━━━━━━",
					},
					{
						name: "📡 ┃ Join us",
						value: "**steam://connect/"+ ip + ":" + port + "**",
					},
				)
				.setFooter({ text: 'Update' })
				.setTimestamp()

			status.edit({ content: null, embeds: [ embedSatus ] })
				    
		}).catch((error) => {
			let embedSatusOff = new MessageEmbed()
				.setTitle("🔴 Serveur offline")
				.setColor("#d65a5a")
				.setFooter({ text: 'Update' })
				.setTimestamp()

			status.edit({ content: null, embeds: [ embedSatusOff ] })
		});
	}

	task();
	setInterval(task, 60000);
})

client.login(token);
