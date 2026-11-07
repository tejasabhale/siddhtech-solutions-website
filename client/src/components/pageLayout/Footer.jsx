import React from "react";
import { CONTAINER, FOCUS } from "../home/shared";

/* Same logo file as the navbar (lives in /public) */
const LOGO_SRC = "/siddhtech-logo.svg";

/* TODO: replace with your real email address */
const CONTACT_EMAIL = "hello@siddhtech.com";

const FOOTER_NAVIGATION = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Selected Work", href: "#work" },
    { label: "Our Process", href: "#process" },
    { label: "Our Approach", href: "#approach" },
    { label: "Pricing", href: "#pricing" },
    { label: "Start a Project", href: "#contact", featured: true },
];

const FOOTER_CAPABILITIES = [
    { number: "01", title: "Web & App Development" },
    { number: "02", title: "Business Automation" },
    { number: "03", title: "Search Engine Optimization" },
    { number: "04", title: "Digital Advertising" },
];

const SOCIAL_LINKS = [
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/your-handle",
        external: true,
    },
    {
        name: "Instagram",
        href: "https://www.instagram.com/your-handle",
        external: true,
    },
    {
        name: "X",
        href: "https://x.com/your-handle",
        external: true,
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/your-handle",
        external: true,
    },
    {
        name: "Email",
        href: `mailto:${CONTACT_EMAIL}`,
        external: false,
    },
];

function SocialIcon({ name }) {
    const stroke = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px]"
            aria-hidden="true"
        >
            {name === "LinkedIn" && (
                <path
                    fill="currentColor"
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
                />
            )}

            {name === "Instagram" && (
                <g {...stroke}>
                    <rect
                        x="3.5"
                        y="3.5"
                        width="17"
                        height="17"
                        rx="5"
                    />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                        cx="17.2"
                        cy="6.8"
                        r="0.6"
                        fill="currentColor"
                    />
                </g>
            )}

            {name === "X" && (
                <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
            )}

            {name === "Facebook" && (
                <path
                    fill="currentColor"
                    d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.25-1.5 1.55-1.5h1.65V3.45C16.4 3.4 15.45 3.3 14.35 3.3c-2.3 0-3.85 1.4-3.85 4V9.8H7.8V13h2.7v8h3z"
                />
            )}

            {name === "Email" && (
                <g {...stroke}>
                    <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="3"
                    />
                    <path d="m4 8 8 5.5L20 8" />
                </g>
            )}
        </svg>
    );
}

const eyebrow =
    "text-[10px] font-mono font-medium uppercase tracking-[0.16em] text-[#B9B0A2]/70";

function FooterHeading({ children }) {
    return (
        <h3 className={`${eyebrow} mb-4`}>
            {children}
        </h3>
    );
}

function scrollToSection(event, href) {
    const target = document.getElementById(href.slice(1));

    if (!target) return;

    event.preventDefault();

    if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -72 });
    } else {
        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            72;

        window.scrollTo({
            top,
            behavior: "smooth",
        });
    }

    window.history.pushState(null, "", href);
}

