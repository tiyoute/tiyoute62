// Fichier config + variable :
const Discord = require('discord.js')
const bot = new Discord.Client()
var prefix = ('t!')
var prefix = ('t.')
const fs = require('fs')
const warns = JSON.parse(fs.readFileSync('./warns.json'))

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapters  = new FileSync('database.json');
const db = low(adapters);
 
db.defaults({ histoire : [],xp : []}).write()

bot.login('NTM5MTExMDM1MzYyMzQ0OTYw.D3AORw.VKTY5XcFlSNk2eOvIUD6acOTsAU')

bot.on('ready', function () {
    console.clear()
    console.log("Je suis actuellement en ligne, et disponible à l'écoute")
})

bot.on('ready', function () {
    bot.user.setGame('Mon prefix est !').catch(console.error)
    console.log("Activité défini sur En cours de dévellopement !")
})
bot.on('message', message => {
    // embed help
    if (message.content === prefix + 'close'){
        var close_embed = new Discord.RichEmbed()    
            .setColor('#FF0000')
            .setTitle("Fermeture du bot :")
            .setFooter("Le bot va s'éteindre !")
            .setTimestamp()
    message.channel.sendEmbed(close_embed) //permet d'envoyer le message
    }
})
bot.on('message', message => {
    // embed help
    if (message.content === prefix + 'help'){
        var help_embed = new Discord.RichEmbed()    
            .setColor('#2AFF00')
            .setTitle("Bienvenue sur l'aide :")
            .addField("!help", "Vous affiche le menu d'aide")
            .addField("!warn", "Permet d'avertir un utilisateur")
            .addField("!casier", "Permet de consulter les warns d'un utilisateur")
            .addField("!clear", "Permet de supprimer des messages")
            .setFooter("Bot dév par Tiyoute#9817")
            .setTimestamp()
    message.channel.sendEmbed(help_embed) //permet d'envoyer le message
    console.clear("")
    console.log("[commande] prefix + help utilisé")
    }
})

bot.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
    var no_access = new Discord.RichEmbed()
        .setColor('FF0000')
        .setTitle("Erreur Système")
        .addField("Accès Refusé :", "Vous n'avez pas la permission pour pouvoir supprimer des messages !", true)
        .setFooter("Si un problème signalez le à Tiyoute#9817")
        .setTimestamp()
    var no_select = new Discord.RichEmbed()
        .setColor('FFFF00')
        .setTitle("Erreur Système")
        .addField("Incorrect :", "Veuillez indiquer un nombre entre 1 et 100", true)
        .setFooter("Si un problème signalez le à Tiyoute#9817")
        .setTimestamp()
    var no_select2 = new Discord.RichEmbed()
        .setColor('FFFF00')
        .setTitle("Erreur Système")
        .addField("Incorrect :", "Veuillez indiquer un nombre valide entre 1 et 100 !", true)
        .setFooter("Si un problème signalez le à Tiyoute#9817")
        .setTimestamp()
    if (args[0].toLowerCase() === prefix + "clear") {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.sendEmbed(no_access)
    let count = args[1]
    if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
    if (isNaN(count)) return message.channel.sendEmbed(no_select)
    if (count < 1 || count > 100) return message.channel.sendEmbed(no_select2)
    message.channel.bulkDelete(parseInt(count) + 1)
    }
})

bot.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    var no_access2 = new Discord.RichEmbed()
        .setColor('FF0000')
        .setTitle("Erreur Système")
        .addField("Accès Refusé :", "Vous n'avez pas la permission pour avertir un utilisateur !", true)
        .setFooter("Si un problème signalez le à Tiyoute#9817")
        .setTimestamp()
    var no_select3 = new Discord.RichEmbed()
        .setColor('FFFF00')
        .setTitle("Erreur Système")
        .addField("Incorrect :", "Veuillez indiquer un utilisateur !", true)
        .setFooter("Si un problème signalez le à Tiyoute#9817")
        .setTimestamp()
    var no_select4 = new Discord.RichEmbed()
        .setColor('FFFF00')
        .setTitle("Erreur Système")
        .addField("Incorrect :", "Veuillez une raison !", true)
        .setFooter("Si un problème signalez le à Tiyoute#9817")
        .setTimestamp()
    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.sendEmbed(no_access2)
        let member = message.mentions.members.first()
        if (!member) return message.channel.sendEmbed(no_select3)
        if (member.highestRole.comparePositionTo(message.member.highestRole) < 1 && message.author.id !== message.guild.ownerID) return message.channel.sendEmbed(no_access2)
        let reason = args.slice(2).join(' ')
        if (!reason) return message.channel.sendEmbed(no_select4)
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
    }
 
    if (args[0].toLowerCase() === prefix + "casier") {
        var no_access5 = new Discord.RichEmbed()
            .setColor('FF0000')
            .setTitle("Erreur Système")
            .addField("Accès Refusé :", "Vous n'avez pas la permission de voir un casier !", true)
            .setFooter("Si un problème signalez le à Tiyoute#9817")
            .setTimestamp()
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.sendEmbed(no_access5)
        let member = message.mentions.members.first()
        if (!member) return message.channel.sendEmbed(no_select3)
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('10 derniers warns', ((warns[member.id]) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
            .setFooter("Si un problème signalez le à Tiyoute#9817")
            .setTimestamp()
        message.channel.send(embed)
    }
})

bot.on('message', message => {
 
    var msgauthor = message.author.id
   
    if(message.author.bot)return;
   
    if(!db.get("xp").find({user : msgauthor}).value()){
        db.get("xp").push({user : msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user : msgauthor}).find("xp").value();
        console.log(userxpdb)
        var userxp = Object.values(userxpdb)
   
        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();
   
        if(message.content === prefix + "stat"){
            var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
            var xpfinal = Object.values(xp);
            var xp_embed = new Discord.RichEmbed()
                .setTitle(`Profil de ${message.author.username}`)
                .setColor('00FFF7')
                .addField("Nombre de messages :", `${xpfinal[1]} envoyés`)
                .setFooter("Si un problème signalez le à Tiyoute#9817")
                .setTimestamp()
            message.channel.send({embed : xp_embed})
        }
    }
  })
