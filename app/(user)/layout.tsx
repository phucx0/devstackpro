import Header from "@/public/components/user/Header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="noir-main">{children}</main>
    </>
  );
}
