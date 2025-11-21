import { QuotationGenerator } from "@/components/quotation/QuotationGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-shell-gradient px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full">
        <QuotationGenerator />
      </div>
    </div>
  );
}
