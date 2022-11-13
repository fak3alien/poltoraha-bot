import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Events,
  REST,
  Routes,
} from "discord.js";
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

const energy: Record<string, number> = {};

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

  const energyButton = new ButtonBuilder()
    .setCustomId("energy-button")
    .setLabel("Нажми сюда!")
    .setStyle(ButtonStyle.Primary);

  const energyRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    energyButton
  );

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === CommandNames.PING) {
      await interaction.reply("I'm alive");
    }

    if (interaction.commandName === CommandNames.ENERGY) {
      await interaction.reply({
        content: "Чтобы получить энергию: ",
        components: [energyRow],
      });
    }

    const filter = (i: ButtonInteraction) => i.customId === "energy-button";

    const collector = interaction.channel?.createMessageComponentCollector<2>({
      filter,
    });

    collector?.on("collect", async (i) => {
      if (Object.hasOwn(energy, interaction.user.username)) {
        energy[interaction.user.username] =
          energy[interaction.user.username] + 10;
      }

      if (!Object.hasOwn(energy, interaction.user.username)) {
        energy[interaction.user.username] = 10;
      }
      await i.update({
        content: `${
          interaction.user.username
        } получил +10 энергии! Продолжай в том же духе! Всего: ${
          energy[interaction.user.username]
        }`,
        components: [energyRow],
      });
    });

    collector?.on("end", (collected) =>
      console.log(`Collected ${collected.size} items`)
    );
  });

  registerCommands()
    .then(() => client.login(BOT_TOKEN))
    .catch((err) => console.log(err));
});
