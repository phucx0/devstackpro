import AdminHeader from "@/public/components/admin/Header";
import SideBar from "@/public/components/admin/SideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <SideBar/>
                <div className="flex flex-col w-full min-h-screen max-h-screen overflow-hidden overflow-y-scroll">
                    {/* <AdminHeader/> */}
                    <main className="p-4 flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
