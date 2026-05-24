import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";

export const onRequest = defineMiddleware((context, next) => {
    const url = new URL(context.request.url);

    // /console 配下のみBASIC認証をかける
    if (url.pathname.startsWith("/console")) {
        const basicAuth = context.request.headers.get("Authorization");

        // 環境変数からユーザー・パスワードを取得 (例: CONSOLE_USER, CONSOLE_PASS)
        const expectedUser = env.CONSOLE_USER || "admin";
        const expectedPass = env.CONSOLE_PASS || "admin";

        if (basicAuth) {
            const authValue = basicAuth.split(" ")[1];
            const [user, pwd] = atob(authValue).split(":");

            if (user === expectedUser && pwd === expectedPass) {
                return next();
            }
        }

        return new Response("Authorization Required", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="Console"',
            },
        });
    }

    return next();
});
