import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("Trace router shell", () => {
  it("returns the current workspace user through auth.me", async () => {
    const user = {
      id: 7,
      openId: "trace-smoke-user",
      email: "alex@example.com",
      name: "Alex Kim",
      loginMethod: "manus",
      role: "user" as const,
      createdAt: new Date("2026-09-17T00:00:00Z"),
      updatedAt: new Date("2026-09-17T00:00:00Z"),
      lastSignedIn: new Date("2026-09-17T00:00:00Z"),
    };
    const ctx: TrpcContext = {
      user,
      req: { headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const result = await appRouter.createCaller(ctx).auth.me();

    expect(result).toMatchObject({ openId: "trace-smoke-user", name: "Alex Kim" });
  });
});
