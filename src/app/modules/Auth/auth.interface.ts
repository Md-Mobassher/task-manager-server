export type ILoginUserResponse = {
  email: string;
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};
