import Form from "@/components/Form";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

function firstString(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const stripeCustomerId = firstString(searchParams.stripe_customer_id);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 px-4 py-10 sm:py-16">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
          LeadCatch AI
        </p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-900 sm:text-3xl">
          Tell us about your business
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          One last step — share a few details so we can configure your AI lead capture system.
          Takes about two minutes.
        </p>
      </header>

      <Form stripeCustomerId={stripeCustomerId} />

      <footer className="pt-4 text-center text-xs text-neutral-500">
        Need help? Email{" "}
        <a href="mailto:alex@leadcatch.homes" className="underline">
          alex@leadcatch.homes
        </a>
        .
      </footer>
    </main>
  );
}
