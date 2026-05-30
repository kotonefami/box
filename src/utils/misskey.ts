import { env } from "cloudflare:workers";

/** Misskey にノートを投稿します。環境変数が未設定の場合は何もせず、エラーは握りつぶします。 */
export async function postNoteToMisskey(text: string): Promise<void> {
    const misskeyServer = env.MISSKEY_SERVER;
    const misskeyToken = env.MISSKEY_TOKEN;

    if (!misskeyServer || !misskeyToken) return;

    const url = new URL("/api/notes/create", misskeyServer);
    await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            i: misskeyToken,
            text,
            visibility: "public",
        }),
    }).catch((e) => {
        console.error("Misskey API request failed", e);
    });
}
