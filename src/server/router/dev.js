import { t } from "./trpc";
import { exposedRoutes } from "./exposed.router";

const prodRouter = t.router(exposedRoutes);

export const devRouter = t.router({
  donator: t.procedure.query(async ({ ctx }) => {
    return await prodRouter.createCaller(ctx).user.getDonator();
  }),
});
