import AdminHeader from "@/public/components/admin/Header";
import SideBar from "@/public/components/admin/SideBar";
import NotFound from "@/public/components/NotFound";
import { getUser } from "@/server/users/users.service";
import { Toaster } from "sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <div
    //   style={{
    //     minHeight: "100vh",
    //     background: "var(--noir-black)",
    //     display: "flex",
    //   }}
    // >
    //   <Toaster />
    //   <SideBar />
    //   <div
    //     style={{
    //       display: "flex",
    //       flexDirection: "column",
    //       width: "100%",
    //       minHeight: "100vh",
    //       maxHeight: "100vh",
    //       overflow: "hidden",
    //     }}
    //   >
    //     <AdminHeader />
    //     <main
    //       style={{
    //         flex: 1,
    //         overflowY: "auto",
    //         padding: "28px 32px",
    //         background: "var(--noir-black)",
    //       }}
    //     >
    //       {children}
    //     </main>
    //   </div>
    // </div>
    <NotFound />
  );
}
