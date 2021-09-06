import { DynamicObject, IWhitelist } from "../types";

export const whitelists: DynamicObject<IWhitelist> = {
  "/protected": {
    ips: ["127.0.0.1"],
    path: "/protected",
  },
};
