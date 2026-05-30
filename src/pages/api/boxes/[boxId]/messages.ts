import type { APIRoute } from "astro";
import { ulid } from "ulid";
import { getBoxKv, getBoxUrl } from "../../../../utils/box";
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

        let boxBaseUrl = getBoxUrl(boxId).slice(1);
        if (boxBaseUrl.at(-1) !== "/") boxBaseUrl += "/"; // NOTE: 必ず `path/to/box/` の形式にする
        const boxUrl = "https://box.kotone-fami.net/" + boxBaseUrl + "messages/" + id;
        await postNoteToMisskey(content + "\n\n" + boxUrl + "\n#琴音ふぁみのお題箱");

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
