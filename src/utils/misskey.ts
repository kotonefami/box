import { env } from "cloudflare:workers";

/** Misskey にノートを投稿します。環境変数が未設定の場合は何もせず、エラーは握りつぶします。 */
export async function postNoteToMisskey(text: string): Promise<void> {
    const misskeyServer = env.MISSKEY_SERVER;
    const misskeyToken = env.MISSKEY_TOKEN;

    if (!misskeyServer || !misskeyToken) return;

    await fetch("https://" + misskeyServer + "/api/notes/create", {
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
