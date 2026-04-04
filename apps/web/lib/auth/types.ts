export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export type AuthPayload = {
  token: string;
  user: AuthUser;
};

export type GraphQLErrorShape = {
  message: string;
};

export type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorShape[];
};
