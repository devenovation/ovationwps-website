import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ApplyClient from "./ApplyClient";

export const metadata = {
  title: "Apply · Ovation Workplace Services",
};

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-navy-deep">
        <ApplyClient jobId={id} />
      </main>
      <Footer />
    </>
  );
}
