import { OpenAPIRoute, UnauthorizedException } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export class UserMeEndpoint extends OpenAPIRoute {
  schema = {
    summary: "Get information about current user",
    responses: {
      "200": {
        description: "Returns information about current user",
        content: {
          "application/json": {
            schema: z.object({
              login: z
                .string()
                .describe("login name")
                .openapi({ example: "yourssu" }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const token = getCookie(c, "token", "host");
    if (!token) throw new UnauthorizedException();
    const payload = await verify(token, c.env.JWT_SECRET, "HS256");

    return c.json({ login: payload.login }, 200);
  }
}
