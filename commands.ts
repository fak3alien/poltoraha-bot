export enum CommandNames {
  PING = "ping",
}

export const commands: Array<{ name: CommandNames; description: string }> = [
  {
    name: CommandNames.PING,
    description: "Replies with Pong!",
  },
];
