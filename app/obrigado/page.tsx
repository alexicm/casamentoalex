import { PageReadyProvider } from "@/components/motion/PageReadyProvider";
import { ThankYouScene } from "@/components/wedding/ThankYouScene";
import { loadReceipt } from "@/lib/rsvp/receipt-lookup";

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string }>;
}) {
  const params = await searchParams;
  const receipt = await loadReceipt(params.r);

  return (
    <PageReadyProvider initialReady>
      <ThankYouScene
        attending={receipt.found ? receipt.attending : true}
        validated={receipt.validated}
        found={receipt.found}
      />
    </PageReadyProvider>
  );
}
