import { t } from "./trpc";
import { exposedRoutes } from "./exposed.router";
import { devRouter } from "./dev";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { createContext } from "./context";

const isDev =
  process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development";

const publicRoutes = !isDev
  ? exposedRoutes
  : {
      ...exposedRoutes,
      ...{
        dev: devRouter,
      },
    };
export const appRouter = t.router(publicRoutes);

export const ssgHelper = async () => {
  return createServerSideHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: await createContext(),
  });
};
