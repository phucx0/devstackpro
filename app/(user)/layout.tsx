import EditProfileModal from "@/public/components/user/EditProfileModal";
import { AuthProvider } from "@/public/providers/AuthProvider";
import { ModalProvider } from "@/public/providers/ModalProvider";
import LeftSideBar from "../../public/components/user/SideBar/LeftSideBar";
import Header from "@/public/components/user/Header";

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
          <div className="flex items-start mt-(--header-h)">
            <LeftSideBar />
            <div className="flex-1 min-w-0">{children}</div>
            {/* <LeftSideBar /> */}
          </div>
          <EditProfileModal />
        </ModalProvider>
      </AuthProvider>
    </div>
  );
}
