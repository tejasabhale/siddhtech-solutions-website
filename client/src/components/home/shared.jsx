import React, { useEffect, useRef, useState } from "react";

export const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
export const HEADING = "font-['Plus_Jakarta_Sans',sans-serif]";
export const SERIF = "font-['Instrument_Serif',serif] italic font-normal";

/* ---------- Uniform layout tokens ---------- */
export const SECTION_Y = "py-16 sm:py-20 lg:py-28";
export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12";
export const CARD_PAD = "p-6 sm:p-8 lg:p-10";
export const CARD_RADIUS = "rounded-2xl sm:rounded-3xl";
export const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94F35]";

export const goTo = (e, href) => {
    e.preventDefault(); 

    const el = document.getElementById(href.replace("#", ""));
    if (!el) return;

    if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -80 });
    } else {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: "smooth" });
    }

    window.history.pushState(null, "", href);
};

export function useMediaQuery(query) {
    const get = () =>
        typeof window !== "undefined" && window.matchMedia(query).matches;
    const [matches, setMatches] = useState(get);

    useEffect(() => {
        const mq = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);
        setMatches(mq.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [query]);

    return matches;
}

export function Section({
    id,
    children,
    className = "",
    innerClassName = "",
    dark = false,
}) {
    return (
        <section
            id={id}
            className={`relative scroll-mt-20 ${SECTION_Y} ${dark ? "bg-[#222320] text-[#F5F1E8]" : ""
                } ${className}`}
        >
            <div className={`${CONTAINER} ${innerClassName}`}>{children}</div>
        </section>
    );
}

function useInView() {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSeen(true);
                    io.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return [ref, seen];
}

export function Reveal({ children, delay = 0, y = 28, className = "" }) {
    const [ref, seen] = useInView();

    return (
        <div
            ref={ref}
            className={`ns-reveal ${seen ? "is-in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms`, "--ns-y": `${y}px` }}
        >
            {children}
        </div>
    );
}

export function CountUp({ value }) {
    const match = value.match(/^([\d,]+)(.*)$/);
    const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
    const [n, setN] = useState(0);

    useEffect(() => {
        if (target == null) return undefined;

        let raf;
        const start = performance.now();

        const tick = (time) => {
            const progress = Math.min(1, (time - start) / 1400);
            setN(Math.round(target * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target]);

    if (target == null) return value;

    return (
        <>
            {n.toLocaleString("en-IN")}
            {match[2]}
        </>
    );
}

export function Spotlight({ children, className = "" }) {
    const ref = useRef(null);

    const onMove = (event) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        ref.current.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            className={`group relative overflow-hidden ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(217,79,53,0.18), transparent 70%)",
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}

const BUTTON_VARIANTS = {
    accent: { base: "bg-[#D94F35] text-white", fill: "bg-[#191919]", hover: "text-white" },
    accentOnDark: { base: "bg-[#D94F35] text-white", fill: "bg-[#F5F1E8]", hover: "text-[#191919]" },
    ink: { base: "bg-[#191919] text-[#F5F1E8]", fill: "bg-[#D94F35]", hover: "text-white" },
    ghost: { base: "border border-[#191919]/25 text-[#191919]", fill: "bg-[#191919]", hover: "text-[#F5F1E8]" },
};

export function RollButton({
    href,
    onClick,
    type,
    variant = "accent",
    children,
    className = "",
}) {
    const v = BUTTON_VARIANTS[variant];

    const classNames = `group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-semibold tracking-tight sm:px-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#191919] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E8] ${v.base} ${className}`;

    const inner = (
        <>
            <span
                aria-hidden="true"
                className={`absolute inset-0 translate-y-full rounded-full ${v.fill} transition-transform duration-500 ${EASE} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
            />
            <span className="relative block h-5 overflow-hidden whitespace-nowrap leading-5">
                <span
                    className={`block transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}
                >
                    {children}
                </span>
                <span
                    aria-hidden="true"
                    className={`absolute left-0 top-full block whitespace-nowrap transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full ${v.hover}`}
                >
                    {children}
                </span>
            </span>
        </>
    );

    if (type) {
        return (
            <button type={type} onClick={onClick} className={classNames}>
                {inner}
            </button>
        );
    }

    return (
        <a href={href} onClick={onClick} className={classNames}>
            {inner}
        </a>
    );
}

export function Check({ className = "" }) {
    return (
        <svg
            viewBox="0 0 16 16"
            className={`h-4 w-4 shrink-0 ${className}`}
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 8.5 6.5 12 13 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SectionHeading({ children, accent, intro, dark = false }) {
    return (
        <div className="mb-10 max-w-3xl sm:mb-14 lg:mb-16">
            <Reveal>
                <h2
                    className={`${HEADING} text-balance text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl ${dark ? "text-[#F5F1E8]" : "text-[#191919]"
                        }`}
                >
                    {children}{" "}
                    <span className={`${SERIF} text-[1.08em] text-[#D94F35]`}>
                        {accent}
                    </span>
                </h2>
            </Reveal>

            {intro && (
                <Reveal delay={120}>
                    <p
                        className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? "text-[#F5F1E8]/65" : "text-[#191919]/70"
                            }`}
                    >
                        {intro}
                    </p>
                </Reveal>
            )}
        </div>
    );
}