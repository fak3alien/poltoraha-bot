import { REST, Routes } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { commands, CommandNames } from "./commands";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const APP_ID = process.env.APPLICATION_ID as string;
const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

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
});

registerCommands()
  .then(() => client.login(BOT_TOKEN))
  .catch((err) => console.log(err));