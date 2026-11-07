import React, { useState } from "react";
import { SERVICES_DATA } from "./data.js";
import {
    EASE,
    FOCUS,
    HEADING,
    Check,
    Reveal,
    Section,
    SectionHeading,
} from "./shared.jsx";

/* ------------------------------------------------------------------ */
/* Icons: inline SVG, 24x24 grid, one stroke weight so they stay uniform */
/* ------------------------------------------------------------------ */
const ICON_PATHS = {
    code: (
        <>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
            <line x1="14" y1="4" x2="10" y2="20" />
        </>
    ),
    workflow: (
        <>
            <rect x="3" y="3" width="8" height="8" rx="2" />
            <rect x="13" y="13" width="8" height="8" rx="2" />
            <path d="M7 11v4a2 2 0 0 0 2 2h4" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </>
    ),
};

const FALLBACK_ICONS = ["code", "workflow", "search", "target"];

// Picks an icon from the service's id/title; falls back to its position.
function getIconName(service, index) {
    const key = `${service.id ?? ""} ${service.title ?? ""}`.toLowerCase();
    if (/automat|workflow|integrat/.test(key)) return "workflow";
    if (/seo|search|organic|rank/.test(key)) return "search";
    if (/\bads?\b|paid|meta|google|campaign|performance|marketing/.test(key))
        return "target";
    if (/web|develop|design|build|site|app/.test(key)) return "code";
    return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

function ServiceIcon({ name, className = "" }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {ICON_PATHS[name]}
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Services() {
    const [open, setOpen] = useState(0);

    return (
        <Section id="services" className="border-t border-[#B9B0A2]/40">
            <SectionHeading
                accent="compound results."
                intro="Four complementary areas that form an integrated growth engine. Each delivers value on its own and multiplies when connected."
            >
                Four disciplines. Engineered to
            </SectionHeading>

            <div className="border-b border-[#B9B0A2]/50">
                {SERVICES_DATA.map((service, index) => {
                    const isOpen = open === index;
                    const iconName = getIconName(service, index);
                    const buttonId = `service-trigger-${service.id}`;
                    const panelId = `service-${service.id}`;

                    return (
                        <Reveal key={service.id} delay={index * 80} y={20}>
                            <div
                                className={`border-t border-[#B9B0A2]/50 transition-colors duration-500 motion-reduce:transition-none ${isOpen ? "bg-[#191919]/[0.025]" : ""
                                    }`}
                            >
                                {/* ---------- Row header ---------- */}
                                <h3 className="m-0">
                                    <button
                                        type="button"
                                        id={buttonId}
                                        onClick={() => setOpen(isOpen ? -1 : index)}
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        className={`group flex w-full items-center gap-4 px-0 py-5 text-left sm:gap-6 sm:px-4 sm:py-7 lg:px-6 lg:py-8 ${FOCUS}`}
                                    >
                                        {/* Icon tile: fixed size so every row lines up */}
                                        <span
                                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors duration-500 motion-reduce:transition-none sm:h-14 sm:w-14 ${isOpen
                                                    ? "border-[#D94F35] bg-[#D94F35] text-white"
                                                    : "border-[#B9B0A2] bg-transparent text-[#191919] group-hover:border-[#191919]"
                                                }`}
                                            aria-hidden="true"
                                        >
                                            <ServiceIcon
                                                name={iconName}
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                            />
                                        </span>

                                        {/* Title + one-line subtitle */}
                                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span
                                                className={`${HEADING} text-balance text-lg font-bold leading-tight tracking-tight transition-colors duration-500 motion-reduce:transition-none sm:text-2xl lg:text-3xl ${isOpen
                                                        ? "text-[#D94F35]"
                                                        : "text-[#191919]"
                                                    }`}
                                            >
                                                {service.title}
                                            </span>
                                            <span className="hidden truncate text-sm text-[#191919]/60 md:block">
                                                {service.subtitle}
                                            </span>
                                        </span>

                                        {/* Plus / minus toggle */}
                                        <span
                                            className={`relative h-9 w-9 shrink-0 rounded-full border transition-colors duration-500 motion-reduce:transition-none sm:h-10 sm:w-10 ${isOpen
                                                    ? "border-[#191919] bg-[#191919] text-white"
                                                    : "border-[#191919]/25 text-[#191919] group-hover:border-[#191919]"
                                                }`}
                                            aria-hidden="true"
                                        >
                                            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                                            <span
                                                className={`absolute left-1/2 top-1/2 h-4 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-500 motion-reduce:transition-none ${EASE} ${isOpen ? "scale-y-0" : "scale-y-100"
                                                    }`}
                                            />
                                        </span>
                                    </button>
                                </h3>

                                {/* ---------- Expandable panel ---------- */}
                                <div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    aria-hidden={!isOpen}
                                    className={`grid transition-[grid-template-rows,opacity,visibility] duration-700 motion-reduce:transition-none ${EASE} ${isOpen
                                            ? "visible grid-rows-[1fr] opacity-100"
                                            : "invisible grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        {/* Left padding on sm+ = icon tile (56) + gap (24) + row padding, so text aligns with the title */}
                                        <div className="grid gap-8 pb-8 sm:pb-10 sm:pl-[96px] sm:pr-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pb-12 lg:pl-[104px] lg:pr-6">
                                            {/* Left: description + outcome */}
                                            <div className="flex min-w-0 flex-col">
                                                <p className="text-base font-semibold leading-snug text-[#191919] sm:text-lg md:hidden">
                                                    {service.subtitle}
                                                </p>
                                                <p className="mt-3 max-w-prose leading-relaxed text-[#191919]/75 md:mt-0">
                                                    {service.summary}
                                                </p>
                                                <p className="mt-6 max-w-prose border-l-2 border-[#D94F35] pl-4 text-sm italic leading-relaxed text-[#191919]/80">
                                                    {service.outcome}
                                                </p>
                                            </div>

                                            {/* Right: deliverables as a hairline list, same language as the rows */}
                                            <ul className="grid min-w-0 content-start gap-x-8 sm:grid-cols-2">
                                                {service.deliverables.map(
                                                    (deliverable, itemIndex) => (
                                                        <li
                                                            key={deliverable}
                                                            className={`flex items-start gap-3 border-t border-[#B9B0A2]/50 py-3.5 text-[15px] leading-snug text-[#191919]/90 transition-all duration-700 motion-reduce:transition-none first:border-t-0 first:pt-0 sm:[&:last-child:nth-child(odd)]:col-span-2 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0 ${EASE} ${isOpen
                                                                ? "translate-x-0 opacity-100"
                                                                : "translate-x-4 opacity-0"
                                                                }`}
                                                            style={{
                                                                transitionDelay: isOpen
                                                                    ? `${200 + itemIndex * 60}ms`
                                                                    : "0ms",
                                                            }}
                                                        >
                                                            <span
                                                                className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[#D94F35]/40 text-[#D94F35]"
                                                                aria-hidden="true"
                                                            >
                                                                <Check className="h-3.5 w-3.5" />
                                                            </span>
                                                            <span className="min-w-0 pt-1">
                                                                {deliverable}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            <p className="mt-8 max-w-prose text-sm text-[#191919]/60 sm:mt-10">
                Have a project that combines several of these? We design
                cross-functional scopes.
            </p>
        </Section>
    );
}