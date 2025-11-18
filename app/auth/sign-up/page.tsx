"use client"
import { authAPI } from "@/public/lib/api";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleRegister = async () => {
        if(password != confirmPassword) {
            console.log("Wrong password");
            return;
        }
        const result = await authAPI.register({
            username: username,
            password: password,
            display_name: displayName,
            email: email
        })
        console.log(result);
        if (result.success) {
            localStorage.setItem("token", result.token ?? "");
            redirect("/sign-in")
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-[400px] rounded-lg bg-white p-4">
                <div className="text-2xl font-bold text-center py-4">Register</div>

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
                    <div className="py-2">Display name</div>
                    <input 
                        className="border border-neutral-300 outline-none p-2 rounded-lg w-full"
                        type="email" 
                        placeholder="Enter display name" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                <div>
                    <div className="py-2">Email</div>
                    <input 
                        className="border border-neutral-300 outline-none p-2 rounded-lg w-full"
                        type="email" 
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
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

                <div>
                    <div className="py-2">Confirm Password</div>
                    <input 
                        className="border border-neutral-300 outline-none p-2 rounded-lg w-full"
                        type="password" 
                        placeholder="Confirm password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button 
                    className="bg-blue-500 font-bold w-full text-white p-2 rounded-lg mt-4 cursor-pointer"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </div>
            </div>

    )
}