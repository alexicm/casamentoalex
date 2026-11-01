import { PageReadyProvider } from "@/components/motion/PageReadyProvider";
import { ConfirmationRitual } from "@/components/wedding/ConfirmationRitual";

export default async function ConfirmandoPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string; p?: string }>;
}) {
  const params = await searchParams;

  return (
    <PageReadyProvider initialReady>
      <ConfirmationRitual receipt={params.r} attending={params.p !== "0"} />
    </PageReadyProvider>
  );
}
