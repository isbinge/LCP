/* eslint-disable @typescript-eslint/naming-convention */
export interface LoginDto {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export type LoginLocal = Partial<{
  userName: string;
  passwd: Nullable<string>;
  token: string | null;
}>;
