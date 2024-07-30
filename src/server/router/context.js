import * as trpc from "@trpc/server";
import prisma from "../db/client";

export const createContext = async (opts) => {
  const req = opts?.req;
  const res = opts?.res;

  return {
    req,
    res,
    prisma,
  };
};

export const createTRPC = () => trpc.initTRPC.context();
