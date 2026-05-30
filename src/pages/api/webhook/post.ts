import type { APIRoute } from "astro";
import { post } from "../../../utils/box";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request, params }) => {
    try {
        if (request.headers.get("X-Misskey-Hook-Secret") !== env.RECIEVE_WEBHOOK_TOKEN) {
            return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const note = (await request.json()).body.note as {
            user: {
                username: string;
                host: string;
            };
            text: string;
        };
        if (!note.text) {
            return new Response(JSON.stringify({ error: "Content is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
        if ((note.user.host ?? env.MISSKEY_SERVER) === env.MISSKEY_SERVER && note.user.username === env.RECIEVE_WEBHOOK_MISSKEY_USERNAME) {
            return new Response(JSON.stringify({ error: "Ignoring self-posted note" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const { id } = await post("default", note.text.replace(`@${env.RECIEVE_WEBHOOK_MISSKEY_USERNAME}`, "").trim());

            return new Response(JSON.stringify({ id }), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });
        } catch (e) {
            if (e instanceof Response) return e;
            throw e;
        }
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
