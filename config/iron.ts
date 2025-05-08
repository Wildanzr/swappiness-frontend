import {
  getIronSession,
  IronSessionData,
  getServerActionIronSession,
  IronSessionOptions,
} from "iron-session";
import { cookies } from "next/headers";

declare module "iron-session" {
  interface IronSessionData {
    nonce?: string;
  }
}

export const sessionOption: IronSessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD!,
  cookieName: process.env.IRON_SESSION_COOKIE_NAME!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const getSession = async (req: Request, res: Response) => {
  const session = await getIronSession<IronSessionData>(
    req,
    res,
    sessionOption
  );
  return session;
};

export const getServerActionSession = async () => {
  const cookie = await cookies();
  const session = await getServerActionIronSession<IronSessionData>(
    sessionOption,
    cookie
  );
  return session;
};
