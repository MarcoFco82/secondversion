/// <reference types="@cloudflare/workers-types" />

declare module '@opennextjs/cloudflare' {
    export function getRequestContext(): {
      env: {
        DB: D1Database;
        MEDIA_BUCKET?: R2Bucket;
      };
    } | undefined;
  }