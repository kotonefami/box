/// <reference types="astro/client" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;

declare module "cloudflare:workers" {
    export const env: {
        [k: `KV_${string}`]: KVNamespace;
        MISSKEY_SERVER: string;
        MISSKEY_TOKEN: string;
        CONSOLE_USER?: string;
        CONSOLE_PASS?: string;
        BOXES?: string;
        BOX_NAMES?: string;
    };
}
