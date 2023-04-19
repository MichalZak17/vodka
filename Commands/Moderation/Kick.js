const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { LogHandler } = require("./../../Handlers/LogHandler");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json");

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick the user from the server")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("User to be faced with the kick hammer")
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the kick")
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

        async execute(interaction) {
            const { options } = interaction;

            const user = options.getUser("user");
            const reason = options.getString("reason");
            const member = await interaction.guild.members.fetch(user.id);

            // Checking if the user has the permission to kick the target user.

            const errorEmbed = new EmbedBuilder()
                .setColor("#c72c3b")
                .setDescription(Messages.NoPermission[Math.floor(Math.random() * Messages.NoPermission.length)]);

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Sending the embed to the user, kicking the user, and catching any errors that may occur.

            kickEmbed = new EmbedBuilder()
                .setColor("#E3A452")
                .setTitle("Kick")
                .setDescription(`You have been kicked from ${interaction.guild.name}.`)
                .addFields(
                    { name: "Kicked User:", value: user.tag },
                    { name: "Kicked By:", value: interaction.member.user.tag },
                    { name: "Reason:", value: reason },
                    { name: "Cancellation", value: "Uh oh, looks like someone's in trouble! If you think you've been wrongly accused, don't panic - just contact the server moderation and we'll sort it out faster than you can say 'bananas'! Unless, of course, you actually did break the rules... in that case, good luck explaining it to us!"}
                )
                .setTimestamp();

            try { await user.send({ embeds: [kickEmbed] }); }
            catch (error) {                
                LogHandler.logException(error);
                return await interaction.reply({ content: Messages.CannotSendTheEmbed[Math.floor(Math.random() * Messages.CannotSendTheEmbed.length)], ephemeral: true})
            }

            try { await member.kick(reason); }
            catch (error) {
                LogHandler.logException(error);
                return await interaction.reply({ content: Messages.CannotKickUser[Math.floor(Math.random() * Messages.CannotKickUser.length)], ephemeral: true})
            }

            // ---------------------------------------------------------------------------------------- //

            await DatabaseHandler.log(interaction.guild.id, 6, `${interaction.member.user.tag} kicked ${user.tag} from the server. Reason: ${reason}.`);

            return await interaction.reply({ content: `Kicked ${user.tag} from the server!`, ephemeral: true });
        }
};