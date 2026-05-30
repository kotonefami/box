import { env } from "cloudflare:workers";
import type { KVNamespace } from "@cloudflare/workers-types";

/** 箱IDに対応するKVネームスペースを取得します。見つからない場合はnullを返します。 */
export function getBoxKv(boxId: string): KVNamespace | null {
    const envRecord = env as Record<string, unknown>;
    const kv = envRecord[`KV_${boxId.toUpperCase()}`] as KVNamespace | undefined;
    if (kv) return kv;
    return null;
}

/** 箱IDが存在するかどうかを返します。 */
export function boxExists(boxId: string): boolean {
    return getBoxKv(boxId) !== null;
}

/** BOX_NAMES 環境変数から箱の表示名マップを取得します。 */
export function getBoxNames(): Record<string, string> {
    const envRecord = env as Record<string, unknown>;
    const raw = envRecord.BOX_NAMES as string | undefined;
    if (!raw) return {};
    try {
        return JSON.parse(raw) as Record<string, string>;
    } catch {
        return {};
    }
}

/** 箱の表示名を取得します。設定がない場合は fallback 名を返します。 */
export function getBoxDisplayName(boxId: string, fallback?: string): string {
    const names = getBoxNames();
    return names[boxId] || fallback || `お題箱 (${boxId})`;
}

/** 箱のURLを取得します。 */
export function getBoxUrl(boxId: string): string {
    if (boxId === "default") return "/";
    return `/boxes/${boxId}`;
}