function scrollToTop() {
    const home = document.getElementById("home");

    if (window.lenis) {
        window.lenis.scrollTo(home || 0);
    } else {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    window.history.pushState(
        null,
        "",
        home ? "#home" : window.location.pathname
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            id="footer"
            className="w-full overflow-hidden border-t border-[#3A3B36] bg-[#191919] text-[#F5F1E8]"
        >
            <div className={`${CONTAINER} py-9 sm:py-11 lg:py-12`}>
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-[1.4fr_0.7fr_1fr] lg:gap-16">

                    {/* Brand */}
                    <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                        <a
                            href="#home"
                            onClick={(event) =>
                                scrollToSection(event, "#home")
                            }
                            aria-label="SiddhTech Solutions home"
                            className={`group inline-flex max-w-full cursor-pointer items-center gap-2.5 rounded-lg sm:gap-3 ${FOCUS}`}
                        >
                            {/* Light chip keeps the black parts of the logo
                                visible on the dark footer (same as navbar menu) */}
                            <span className="flex shrink-0 items-center justify-center rounded-lg bg-[#F5F1E8] p-1">
                                <img
                                    src={LOGO_SRC}
                                    alt=""
                                    aria-hidden="true"
                                    width="45"
                                    height="40"
                                    loading="lazy"
                                    decoding="async"
                                    draggable="false"
                                    className="h-9 w-auto select-none object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:h-10 lg:h-11"
                                />
                            </span>

                            <span className="min-w-0">
                                <span className="block truncate whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold tracking-tight text-[#F5F1E8] transition-colors group-hover:text-[#D94F35] min-[400px]:text-lg sm:text-xl">
                                    SiddhTech Solutions
                                </span>

                                <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-[#D94F35]">
                                    Digital Studio
                                </span>
                            </span>
                        </a>

                        <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#B9B0A2]/80">
                            Building purposeful websites, applications,
                            and digital systems that help businesses
                            work smarter and grow.
                        </p>

                        {/* Socials: all icons share the same size and style */}
                        <ul className="mt-5 flex flex-wrap items-center gap-2.5">
                            {SOCIAL_LINKS.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        {...(item.external
                                            ? {
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                            }
                                            : {})}
                                        aria-label={
                                            item.name === "Email"
                                                ? `Email us at ${CONTACT_EMAIL}`
                                                : item.name
                                        }
                                        title={item.name}
                                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#3A3B36] text-[#B9B0A2] transition-all duration-200 hover:border-[#D94F35] hover:bg-[#D94F35] hover:text-white ${FOCUS}`}
                                    >
                                        <SocialIcon name={item.name} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation */}
                    <nav aria-label="Footer navigation" className="min-w-0">
                        <FooterHeading>
                            Explore
                        </FooterHeading>

                        <ul className="space-y-2">
                            {FOOTER_NAVIGATION.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        onClick={(event) =>
                                            scrollToSection(event, item.href)
                                        }
                                        className={`inline-flex cursor-pointer items-center text-[13px] transition-colors duration-200 hover:text-[#D94F35] ${FOCUS} ${item.featured
                                            ? "font-semibold text-[#D94F35]"
                                            : "text-[#B9B0A2]/85"
                                            }`}
                                    >
                                        {item.label}

                                        {item.featured && (
                                            <span className="ml-1.5" aria-hidden="true">
                                                ↗
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Capabilities */}
                    <div className="min-w-0">
                        <FooterHeading>
                            What We Do
                        </FooterHeading>

                        <ul className="space-y-3.5">
                            {FOOTER_CAPABILITIES.map((item) => (
                                <li key={item.number}>
                                    <a
                                        href="#services"
                                        onClick={(event) =>
                                            scrollToSection(event, "#services")
                                        }
                                        className={`group flex cursor-pointer items-center gap-3 ${FOCUS}`}
                                    >
                                        <span className="font-mono text-[10px] text-[#D94F35]">
                                            {item.number}
                                        </span>

                                        <span className="text-[13px] text-[#B9B0A2]/85 transition-colors group-hover:text-[#F5F1E8]">
                                            {item.title}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#3A3B36]">
                <div
                    className={`${CONTAINER} flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between`}
                    style={{
                        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                    }}
                >
                    <p className="text-[11px] text-[#B9B0A2]/65">
                        © {currentYear} SiddhTech Solutions. All rights reserved.
                    </p>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className={`group inline-flex min-h-8 w-fit cursor-pointer items-center gap-2 text-[11px] font-medium text-[#B9B0A2]/80 transition-colors hover:text-[#D94F35] ${FOCUS}`}
                    >
                        Back to top

                        <span
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:-translate-y-0.5"
                        >
                            ↑
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
}