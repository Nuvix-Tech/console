import { Client, ConsoleAccount } from "@nuvix/console";
import { SERVER_URL } from "./constants";

const _client = new Client().setEndpoint(SERVER_URL);

const nuvix = {
  account: new ConsoleAccount(_client),
  client: _client,
};

export { nuvix };
