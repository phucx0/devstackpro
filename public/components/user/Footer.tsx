import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src={"/svg/logo.svg"}
                                alt="logo"
                                width={40}
                                height={40}
                            />
                            <span className="text-xl font-bold">Dev Stack Pro</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-xs">
                            Sharing programming knowledge, tech insights, and real-world developer experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link href="/articles" className="hover:text-white transition">Articles</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Follow Us</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="https://www.facebook.com/hphucxyz" rel="noopener noreferrer" target="_blank" className="hover:text-white transition">Facebook</a></li>
                            <li><a href="https://www.youtube.com/@DevStackPro" rel="noopener noreferrer" target="_blank" className="hover:text-white transition">YouTube</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Dev Stack Pro. All rights reserved.</p>

                    <div className="flex gap-6">
                        <a href="/#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="/#" className="hover:text-white transition">Terms of Service</a>
                        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Sitemap</a>
                        <a href="/#" className="hover:text-white transition">Newsletter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
