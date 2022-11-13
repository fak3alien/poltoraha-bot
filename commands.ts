export enum CommandNames {
  PING = "ping",
  ENERGY = "energy"
}

export const commands: Array<{ name: CommandNames; description: string }> = [
  {
    name: CommandNames.PING,
    description: "Проверка статуса",
  },
  {
    name: CommandNames.ENERGY,
    description: "Получить энергию",
  }
];
