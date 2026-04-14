"use client"
import React, { useState } from "react";
import { Mail, User, MessageSquare, Send, Globe, Youtube } from "lucide-react";
import { ContactFormData } from "@/public/lib/types";
import { contactAPI } from "@/public/lib/api";

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        message: "",
        email: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) return alert("Please enter your name");
        if (!formData.email.trim()) return alert("Please enter your email");
        if (!formData.message.trim()) return alert("Please enter your message");

        // Validate email format (simple regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return alert("Please enter a valid email address");

        try {
            const result = await contactAPI.submit(formData);

            if (result.success) {
                alert(result.message || "Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
            } else {
                alert(result.message || "Failed to send message. Please try again.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Form Column - 3/5 */}
                    <div className="lg:col-span-3">
                        <div className="border border-gray-700 rounded-lg p-8 ">
                            <h1 className="text-3xl font-bold mb-2">Contact Me</h1>
                            <p className="text-neutral-400 mb-8">Send a message and I will get back to you as soon as possible.</p>

                            {submitted ? (
                                <div className="border-2 border-green-500 rounded-lg p-6 text-center bg-green-950/20">
                                    <div className="text-green-400 text-xl font-semibold mb-2">✓ Message sent!</div>
                                    <p className="text-neutral-300">Thank you for contacting me. I will respond shortly.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium mb-2 text-white">
                                            <User className="w-4 h-4 mr-2" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-white focus:outline-none transition-colors text-white placeholder:text-neutral-400"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium mb-2 text-white">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-white focus:outline-none transition-colors text-white placeholder:text-neutral-400"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium mb-2 text-white">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-white focus:outline-none transition-colors resize-none text-white placeholder:text-neutral-400"
                                            placeholder="Enter your message..."
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full bg-white hover:bg-neutral-200 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Column - 2/5 */}
                    <div className="lg:col-span-2">
                        <div className="border border-gray-700 rounded-lg p-8 sticky top-8">
                            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                            <p className="text-neutral-400 mb-8">
                                You can reach me through the channels below or fill out the form. 
                                I’m always happy to connect and discuss with you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-lg">
                                        <Mail className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">Email</div>
                                        <a href="mailto:phamhoangphuc613p@gmail.com" className="text-sm text-neutral-400 hover:text-white transition-colors break-all">
                                            phamhoangphuc613p@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-lg">
                                        <Globe className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">Website</div>
                                        <a href="https://devstackpro.cloud/" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition-colors break-all">
                                            devstackpro.cloud
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-lg">
                                        <Youtube className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white mb-1">YouTube</div>
                                        <a href="https://www.youtube.com/@DevStackPro" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 hover:text-white transition-colors break-all">
                                            @DevStackPro
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-700">
                                <p className="text-sm text-neutral-400">
                                    Response time: <span className="text-white font-medium">24-48 hours</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}