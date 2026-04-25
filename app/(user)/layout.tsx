import EditProfileModal from "@/public/components/user/EditProfileModal";
import Header from "@/public/components/user/Header";
import { AuthProvider } from "@/public/providers/AuthProvider";
import { ModalProvider } from "@/public/providers/ModalProvider";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <AuthProvider>
        <ModalProvider>
          <Header />
          <main className="noir-main">{children}</main>
          <EditProfileModal />
        </ModalProvider>
      </AuthProvider>
    </div>
  );
}
