export enum CommandNames {
  PING = "ping",
  ENERGY = "energy"
}

export const commands: Array<{ name: CommandNames; description: string }> = [
  {
    name: CommandNames.PING,
    description: "Replies with Pong!",
  },
  {
    name: CommandNames.ENERGY,
    description: "Energy stats",
  }
];
