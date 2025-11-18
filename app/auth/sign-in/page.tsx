"use client"
import { authAPI } from "@/public/lib/api";
import { useUser } from "@/public/providers/UserProvider";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useUser()
    const handleSignIn = async () => {
        const result = await authAPI.login({
            username: username,
            password: password
        })
        if (result.success) {
            login({
                user: result.user,
                token: result.token
            });
            if(result.user.role === 'admin') {
                redirect("/admin");
            }
        }
        redirect("/");
    };
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-[400px] rounded-lg bg-white p-4">
                <div className="text-2xl font-bold text-center py-4 ">Login</div>
                <div>
                    <div className="py-2">Username</div>
                    <input 
                        className="border border-neutral-300 outline-none p-2 rounded-lg w-full"
                        type="text" 
                        placeholder="Enter username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <div className="py-2">Password</div>
                    <input 
                        className="border border-neutral-300 outline-none p-2 rounded-lg w-full"
                        type="password" 
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleSignIn}
                    className="bg-blue-500 font-bold w-full text-white p-2 rounded-lg mt-4 cursor-pointer">
                    Cofirm
                </button>
            </div>
        </div>
    )
}