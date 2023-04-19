const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { LogHandler } = require("./../../Handlers/LogHandler");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json")

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a target user from the server.")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("User to be banned.")
                .setRequired(true)
            )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for the ban.")
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

        async execute(interaction) {
            const { options } = interaction;

            const user = options.getUser("user");
            const reason = options.getString("reason");
            const member = await interaction.guild.members.fetch(user.id);

            // Checking if the user has the permission to ban the target user.

            const errorEmbed = new EmbedBuilder()
                .setColor(Messages.Colors.Error)
                .setDescription(Messages.NoPermission[Math.floor(Math.random() * Messages.NoPermission.length)]);

            if (member.roles.highest.position >= interaction.member.roles.highest.position) {
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            // Sending the embed to the user, banning the user, and catching any errors that may occur.

            const banEmbed = new EmbedBuilder()
                .setColor(Messages.Colors.ban)
                .setTitle("Ban")
                .setDescription(`You have been banned from ${interaction.guild.name}.`)
                .addFields(
                    { name: "Banned User:", value: user.tag },
                    { name: "Banned By:", value: interaction.member.user.tag },
                    { name: "Reason:", value: reason },
                    { name: "Cancellation", value: "Uh oh, looks like someone's in trouble! If you think you've been wrongly accused, don't panic - just contact the server moderation and we'll sort it out faster than you can say 'bananas'! Unless, of course, you actually did break the rules... in that case, good luck explaining it to us!"}
                )
                .setTimestamp();            

            try { await user.send({ embeds: [banEmbed] }); }
            catch (error) {                
                LogHandler.logException(error);
                return await interaction.reply({ content: Messages.CannotSendTheEmbed[Math.floor(Math.random() * Messages.CannotSendTheEmbed.length)], ephemeral: true})
            }

            try { await member.ban({ reason }); }
            catch (error) {
                LogHandler.logException(error);
                return await interaction.reply({ content: Messages.CannotBanTheUser[Math.floor(Math.random() * Messages.CannotBanTheUser.length)], ephemeral: true})
            }

            // ------------------------------------------------------------------------------------------ //

            await DatabaseHandler.log(interaction.guild.id, 6, `${interaction.user.tag} banned ${user.tag} for ${reason}`);

            const returnEmbed = new EmbedBuilder()
                .setColor(Messages.Colors.ban)
                .setTitle("Ban")
                .setDescription(`Oops, looks like **${user.tag}** just got the boot! They've been banned for ${reason}. Let's hope they don't try to sneak back in`)
                .setTimestamp();

            return await interaction.reply({ embeds: [returnEmbed], ephemeral: true });
        }
};