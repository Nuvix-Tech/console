import { Client, ConsoleAccount } from "@nuvix/console";

const _client = new Client().setEndpoint("https://server.nuvix.in");

const nuvix = {
  account: new ConsoleAccount(_client),
  client: _client,
};

export { nuvix };
