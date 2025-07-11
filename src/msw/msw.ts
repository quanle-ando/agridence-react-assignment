import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

const msw = setupWorker(...handlers);

export function startMsw() {
  return msw.start();
}
