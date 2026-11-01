import { redirect } from "next/navigation";

export default async function ConvitePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const params = await searchParams;
  const token = params.t ?? "";
  if (!token) redirect("/");
  redirect(`/?invite=${encodeURIComponent(token)}`);
}
