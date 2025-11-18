import { getSession } from "next-auth/react";

export async function getAuthHeader() {
  const session = await getSession();
  if (session?.user) {
    return {
      Authorization: `Bearer ${session.user.email}`,
    };
  }
  return {};
}
