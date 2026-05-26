import type { Metadata } from "next";
import { AdminPortal } from "@/components/portal/AdminPortal";
import { getAdminSessionFromCookies } from "@/lib/portalAuth";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Admin Portal | Elite Courts",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function PortalPage() {
  const session = await getAdminSessionFromCookies();
  return <AdminPortal initialAuthenticated={Boolean(session)} />;
}
