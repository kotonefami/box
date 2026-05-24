import type { APIRoute } from "astro";
import { ulid } from "ulid";
import { getBoxKv } from "../../../../utils/box";
import { postNoteToMisskey } from "../../../../utils/misskey";

export const POST: APIRoute = async ({ request, params }) => {
    try {
        const boxId = params.boxId;
        if (!boxId) {
            return new Response(JSON.stringify({ error: "Box ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const formData = await request.formData();
        const content = formData.get("content")?.toString();

        if (!content) {
            return new Response(JSON.stringify({ error: "Content is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const kv = getBoxKv(boxId);

        if (!kv) {
            return new Response(JSON.stringify({ error: "Box not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const id = ulid();
        await kv.put(id, content);

        await postNoteToMisskey(content);

        return new Response(JSON.stringify({ id }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
