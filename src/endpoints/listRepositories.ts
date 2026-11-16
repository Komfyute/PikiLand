import {
  InternalServerErrorException,
  OpenAPIRoute,
  UnauthorizedException,
} from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";

export class ListRepositories extends OpenAPIRoute {
  schema = {
    summary: "리포지토리 목록 조회",
    operationId: "ListRepositories",
    security: [{ cookieAuth: [] }],
    tags: ["repositories"],
    responses: {
      "200": {
        description: "성공",
        content: {
          "application/json": {
            schema: z.object({
              repositories: z.array(
                z.object({
                  id: z
                    .int()
                    .describe("리포지토리 Id")
                    .openapi({ example: 1234567 }),
                  full_name: z
                    .string()
                    .describe("리포지토리 이름")
                    .openapi({ example: "yourssu/PikiLand" }),
                }),
              ),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const id = c.get("id");

    const access_token = await c.env.DB.prepare(
      "SELECT github_access_token FROM sessions WHERE id = ? and expires_at > datetime('now')",
    )
      .bind(id)
      .first<{ github_access_token: string }>();
    if (!access_token) throw new UnauthorizedException();

    const installationsResponse = await fetch(
      "https://api.github.com/user/installations",
      {
        headers: {
          Authorization: `Bearer ${access_token.github_access_token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "PikiLand-Coordinator",
        },
      },
    );
    if (!installationsResponse.ok) throw new InternalServerErrorException();

    const { installations } = (await installationsResponse.json()) as {
      installations: { id: number }[];
    };

    const result = [];
    for (const inst of installations) {
      const { id } = inst;
      const repositoriesResponse = await fetch(
        `https://api.github.com/user/installations/${id}/repositories`,
        {
          headers: {
            Authorization: `Bearer ${access_token.github_access_token}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "PikiLand-Coordinator",
          },
        },
      );
      if (!repositoriesResponse.ok) throw new InternalServerErrorException();

      const { repositories } = (await repositoriesResponse.json()) as {
        repositories: { id: number; full_name: string }[];
      };

      for (const { id, full_name } of repositories) {
        result.push({ id, full_name });
      }
    }

    return c.json({ repositories: result }, 200);
  }
}
