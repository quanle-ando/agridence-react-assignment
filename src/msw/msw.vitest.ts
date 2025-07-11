import { setupServer } from "msw/node";
import { handlers } from "./handlers";

const msw = setupServer(...handlers);

export function startMsw() {
  return Promise.resolve(msw.listen());
}
