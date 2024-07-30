import { TRPCError } from "@trpc/server";
import { t } from "./trpc";
import { hashPassword } from "@/utils/auth";
import { z } from "zod";

export const authRouter = t.router({
  registerUser: t.procedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, password } = input;

      const existingUserByEmail = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is already registered",
        });
      }

      const hashedPassword = await hashPassword(password, 10);

      const newUser = await ctx.prisma.user.create({
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
        },
      });

      return newUser;
    }),
});
