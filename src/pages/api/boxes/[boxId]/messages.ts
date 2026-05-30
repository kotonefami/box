import type { APIRoute } from "astro";
import { post } from "../../../../utils/box";

export const POST: APIRoute = async ({ request, params }) => {
    try {
        const boxId = params.boxId;
        if (!boxId) {
            return new Response(JSON.stringify({ error: "Box ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        let formData: FormData;
        try {
            formData = await request.formData();
        } catch {
            return new Response(
                JSON.stringify({ error: "Invalid Content-Type" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }
        const content = formData.get("content")?.toString();

        if (!content) {
            return new Response(JSON.stringify({ error: "Content is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        try {
            const { id } = await post(boxId, content);

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
