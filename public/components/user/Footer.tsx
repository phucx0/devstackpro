import Link from "next/link"

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="noir-footer">
            <div className="noir-container">
                <div className="noir-footer-top">
                    {/* Brand Column */}
                    <div className="noir-footer-brand">
                        {/* Logo */}
                        <Link href="/" className="noir-logo" style={{ marginBottom: '4px', display: 'inline-flex' }}>
                            <div className="noir-logo-mark">
                                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 2h4.5C9.538 2 12 4.462 12 7s-2.462 5-5.5 5H2V2Z" fill="#080808"/>
                                </svg>
                            </div>
                            <span className="noir-logo-text">DevStack</span>
                        </Link>

                        <p className="noir-footer-tagline">
                            Sharing programming knowledge, tech insights, and real-world developer experience.
                        </p>

                        {/* Stats */}
                        <div className="noir-footer-num-row">
                            <div className="noir-footer-stat">
                                <div className="noir-footer-stat-num">48<span>+</span></div>
                                <div className="noir-footer-stat-label">Articles</div>
                            </div>
                            <div className="noir-footer-stat">
                                <div className="noir-footer-stat-num">12<span>k</span></div>
                                <div className="noir-footer-stat-label">Readers</div>
                            </div>
                            <div className="noir-footer-stat">
                                <div className="noir-footer-stat-num">7</div>
                                <div className="noir-footer-stat-label">Categories</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="noir-footer-col-title">Navigation</div>
                        <ul className="noir-footer-links">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/articles">Articles</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <div className="noir-footer-col-title">Follow</div>
                        <ul className="noir-footer-links">
                            <li>
                                <a href="https://www.facebook.com/hphucxyz" target="_blank" rel="noopener noreferrer">
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@DevStackPro" target="_blank" rel="noopener noreferrer">
                                    YouTube
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="noir-footer-bottom">
                    <span className="noir-footer-copy">
                        © {year} Dev Stack Pro. All rights reserved.
                    </span>
                    <div className="noir-footer-legal">
                        <a href="/#">Privacy Policy</a>
                        <a href="/#">Terms</a>
                        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
