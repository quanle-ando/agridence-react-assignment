export type NoteInfoType = {
  id: string;
  title: string;
  description: string;
  createdTimestamp: string;
};

export type UserInfoType = {
  username: string;
  password: string;
  accessToken: string;
  fullname: string;
};

export type StoredUserInfoType = Pick<
  UserInfoType,
  "accessToken" | "fullname" | "username"
>;

declare global {
  interface Window {
    __VITEST__?: true;
  }
}
