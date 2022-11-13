import { ButtonBuilder, ButtonStyle, Events, REST, Routes } from "discord.js";
import { Client, GatewayIntentBits, ActionRowBuilder } from "discord.js";
import { commands, CommandNames } from "./commands";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const APP_ID = process.env.APPLICATION_ID as string;
const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

console.log("PROCESS ENV PORT: ", process.env.PORT);

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

  const registerCommands = async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(APP_ID), { body: commands });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  };

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("interactionCreate", async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === CommandNames.PING) {
      await interaction.reply("I'm alive");
    }

    if (interaction.commandName === CommandNames.ENERGY) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("energy-button")
          .setLabel("Press me!")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({
        content: "To add some energy: ",
        components: [row],
      });
    }
  });

  client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isButton()) {
      return;
    }

    console.log(interaction);
  });

  registerCommands()
    .then(() => client.login(BOT_TOKEN))
    .catch((err) => console.log(err));
});
