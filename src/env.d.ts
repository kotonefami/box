/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

declare module "cloudflare:workers" {
    export const env: {
        [k: `KV_${string}`]: KVNamespace;
        MISSKEY_SERVER: string;
        MISSKEY_TOKEN: string;
        RECIEVE_WEBHOOK_TOKEN: string;
        RECIEVE_WEBHOOK_MISSKEY_USERNAME: string;
        CONSOLE_USER?: string;
        CONSOLE_PASS?: string;
        BOXES?: string;
        BOX_NAMES?: string;
    };
}
