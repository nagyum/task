import { apiClient } from "./client";
import type {
  SigninRequest,
  SigninResponse,
  SignupRequest,
} from "../types/auth";

export async function signup(data: SignupRequest): Promise<void> {
  await apiClient("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signin(data: SigninRequest): Promise<SigninResponse> {
  return await apiClient<SigninResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
