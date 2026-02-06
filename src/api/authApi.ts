import { apiClient } from "./client";
import type {
  SigninRequest,
  TokenResponse,
  SignupRequest,
} from "../types/auth";

export async function signup(data: SignupRequest): Promise<void> {
  await apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signin(data: SigninRequest): Promise<TokenResponse> {
  return await apiClient<TokenResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
