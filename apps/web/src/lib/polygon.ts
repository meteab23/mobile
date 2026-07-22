import { createPolygonClient, type PolygonClient } from "@daytrading/polygon";

let client: PolygonClient | null = null;

export function getPolygonClient(): PolygonClient {
  if (!client) {
    client = createPolygonClient();
  }
  return client;
}

export function hasPolygonKey(): boolean {
  return Boolean(process.env.POLYGON_API_KEY);
}
