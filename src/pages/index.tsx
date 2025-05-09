import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import CardComponent from "../components/cards";
import { Link } from "@heroui/react";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Eng Sifatli va </span>
          <span className={title({ color: "violet" })}>Hamyonbop&nbsp;</span>
          <br />
          <span className={title()}>Mahsulotlar </span>
          <div className={title({ class: "mt-4" })}>Faqat bizda</div>
        </div>
        <div className="flex justify-between w-full mt-12">
          <h1 className={title({ color: "pink" })}>Mahsulotlar</h1>
          <Link href="/products" underline="hover">
            Hamma Mahsulotlar
          </Link>
        </div>
        {/* Home sahifada faqat 4 ta mahsulot ko'rsatiladi */}
        <CardComponent limit={4} />
      </section>
    </DefaultLayout>
  );
}
