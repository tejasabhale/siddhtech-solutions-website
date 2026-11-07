
import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useRef,
    useCallback,
} from "react";

const NAV_LINKS = [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Approach", href: "#approach" },
    // { label: "Pricing", href: "#pricing" },
];

const SECTION_IDS = [
    "home",
    "services",
    "work",
    "process",
    "approach",
    // "pricing",
    "contact",
];

/* Logo file lives in /public */
const LOGO_SRC = "/siddhtech-logo.svg";

/* Set to false if the logo file already contains the "SiddhTech Solutions" name */
const SHOW_WORDMARK = true;

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94F35]";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [hovered, setHovered] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [wipeOrigin, setWipeOrigin] = useState(
        "calc(100% - 40px) 40px"
    );
    const [indicator, setIndicator] = useState({
        left: 0,
        width: 0,
        show: false,
        animate: false,
    });

    const linkRefs = useRef({});
    const barRef = useRef(null);
    const toggleRef = useRef(null);
    const menuRef = useRef(null);
    const wasOpen = useRef(false);

    /* ---------- Scroll: condensed state + progress ---------- */
    useEffect(() => {
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            setScrolled(y > 20);

            const max =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const p =
                max > 0
                    ? Math.min(1, Math.max(0, y / max))
                    : 0;

            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${p})`;
            }

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        window.addEventListener("scroll", onScroll, {
            passive: true,
        });

        window.addEventListener("resize", onScroll);

        update();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    /* ---------- Active section tracking ---------- */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: 0,
            }
        );

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    /* ---------- Sliding indicator ---------- */
    const targetKey =
        hovered ??
        (NAV_LINKS.some(
            (link) => link.href.slice(1) === activeSection
        )
            ? activeSection
            : null);

    const measure = useCallback(() => {
        const el = targetKey
            ? linkRefs.current[targetKey]
            : null;

        if (!el || el.offsetWidth === 0) {
            setIndicator((prev) => ({
                ...prev,
                show: false,
            }));
            return;
        }

        setIndicator((prev) => ({
            left: el.offsetLeft,
            width: el.offsetWidth,
            show: true,
            animate: prev.show,
        }));
    }, [targetKey]);

    useLayoutEffect(() => {
        measure();
    }, [measure, scrolled]);

    useEffect(() => {
        window.addEventListener("resize", measure);

        if (document.fonts?.ready) {
            document.fonts.ready.then(measure);
        }

        return () => {
            window.removeEventListener("resize", measure);
        };
    }, [measure]);

    /* ---------- Mobile menu: resize, Escape and focus trap ---------- */
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) {
                setMenuOpen(false);
            }
        };

        const onKey = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
            }

            if (
                e.key === "Tab" &&
                menuOpen &&
                menuRef.current
            ) {
                const nodes = [
                    toggleRef.current,
                    ...menuRef.current.querySelectorAll("a[href]"),
                ].filter(Boolean);

                const first = nodes[0];
                const last = nodes[nodes.length - 1];

                if (
                    e.shiftKey &&
                    document.activeElement === first
                ) {
                    e.preventDefault();
                    last.focus();
                } else if (
                    !e.shiftKey &&
                    document.activeElement === last
                ) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    /* ---------- Immediate mobile scroll lock + focus management ---------- */
    useLayoutEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        if (!menuOpen) {
            if (wasOpen.current) {
                if (window.innerWidth < 1024) {
                    toggleRef.current?.focus();
                }

                wasOpen.current = false;
            }

            return undefined;
        }

        // Preserve existing inline overflow styles.
        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;

        // Lock document scrolling before the next browser paint.
        html.classList.add("mobile-menu-open");
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        // Stop Lenis scrolling.
        window.lenis?.stop?.();

        // Move keyboard focus into the mobile menu.
        const focusFrame = window.requestAnimationFrame(() => {
            menuRef.current
                ?.querySelector('a[href]:not([tabindex="-1"])')
                ?.focus();
        });

        wasOpen.current = true;

        return () => {
            window.cancelAnimationFrame(focusFrame);

            // Restore original document styles.
            html.classList.remove("mobile-menu-open");
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;

            // Resume Lenis.
            window.lenis?.start?.();
        };
    }, [menuOpen]);

    /* ---------- Toggle mobile menu ---------- */
    const toggleMenu = () => {
        const rect =
            toggleRef.current?.getBoundingClientRect();

        if (rect) {
            setWipeOrigin(
                `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2
                }px`
            );
        }

        setMenuOpen((open) => !open);
    };

    /* ---------- Smooth scroll ---------- */
    const scrollTo = (e, href) => {
        e.preventDefault();
        setMenuOpen(false);

        const el = document.getElementById(
            href.replace("#", "")
        );

        if (!el) return;

        if (window.lenis) {
            window.lenis.scrollTo(el, {
                offset: -80,
            });
        } else {
            const top =
                el.getBoundingClientRect().top +
                window.pageYOffset -
                80;

            window.scrollTo({
                top,
                behavior: "smooth",
            });
        }

        history.pushState(null, "", href);
    };

    return (
        <>
            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    .siddhtech-nav,
                    .siddhtech-nav * {
                        transition-duration: 0.01ms !important;
                        transition-delay: 0ms !important;
                    }
                }

                /* Hide page scrollbar while mobile menu is open */
                html.mobile-menu-open,
                html.mobile-menu-open body {
                    overflow: hidden !important;
                }

                html.mobile-menu-open {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }

                html.mobile-menu-open::-webkit-scrollbar,
                html.mobile-menu-open body::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }

                /* Hide mobile menu scrollbar without disabling touch scrolling */
                html.mobile-menu-open #mobile-menu {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }

                html.mobile-menu-open #mobile-menu::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
            `}</style>

            {/* ================= HEADER ================= */}
            <header
                className={`siddhtech-nav fixed inset-x-0 top-0 z-50 flex justify-center border-b transition-[padding,background-color,border-color,backdrop-filter] duration-500 ${EASE} ${scrolled
                        ? "px-3 sm:px-6"
                        : "px-0"
                    } ${scrolled || menuOpen
                        ? "border-transparent bg-transparent"
                        : "border-[#B9B0A2]/30 bg-[#F5F1E8]/75 backdrop-blur-md"
                    }`}
                style={{
                    paddingTop: scrolled
                        ? "max(0.75rem, env(safe-area-inset-top, 0px))"
                        : "env(safe-area-inset-top, 0px)",
                }}
            >
                <div
                    className={`relative w-full overflow-hidden border transition-all duration-500 ${EASE} ${scrolled
                            ? "max-w-5xl rounded-full"
                            : "max-w-7xl rounded-none"
                        } ${menuOpen
                            ? "border-transparent bg-transparent shadow-none"
                            : scrolled
                                ? "border-[#B9B0A2]/40 bg-[#F5F1E8]/65 shadow-[0_10px_40px_-12px_rgba(25,25,25,0.18)] backdrop-blur-xl"
                                : "border-transparent bg-transparent"
                        }`}
                >
                    <div
                        className={`flex items-center justify-between gap-3 transition-all duration-500 ${EASE} ${scrolled
                                ? "h-14 pl-4 pr-2 sm:pl-5 sm:pr-2.5"
                                : "h-16 px-4 sm:h-20 sm:px-6 lg:px-12"
                            }`}
                    >
                        {/* ================= BRAND ================= */}
                        <a
                            href="#home"
                            onClick={(e) => scrollTo(e, "#home")}
                            aria-label="SiddhTech Solutions, back to top"
                            className={`group flex min-w-0 items-center gap-2 rounded-full no-underline transition-colors duration-500 sm:gap-3 ${FOCUS} focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8] ${menuOpen
                                    ? "text-[#F5F1E8]"
                                    : "text-[#191919]"
                                }`}
                        >
                            {/* Logo from /public */}
                            <span
                                className={`flex shrink-0 items-center justify-center rounded-lg p-0.5 transition-colors duration-500 ${menuOpen
                                        ? "bg-[#F5F1E8]"
                                        : "bg-transparent"
                                    }`}
                            >
                                <img
                                    src={LOGO_SRC}
                                    alt=""
                                    aria-hidden="true"
                                    width="40"
                                    height="40"
                                    decoding="async"
                                    draggable="false"
                                    className={`w-auto select-none object-contain transition-all duration-500 ${EASE} group-hover:scale-105 ${scrolled
                                            ? "h-8 sm:h-9"
                                            : "h-9 sm:h-10 lg:h-11"
                                        }`}
                                />
                            </span>

                            {SHOW_WORDMARK && (
                                <span className="truncate whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold tracking-tight min-[400px]:text-lg sm:text-xl">
                                    SiddhTech Solutions
                                </span>
                            )}
                        </a>

                        {/* ================= DESKTOP NAVIGATION ================= */}
                        <nav
                            aria-label="Primary navigation"
                            onMouseLeave={() => setHovered(null)}
                            className="relative hidden items-center lg:flex"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-[#191919]/[0.07]"
                                style={{
                                    left: indicator.left,
                                    width: indicator.width,
                                    opacity: indicator.show ? 1 : 0,
                                    transition: indicator.animate
                                        ? "left 500ms cubic-bezier(0.22,1,0.36,1), width 500ms cubic-bezier(0.22,1,0.36,1), opacity 300ms"
                                        : "opacity 300ms",
                                }}
                            />

                            {NAV_LINKS.map((link) => {
                                const key = link.href.slice(1);
                                const isActive = activeSection === key;

                                return (
                                    <a
                                        key={link.href}
                                        ref={(el) =>
                                            (linkRefs.current[key] = el)
                                        }
                                        href={link.href}
                                        onClick={(e) =>
                                            scrollTo(e, link.href)
                                        }
                                        onMouseEnter={() =>
                                            setHovered(key)
                                        }
                                        onFocus={() =>
                                            setHovered(key)
                                        }
                                        onBlur={() =>
                                            setHovered(null)
                                        }
                                        aria-current={
                                            isActive ? "true" : undefined
                                        }
                                        className={`relative flex h-9 items-center rounded-full px-4 text-sm font-medium tracking-tight transition-colors duration-300 ${FOCUS} ${isActive
                                                ? "text-[#D94F35]"
                                                : "text-[#191919]/75 hover:text-[#191919]"
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                );
                            })}
                        </nav>

                        {/* ================= CTA + MOBILE TOGGLE ================= */}
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <a
                                href="#contact"
                                onClick={(e) =>
                                    scrollTo(e, "#contact")
                                }
                                className="group relative hidden h-10 items-center overflow-hidden whitespace-nowrap rounded-full bg-[#D94F35] px-5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#191919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8] sm:inline-flex"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute inset-0 translate-y-full rounded-full bg-[#191919] transition-transform duration-500 ${EASE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
                                />

                                <span className="relative block h-5 overflow-hidden leading-5">
                                    <span
                                        className={`block transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}
                                    >
                                        Start a project
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className={`absolute left-0 top-full block whitespace-nowrap transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}
                                    >
                                        Start a project
                                    </span>
                                </span>
                            </a>

                            <button
                                ref={toggleRef}
                                type="button"
                                onClick={toggleMenu}
                                aria-expanded={menuOpen}
                                aria-controls="mobile-menu"
                                aria-label={
                                    menuOpen
                                        ? "Close menu"
                                        : "Open menu"
                                }
                                className={`relative h-11 w-11 shrink-0 rounded-full border transition-colors duration-500 lg:hidden ${FOCUS} ${menuOpen
                                        ? "border-[#F5F1E8]/30 text-[#F5F1E8]"
                                        : "border-[#B9B0A2]/50 text-[#191919]"
                                    }`}
                            >
                                <span
                                    className={`absolute left-1/2 top-1/2 block h-[1.5px] w-5 bg-current transition-transform duration-500 ${EASE}`}
                                    style={{
                                        transform: menuOpen
                                            ? "translate(-50%, 0) rotate(45deg)"
                                            : "translate(-50%, -4px) rotate(0deg)",
                                    }}
                                />

                                <span
                                    className={`absolute left-1/2 top-1/2 block h-[1.5px] w-5 bg-current transition-transform duration-500 ${EASE}`}
                                    style={{
                                        transform: menuOpen
                                            ? "translate(-50%, 0) rotate(-45deg)"
                                            : "translate(-50%, 4px) rotate(0deg)",
                                    }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Scroll progress */}
                    <span
                        ref={barRef}
                        aria-hidden="true"
                        className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#D94F35] transition-opacity duration-300 ${menuOpen
                                ? "opacity-0"
                                : "opacity-100"
                            }`}
                        style={{
                            transform: "scaleX(0)",
                        }}
                    />
                </div>
            </header>

            {/* ================= MOBILE MENU ================= */}
            <div
                ref={menuRef}
                id="mobile-menu"
                aria-hidden={!menuOpen}
                className={`siddhtech-nav fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-[#191919] text-[#F5F1E8] transition-[clip-path,visibility] duration-700 ${EASE} lg:hidden ${menuOpen
                        ? "visible"
                        : "invisible"
                    }`}
                style={{
                    clipPath: menuOpen
                        ? `circle(150% at ${wipeOrigin})`
                        : `circle(0px at ${wipeOrigin})`,
                }}
            >
                <nav
                    aria-label="Mobile navigation"
                    className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-stretch justify-center gap-1 px-6 pb-4 pt-24 text-center sm:px-10"
                >
                    {NAV_LINKS.map((link, i) => {
                        const isActive =
                            activeSection === link.href.slice(1);

                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                tabIndex={menuOpen ? 0 : -1}
                                onClick={(e) =>
                                    scrollTo(e, link.href)
                                }
                                aria-current={
                                    isActive ? "true" : undefined
                                }
                                className={`group flex items-center justify-center gap-3 border-b border-[#F5F1E8]/10 py-3.5 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold tracking-tight transition-all duration-700 sm:py-4 sm:text-4xl ${EASE} focus-visible:text-[#D94F35] focus-visible:outline-none ${menuOpen
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-10 opacity-0"
                                    } ${isActive
                                        ? "text-[#D94F35]"
                                        : "text-[#F5F1E8] hover:text-[#D94F35]"
                                    }`}
                                style={{
                                    transitionDelay: menuOpen
                                        ? `${280 + i * 70}ms`
                                        : "0ms",
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    className="h-2 w-2 shrink-0"
                                />

                                <span>{link.label}</span>

                                <span
                                    aria-hidden="true"
                                    className={`h-2 w-2 shrink-0 rounded-full bg-[#D94F35] transition-transform duration-300 ${isActive
                                            ? "scale-100"
                                            : "scale-0 group-hover:scale-100 group-focus-visible:scale-100"
                                        }`}
                                />
                            </a>
                        );
                    })}
                </nav>

                {/* Mobile menu footer */}
                <div
                    className={`mx-auto w-full max-w-2xl px-6 pt-4 transition-all duration-700 sm:px-10 ${EASE} ${menuOpen
                            ? "translate-y-0 opacity-100"
                            : "translate-y-6 opacity-0"
                        }`}
                    style={{
                        transitionDelay: menuOpen
                            ? `${280 + NAV_LINKS.length * 70}ms`
                            : "0ms",
                        paddingBottom:
                            "max(2rem, env(safe-area-inset-bottom, 0px))",
                    }}
                >
                    <a
                        href="#contact"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={(e) =>
                            scrollTo(e, "#contact")
                        }
                        className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#D94F35] text-base font-semibold text-white transition-colors duration-200 hover:bg-[#BF412A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F1E8]"
                    >
                        Start a project
                    </a>

                    <p className="mt-5 text-center text-sm text-[#F5F1E8]/60">
                        Pune, Maharashtra ·{" "}
                        <a
                            href="#contact"
                            tabIndex={menuOpen ? 0 : -1}
                            onClick={(e) =>
                                scrollTo(e, "#contact")
                            }
                            className="underline-offset-4 hover:text-[#D94F35] hover:underline focus-visible:text-[#D94F35] focus-visible:outline-none"
                        >
                            Get in touch
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
