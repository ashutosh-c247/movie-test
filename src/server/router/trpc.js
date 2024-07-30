import { createTRPC } from "./context";
import superjson from "superjson";

export const t = createTRPC().create({
  transformer: superjson,
});
