import React, { useEffect, useRef } from "react";
import gsap from "gsap";

import {
    HEADING,
    SERIF,
    goTo,
    RollButton,
} from "./shared.jsx";

export default function Hero() {
    const heroRef = useRef(null);

    useEffect(() => {
        if (!heroRef.current) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return undefined;

        const context = gsap.context(() => {
            const titleLines = gsap.utils.toArray(".hero-title-line", heroRef.current);
            const copy = gsap.utils.toArray(".hero-copy", heroRef.current);
            const actions = gsap.utils.toArray(".hero-actions", heroRef.current);

            const timeline = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
            });

            if (titleLines.length) {
                timeline.fromTo(
                    titleLines,
                    {
                        yPercent: 110,
                        autoAlpha: 0,
                    },
                    {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.95,
                        stagger: 0.16,
                    },
                    0
                );
            }

            if (copy.length) {
                timeline.fromTo(
                    copy,
                    {
                        y: 22,
                        autoAlpha: 0,
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.75,
                    },
                    0.4
                );
            }

            if (actions.length) {
                timeline.fromTo(
                    actions,
                    {
                        y: 18,
                        autoAlpha: 0,
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.7,
                    },
                    0.55
                );
            }
        }, heroRef);

        return () => context.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            id="home"
            className="relative isolate flex min-h-screen min-h-[100svh] flex-col justify-center overflow-hidden border-b border-[#B9B0A2]/40 bg-[#F5F1E8] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-8 sm:pb-20 sm:pt-32 lg:px-12"
        >
            {/* Minimal ambient background animation */}
            <div
                aria-hidden="true"
                className="hero-ambient-glow pointer-events-none absolute -top-24 left-1/2 z-0 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full sm:h-[30rem] sm:w-[30rem]"
                style={{
                    background:
                        "radial-gradient(circle, rgba(217,79,53,0.10) 0%, rgba(217,79,53,0.035) 42%, transparent 72%)",
                }}
            />

            {/* Background: architectural grid and warm lighting */}
            <div
                aria-hidden="true"
                className="hero-grid pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 68% 48% at 50% 8%, rgba(217, 79, 53, 0.12), transparent 72%),
                        radial-gradient(ellipse 42% 42% at 94% 76%, rgba(217, 79, 53, 0.055), transparent 72%),
                        linear-gradient(rgba(25, 25, 25, 0.042) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(25, 25, 25, 0.042) 1px, transparent 1px)
                    `,
                    backgroundSize: "auto, auto, 56px 56px, 56px 56px",
                    maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.68) 62%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.68) 62%, transparent 100%)",
                }}
            />

            {/* Desktop technical ring composition */}
            <svg
                aria-hidden="true"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full sm:block"
                fill="none"
            >
                <defs>
                    <linearGradient
                        id="hero-ring-gradient"
                        x1="720"
                        y1="80"
                        x2="1320"
                        y2="760"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#D94F35" stopOpacity="0.20" />
                        <stop offset="1" stopColor="#191919" stopOpacity="0.025" />
                    </linearGradient>
                    <radialGradient id="hero-center-glow">
                        <stop stopColor="#D94F35" stopOpacity="0.075" />
                        <stop offset="1" stopColor="#D94F35" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <circle
                    cx="1150"
                    cy="405"
                    r="330"
                    fill="url(#hero-center-glow)"
                />
                <circle
                    cx="1150"
                    cy="405"
                    r="185"
                    stroke="url(#hero-ring-gradient)"
                    strokeWidth="1"
                />
                <circle
                    cx="1150"
                    cy="405"
                    r="235"
                    stroke="#191919"
                    strokeOpacity="0.055"
                    strokeWidth="1"
                />
                <circle
                    cx="1150"
                    cy="405"
                    r="285"
                    stroke="#191919"
                    className="hero-orbit-ring"
                    strokeOpacity="0.045"
                    strokeWidth="1"
                    strokeDasharray="3 9"
                />
                <circle
                    cx="1150"
                    cy="405"
                    r="330"
                    stroke="#D94F35"
                    strokeOpacity="0.07"
                    strokeWidth="1"
                />

                <path
                    d="M820 405H1480M1150 75V735"
                    stroke="#191919"
                    strokeOpacity="0.045"
                    strokeWidth="1"
                    strokeDasharray="2 9"
                />

                <circle
                    cx="1150"
                    cy="405"
                    r="4"
                    fill="#D94F35"
                    fillOpacity="0.45"
                />
                <circle
                    cx="1335"
                    cy="405"
                    r="3"
                    fill="#D94F35"
                    fillOpacity="0.55"
                />
                <circle
                    cx="1150"
                    cy="170"
                    r="3"
                    fill="#191919"
                    fillOpacity="0.18"
                />

                <path
                    d="M74 112V132M64 122H84M1360 704V724M1350 714H1370"
                    stroke="#D94F35"
                    strokeOpacity="0.35"
                    strokeWidth="1.2"
                />
                <circle
                    cx="74"
                    cy="122"
                    r="3"
                    stroke="#D94F35"
                    strokeOpacity="0.35"
                />
                <circle
                    cx="1360"
                    cy="714"
                    r="3"
                    stroke="#D94F35"
                    strokeOpacity="0.35"
                />
            </svg>

            {/* Mobile concentric detail, positioned outside the text column */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-[13rem] top-[17%] z-0 h-[25rem] w-[25rem] rounded-full border border-[#D94F35]/10 sm:hidden"
            >
                <div className="absolute inset-8 rounded-full border border-[#191919]/[0.06]" />
                <div className="absolute inset-16 rounded-full border border-dashed border-[#D94F35]/[0.12]" />
                <div className="absolute inset-24 rounded-full border border-[#191919]/[0.05]" />
                <span className="absolute left-[3.2rem] top-1/2 h-1.5 w-1.5 rounded-full bg-[#D94F35]/40" />
            </div>

            {/* Bottom fade blends the pattern into the next section */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 bg-gradient-to-b from-transparent to-[#F5F1E8] sm:h-40"
            />

            {/* Hero content */}
            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                {/* Main heading */}
                <h1
                    className={`${HEADING} w-full text-[clamp(2.55rem,10.5vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.06em] text-[#191919] sm:text-6xl sm:leading-[1.08] sm:tracking-[-0.055em] md:text-7xl lg:text-[88px]`}
                >
                    <span className="block overflow-hidden pb-[0.12em]">
                        <span className="hero-title-line block">
                            Digital work,
                        </span>
                    </span>

                    <span className="block overflow-hidden pb-[0.12em]">
                        <span
                            className={`hero-title-line mx-auto block max-w-[13ch] ${SERIF} tracking-[-0.035em] text-[#D94F35] sm:max-w-none sm:tracking-normal`}
                        >
                            built to move business forward.
                        </span>
                    </span>
                </h1>

                {/* Description */}
                <p className="hero-copy mt-6 max-w-xl text-[15px] leading-[1.7] text-[#191919]/65 sm:mt-8 sm:max-w-2xl sm:text-lg sm:leading-9">
                    We design and build websites, applications, and
                    connected digital systems that help businesses
                    work smarter, reach more people, and grow with
                    confidence.
                </p>

                {/* Call-to-action buttons */}
                <div className="hero-actions mt-8 flex w-full max-w-xs flex-col items-stretch justify-center gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
                    <RollButton
                        href="#contact"
                        onClick={(event) => goTo(event, "#contact")}
                        variant="accent"
                    >
                        Start a project
                    </RollButton>

                    <RollButton
                        href="#work"
                        onClick={(event) => goTo(event, "#work")}
                        variant="ghost"
                    >
                        Explore our work
                    </RollButton>
                </div>
            </div>

            <style>{`
                .hero-ambient-glow {
                    animation: hero-ambient-drift 16s ease-in-out infinite;
                    will-change: transform, opacity;
                }

                .hero-orbit-ring {
                    transform-box: fill-box;
                    transform-origin: center;
                    animation: hero-orbit 90s linear infinite;
                }

                @keyframes hero-ambient-drift {
                    0%, 100% {
                        transform: translate3d(-50%, 0, 0) scale(1);
                        opacity: 0.55;
                    }
                    50% {
                        transform: translate3d(-50%, 12px, 0) scale(1.045);
                        opacity: 0.85;
                    }
                }

                @keyframes hero-orbit {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (min-width: 640px) {
                    .hero-grid {
                        background-size: auto, auto, 72px 72px, 72px 72px !important;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-ambient-glow,
                    .hero-orbit-ring {
                        animation: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
