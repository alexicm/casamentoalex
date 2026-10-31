import { WeddingExperience } from "@/components/wedding/WeddingExperience";
import { getPublicEvent } from "@/lib/event/load";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const inviteToken =
    typeof params.invite === "string" ? params.invite : undefined;
  const event = await getPublicEvent();

  return (
    <WeddingExperience
      event={event}
      inviteToken={inviteToken}
      setupPending={!isSupabaseConfigured()}
    />
  );
}
