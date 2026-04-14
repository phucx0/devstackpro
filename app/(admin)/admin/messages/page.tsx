"use client"
import { useState, useEffect } from "react";
import { Eye, Trash2, Mail, MessageSquare } from "lucide-react";
import { Contact } from "@/public/lib/types";
import { contactAPI } from "@/public/lib/api";
import { useUser } from "@/public/providers/UserProvider";

const Status = ({ status }: { status: string }) => {
    const statusConfig = {
        new: { color: "bg-blue-100 text-blue-700", text: "Mới" },
        read: { color: "bg-yellow-100 text-yellow-700", text: "Đã đọc" },
        replied: { color: "bg-green-100 text-green-700", text: "Đã trả lời" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
            {config.text}
        </span>
    );
};

export default function AdminContactsPage() {
    const {token, loading} = useUser()
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!loading && token) fetchContacts();
    }, [pageNumber, loading, token]);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const response = await contactAPI.getContacts(pageNumber, 10, token);
            
            if (response.success) {
                setContacts(response.data);
                setTotalContacts(response.pagination.total);
                setTotalPages(response.pagination.total_pages);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewContact = async (id: number) => {
        try {
            const response = await contactAPI.getContactById(id);
            if (response.success) {
                setSelectedContact(response.data);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error fetching contact:", error);
        }
    };

    const handleDeleteContact = async (id: number) => {
        if (confirm("Bạn có chắc muốn xóa tin nhắn này?")) {
            // TODO: Implement delete API
            console.log("Delete contact:", id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN");
    };

    return (
        <div className="">
            <div className="flex items-center justify-between">
                <div className="text-2xl py-4">Tin nhắn liên hệ</div>
                <div className="text-sm text-gray-600">
                    Tổng: {totalContacts} tin nhắn
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-gray-500">Đang tải...</div>
                </div>
            ) : (
                <table className="w-full rounded-lg overflow-hidden shadow-sm bg-white">
                    <thead className="text-base">
                        <tr className="font-bold">
                            <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Tên</th>
                            <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Email</th>
                            <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Nội dung</th>
                            <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Trạng thái</th>
                            <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Ngày gửi</th>
                            <th className="px-4 py-2 text-left text-gray-700 border-b border-neutral-300">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts && contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-b border-neutral-300">{contact.name}</td>
                                    <td className="px-4 py-3 border-b border-neutral-300">{contact.email}</td>
                                    <td className="px-4 py-3 border-b border-neutral-300">
                                        <div className="truncate max-w-xs">
                                            {contact.message}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border-b border-neutral-300">
                                        <Status status={contact.status} />
                                    </td>
                                    <td className="px-4 py-3 border-b border-neutral-300 text-sm text-gray-600">
                                        {formatDate(contact.created_at)}
                                    </td>
                                    <td className="px-4 py-3 border-b border-neutral-300">
                                        <div className="flex gap-2">
                                            <div
                                                onClick={() => handleViewContact(contact.id)}
                                                className="border border-neutral-400 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                                            >
                                                <Eye size={16} />
                                            </div>
                                            <div
                                                onClick={() => handleDeleteContact(contact.id)}
                                                className="border border-neutral-400 p-2 rounded-lg cursor-pointer hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-10 border-b border-neutral-300">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <MessageSquare className="text-neutral-700" size={60} />
                                        <div>Chưa có tin nhắn nào!</div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={6} className="p-4">
                                <div className="flex items-center gap-4 justify-between">
                                    <div>
                                        Hiển thị {contacts.length > 0 ? (pageNumber - 1) * 10 + 1 : 0} đến{" "}
                                        {Math.min(pageNumber * 10, totalContacts)} trong tổng số {totalContacts} kết quả
                                    </div>
                                    <div className="space-x-4">
                                        <button
                                            className={`px-3 py-1 rounded bg-blue-500 text-white ${
                                                pageNumber === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                            }`}
                                            disabled={pageNumber === 1}
                                            onClick={() => setPageNumber((prev) => prev - 1)}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            className={`px-3 py-1 rounded bg-blue-500 text-white ${
                                                pageNumber === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                            }`}
                                            disabled={pageNumber === totalPages}
                                            onClick={() => setPageNumber((prev) => prev + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            )}

            {/* Modal xem chi tiết */}
            {showModal && selectedContact && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Chi tiết tin nhắn</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Họ tên</div>
                                <div className="text-base">{selectedContact.name}</div>
                            </div>
                            
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Email</div>
                                <div className="text-base">{selectedContact.email}</div>
                            </div>
                            
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Trạng thái</div>
                                <Status status={selectedContact.status} />
                            </div>
                            
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Nội dung</div>
                                <div className="text-base bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                                    {selectedContact.message}
                                </div>
                            </div>
                            
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Ngày gửi</div>
                                <div className="text-base">{formatDate(selectedContact.created_at)}</div>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex gap-2 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                            <a
                                href={`mailto:${selectedContact.email}`}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <Mail size={16} />
                                Trả lời
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}