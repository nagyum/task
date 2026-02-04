export type SignupRequest = {
  username: string; // 이메일 형식
  name: string;
  password: string;
  confirmPassword: string;
};

export type SigninRequest = {
  username: string; // 이메일 형식
  password: string;
};

export type SigninResponse = {
  accessToken: string;
  refreshToken: string;
};
