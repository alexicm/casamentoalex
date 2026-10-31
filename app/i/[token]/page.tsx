import { redirect } from "next/navigation";

export default async function InvitePage({ params }: PageProps<"/i/[token]">) {
  const { token } = await params;
  redirect(`/?invite=${encodeURIComponent(token)}`);
}
