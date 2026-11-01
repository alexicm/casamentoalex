import { PageReadyProvider } from "@/components/motion/PageReadyProvider";
import { ThankYouScene } from "@/components/wedding/ThankYouScene";
import { loadReceipt } from "@/lib/rsvp/receipt-lookup";

export default async function AusenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const params = await searchParams;
  const receipt = await loadReceipt(params.r);

  return (
    <PageReadyProvider initialReady>
      <ThankYouScene
        attending={false}
        validated={receipt.validated}
        found={receipt.found}
      />
    </PageReadyProvider>
  );
}
