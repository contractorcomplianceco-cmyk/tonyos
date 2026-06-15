import { useGetBrands } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Network } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { OrgTree } from "@/components/common/OrgTree";
import { BrandCard } from "@/components/common/BrandCard";
import { GuardrailNote } from "@/components/common/GuardrailNote";

export default function Brands() {
  const { data: brands, isLoading, isError, refetch } = useGetBrands();

  const active = (brands ?? []).filter((b) => b.kind !== "parent" && b.stage.toLowerCase() === "active");
  const candidates = (brands ?? []).filter((b) => b.kind !== "parent" && b.stage.toLowerCase() !== "active");

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Brand Portfolio"
        subtitle="Compliance Authority Group holdings — one active operating brand and the candidate brand pipeline."
      />

      <GuardrailNote text="Portfolio visibility only. Brand stages and candidate pipeline are recommendations — no launch, build, or investment is committed without written founder approval." />

      <Panel icon={Network} title="Portfolio Hierarchy">
        {isLoading ? <Skeleton className="h-48" /> : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : brands && brands.length > 0 ? (
          <OrgTree brands={brands} />
        ) : (
          <EmptyState icon={Network} title="No brands configured" />
        )}
      </Panel>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-56 w-full rounded" />)}
        </div>
      ) : isError ? null : (
        <>
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Active Operating Brand</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((b) => <BrandCard key={b.code} brand={b} />)}
              </div>
            </div>
          )}
          {candidates.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Candidate Brands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {candidates.map((b) => <BrandCard key={b.code} brand={b} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
