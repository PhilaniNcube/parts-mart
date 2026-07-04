import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Bell, ShieldCheck, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard, ListingCardSkeleton } from "@/features/listing/components/listing-card";
import { getRecentListings } from "@/features/search/search-queries";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-grow bg-background font-sans text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight tracking-tight">
            Find car parts across South African vendors
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Connect directly with reliable suppliers. Set up alerts for specific components or search our expansive catalog of new and refurbished parts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-lg gap-2">
              <Link href="/search">
                Start searching
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-lg border-2 border-primary text-primary hover:bg-primary/10">
              <Link href="/sign-up">Become a vendor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid (Bento Style) */}
      <section className="px-6 pb-24 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<Search className="h-6 w-6" />}
            title="Flexible search"
            body="Search by OEM numbers, VIN, or part names. Our engine understands technical specifications to find the exact match."
          />
          <Feature
            icon={<Bell className="h-6 w-6" />}
            title="Vendor alerts"
            body="Can't find it? Set an alert. We'll notify you the second a vendor uploads a matching component to our marketplace."
          />
          <Feature
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Curated catalog"
            body="Browse categories verified by experts. From engine internals to exterior trim, find parts that meet safety standards."
          />
        </div>
      </section>

      {/* Recently Listed Section */}
      <section className="px-6 py-24 bg-muted/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-semibold">Recently listed</h2>
            <Link className="group flex items-center gap-2 text-primary font-bold hover:underline" href="/search">
              Browse all
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-4">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ListingCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <RecentListings />
            </Suspense>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20 container mx-auto max-w-7xl">
        <div className="relative rounded-3xl bg-slate-900 text-white p-12 overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
            <Settings className="w-96 h-96 -rotate-12 translate-x-20 -translate-y-10" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Need to offload inventory?</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-xl">
              Join thousands of South African scrapyards, dealerships, and individual sellers moving parts faster through our intelligent alert network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-8 py-6">
                <Link href="/sign-up">Create vendor account</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold px-8 py-6">
                <Link href="/about">Learn how it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group p-8 bg-card border border-border rounded-xl hover:border-primary transition-all shadow-sm">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

async function RecentListings() {
  const hits = await getRecentListings(4);
  if (!hits.length) {
    return <p className="text-sm text-muted-foreground">No listings yet — be the first vendor to add one.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {hits.map((hit) => (
        <ListingCard key={hit.id} hit={hit} />
      ))}
    </div>
  );
}