import { QuotationGenerator } from "@/components/quotation/QuotationGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-shell-gradient px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <QuotationGenerator />
      </div>
    </div>
  );
}
