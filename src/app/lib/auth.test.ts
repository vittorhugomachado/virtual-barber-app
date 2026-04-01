import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session, User } from "@supabase/supabase-js";

const supabaseMocks = vi.hoisted(() => {
  const maybeSingle = vi.fn();
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  return {
    maybeSingle,
    eq,
    select,
    from,
  };
});

vi.mock("./supabase", () => ({
  supabase: {
    from: supabaseMocks.from,
  },
}));

import {
  getCustomerFromAuthUser,
  getPostAuthRedirectPath,
  syncAuthStoreWithSession,
} from "./auth";

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-03-28T00:00:00.000Z",
    ...overrides,
  } as User;
}

function makeSession(user: User): Session {
  return {
    access_token: "token",
    refresh_token: "refresh",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: 9999999999,
    user,
  };
}

describe("auth helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds the booking redirect when login starts from agendar", () => {
    expect(getPostAuthRedirectPath("barbearia-x", "agendar")).toBe(
      "/barbearia-x/agendar",
    );
  });

  it("builds the home redirect when login does not start from agendar", () => {
    expect(getPostAuthRedirectPath("barbearia-x", null)).toBe("/barbearia-x");
  });

  it("falls back to root when slug is missing", () => {
    expect(getPostAuthRedirectPath(undefined, "agendar")).toBe("/");
  });

  it("hydrates the customer from customers_auth when the row exists", async () => {
    supabaseMocks.maybeSingle.mockResolvedValueOnce({
      data: {
        id: "customer-1",
        name: "Vitor",
        phone: "11999999999",
        auth_user_id: "user-1",
      },
      error: null,
    });

    const user = makeUser({
      phone: "+5511888887777",
      user_metadata: { full_name: "Nome do OAuth" },
    });

    const result = await getCustomerFromAuthUser(user);

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      id: "customer-1",
      name: "Vitor",
      phone: "11999999999",
      auth_user_id: "user-1",
      barbershop_id: null,
    });
  });

  it("falls back to auth metadata and phone when customers_auth is missing", async () => {
    supabaseMocks.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    const user = makeUser({
      phone: "+5511888887777",
      user_metadata: { full_name: "Nome do OAuth" },
    });

    const result = await getCustomerFromAuthUser(user);

    expect(result.error).toBeNull();
    expect(result.data).toEqual({
      id: "user-1",
      name: "Nome do OAuth",
      phone: "11888887777",
      auth_user_id: "user-1",
      barbershop_id: null,
    });
  });

  it("clears the auth store when there is no active session", async () => {
    const handlers = {
      setCustomer: vi.fn(),
      clearCustomer: vi.fn(),
      setLoading: vi.fn(),
    };

    await syncAuthStoreWithSession(null, handlers);

    expect(handlers.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(handlers.clearCustomer).toHaveBeenCalledTimes(1);
    expect(handlers.setCustomer).not.toHaveBeenCalled();
    expect(handlers.setLoading).toHaveBeenLastCalledWith(false);
  });

  it("hydrates the auth store from the Supabase session", async () => {
    supabaseMocks.maybeSingle.mockResolvedValueOnce({
      data: {
        id: "customer-1",
        name: "Cliente",
        phone: "11999999999",
        auth_user_id: "user-1",
      },
      error: null,
    });

    const handlers = {
      setCustomer: vi.fn(),
      clearCustomer: vi.fn(),
      setLoading: vi.fn(),
    };

    await syncAuthStoreWithSession(makeSession(makeUser()), handlers);

    expect(handlers.clearCustomer).not.toHaveBeenCalled();
    expect(handlers.setCustomer).toHaveBeenCalledWith({
      id: "customer-1",
      name: "Cliente",
      phone: "11999999999",
      auth_user_id: "user-1",
      barbershop_id: null,
    });
    expect(handlers.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(handlers.setLoading).toHaveBeenLastCalledWith(false);
  });
});
