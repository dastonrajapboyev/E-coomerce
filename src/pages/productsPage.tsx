import CardComponent from "@/components/cards";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function ProductsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center mb-8">
          <span className={title({ color: "pink" })}>Barcha Mahsulotlar</span>
        </div>

        {/* Limitni ko'rsatmasak barcha mahsulotlarni chiqaradi */}
        <CardComponent />
      </section>
    </DefaultLayout>
  );
}
