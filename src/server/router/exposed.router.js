import { authRouter } from "./auth";
import { movieRouter } from "./movie";
export const exposedRoutes = {
  auth: authRouter,
  movie: movieRouter,
};
