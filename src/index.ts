import { Hono } from "hono";
import { fromHono } from "chanfana";
import auth from "./routes/auth";
import { UserMeEndpoint } from "./endpoints/userMe";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/auth", auth);

const openapi = fromHono(app, { base: "/api", docs_url: "/" });

openapi.get("/users/me", UserMeEndpoint);

export default app;
