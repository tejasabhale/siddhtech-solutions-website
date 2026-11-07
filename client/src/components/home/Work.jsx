import React, { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS } from "./data.js";
import {
    CARD_RADIUS,
    FOCUS,
    HEADING,
    Check,
    CountUp,
    Section,
} from "./shared.jsx";

const slug = (text) =>
    String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Shared look for every small card inside the dark preview */
const PREVIEW_CARD = "rounded-xl border border-[#3A3B36] bg-[#222320]";
const PREVIEW_ROW = `${PREVIEW_CARD} work-row px-3 py-2.5 sm:px-3.5 sm:py-3`;

/* One header for all four preview types: label, title, optional aside and optional extra content */
function PreviewHeader({ label, title, aside, children, style }) {
    return (
        <div className="work-rise border-b border-[#3A3B36] pb-3 sm:pb-4" style={style}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <span className="block text-[11px] text-[#D94F35] sm:text-xs">{label}</span>
                    <h4
                        className={`${HEADING} mt-1 text-base font-bold sm:text-lg leading-snug text-[#F5F1E8]`}
                    >
                        {title}
                    </h4>
                </div>
                {aside}
            </div>
            {children}
        </div>
    );
}

function Preview({ project }) {
    const data = project.previewData;
    const rise = (index) => ({ animationDelay: `${300 + index * 100}ms` });

    return (
        <div className="flex min-h-[220px] flex-1 flex-col justify-between gap-4 sm:min-h-[240px] sm:gap-5 lg:min-h-0">
            <div className="space-y-3 sm:space-y-4">
                {project.previewType === "live-browser" && (
                    <>
                        <PreviewHeader label={data.tagline} title={data.headline} style={rise(0)}>
                            <p className="mt-2 text-[13px] leading-relaxed text-[#B9B0A2] sm:text-sm">
                                {data.subtext}
                            </p>
                        </PreviewHeader>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {data.stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`work-rise min-w-0 ${PREVIEW_ROW}`}
                                    style={rise(index + 1)}
                                >
                                    <span
                                        className={`${HEADING} block text-base font-bold leading-none text-[#D94F35] min-[400px]:text-lg sm:text-xl`}
                                    >
                                        <CountUp value={stat.val} />
                                    </span>
                                    <span className="mt-1.5 block text-[11px] leading-tight text-[#B9B0A2] sm:text-xs">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {project.previewType === "learning-interface" && (
                    <>
                        <PreviewHeader
                            label={data.module}
                            title={data.activeCourse}
                            style={rise(0)}
                            aside={
                                <span className="shrink-0 whitespace-nowrap rounded-full border border-[#D94F35]/40 bg-[#D94F35]/15 px-2.5 py-1 text-[11px] text-[#D94F35] sm:px-3 sm:text-xs">
                                    {data.progress}
                                </span>
                            }
                        >
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#3A3B36] sm:mt-4">
                                <div
                                    className="work-fill h-full origin-left rounded-full bg-[#D94F35]"
                                    style={{ width: `${data.progressValue}%`, animationDelay: "550ms" }}
                                />
                            </div>
                        </PreviewHeader>

                        <div className="space-y-2">
                            {data.lessons.map((lesson, index) => (
                                <div
                                    key={lesson.title}
                                    className={`work-rise work-row flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-xs sm:px-3.5 sm:py-3 ${lesson.status === "Completed"
                                        ? "border-[#3A3B36] bg-[#222320]/60 text-[#B9B0A2]"
                                        : lesson.status === "In Progress"
                                            ? "border-[#D94F35]/50 bg-[#D94F35]/10 font-semibold text-[#F5F1E8]"
                                            : "border-[#3A3B36]/60 bg-[#222320]/30 text-[#B9B0A2]/70"
                                        }`}
                                    style={rise(index + 1)}
                                >
                                    <span className="min-w-0">{lesson.title}</span>
                                    <span className="flex shrink-0 items-center gap-1.5">
                                        {lesson.status === "Completed" && (
                                            <Check className="h-3.5 w-3.5 text-[#D94F35]" />
                                        )}
                                        {lesson.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {project.previewType === "marketplace-feed" && (
                    <>
                        <PreviewHeader
                            label="Real-time APMC mandi feed"
                            title={data.marketIndex}
                            style={rise(0)}
                            aside={
                                <span className="shrink-0 pt-0.5 text-[11px] text-[#B9B0A2] sm:text-xs">
                                    {data.updatedAt}
                                </span>
                            }
                        />

                        <div className="space-y-2 text-xs">
                            {data.lots.map((lot, index) => (
                                <div
                                    key={lot.item}
                                    className={`work-rise flex flex-col justify-between gap-2 ${PREVIEW_ROW} transition-colors duration-300 hover:border-[#D94F35]/50 motion-reduce:transition-none sm:flex-row sm:items-center`}
                                    style={rise(index + 1)}
                                >
                                    <div className="min-w-0">
                                        <strong className="block text-[#F5F1E8]">{lot.item}</strong>
                                        <span className="text-[11px] text-[#B9B0A2] sm:text-xs">{lot.origin}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end">
                                        <span className="text-[11px] text-[#B9B0A2] line-through sm:text-xs">
                                            {lot.avgPrice}
                                        </span>
                                        <span className="font-bold text-[#D94F35]">{lot.directOffer}</span>
                                        <span className="rounded-full bg-[#3A3B36] px-2 py-0.5 text-[11px] text-[#F5F1E8]">
                                            {lot.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {project.previewType === "kanban-board" && (
                    <>
                        <PreviewHeader
                            label="Team workflow board"
                            title={data.boardName}
                            style={rise(0)}
                        />

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                            {data.columns.map((column, index) => (
                                <div
                                    key={column.name}
                                    className={`work-rise min-w-0 ${PREVIEW_ROW}`}
                                    style={rise(index + 1)}
                                >
                                    <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-[#B9B0A2] sm:mb-2.5 sm:text-xs">
                                        <span className="min-w-0 truncate">{column.name}</span>
                                        <span className="shrink-0 rounded-full bg-[#3A3B36] px-2 py-0.5">
                                            {column.count}
                                        </span>
                                    </div>
                                    <div className="rounded-lg border border-[#3A3B36]/80 bg-[#2B2C28] p-2.5 text-xs leading-snug text-[#F5F1E8] transition-transform duration-300 motion-reduce:transition-none hover:-translate-y-0.5">
                                        {column.task}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#3A3B36] pt-3 text-[11px] text-[#B9B0A2] sm:pt-4 sm:text-xs">
                <span>SiddhTech Solutions architecture</span>
                <span className="text-[#D94F35]">React · Modular UI</span>
            </div>
        </div>
    );
}

/* Time each project stays on screen (ms) */
const INTERVAL = 7000;

/* All animation lives here, so the section needs nothing in your global CSS */
const CAROUSEL_CSS = `
@keyframes work-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes work-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes work-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

@keyframes work-left-out-next { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(-28px); visibility: hidden; } }
@keyframes work-left-out-prev { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateX(28px); visibility: hidden; } }
@keyframes work-wipe-next { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0 0 0 0); } }
@keyframes work-wipe-prev { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes work-right-out { 0%, 99% { visibility: visible; } 100% { visibility: hidden; } }

.work-rise { animation: work-rise 700ms cubic-bezier(0.22,1,0.36,1) both; }
.work-fill { transform-origin: left; animation: work-fill 1000ms cubic-bezier(0.22,1,0.36,1) both; }
.work-left-out-next { animation: work-left-out-next 400ms cubic-bezier(0.4,0,0.6,1) both; }
.work-left-out-prev { animation: work-left-out-prev 400ms cubic-bezier(0.4,0,0.6,1) both; }
.work-wipe-next { animation: work-wipe-next 1000ms cubic-bezier(0.65,0,0.35,1) 60ms both; }
.work-wipe-prev { animation: work-wipe-prev 1000ms cubic-bezier(0.65,0,0.35,1) 60ms both; }
.work-right-out { animation: work-right-out 1100ms linear both; }

/* Very small phones */
@media (max-width: 359px) {
  .work-pad { padding: 1rem !important; }
}

/* Short desktop windows: tighten spacing so everything still fits one screen */
@media (min-width: 1024px) and (max-height: 820px) {
  .work-pad { padding: 1.5rem !important; }
  .work-title { font-size: 1.5rem !important; margin-top: 0.75rem !important; }
  .work-desc { -webkit-line-clamp: 2 !important; margin-top: 0.625rem !important; }
  .work-list { margin-top: 0.75rem !important; }
  .work-li { padding-top: 0.4rem !important; padding-bottom: 0.4rem !important; }
  .work-row { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
  .work-prev { padding: 0.75rem !important; }
}
@media (min-width: 1024px) and (max-height: 700px) {
  .work-desc { -webkit-line-clamp: 1 !important; }
  .work-li { padding-top: 0.3rem !important; padding-bottom: 0.3rem !important; font-size: 0.8125rem !important; }
}

@media (prefers-reduced-motion: reduce) {
  .work-rise, .work-fill, [class*="work-wipe"], [class*="work-left-out"], .work-right-out { animation: none !important; }
  .work-out-slot { visibility: hidden; }
}
`;

/* 40px touch target on phones/tablets, compact on desktop */
const NAV_BTN =
    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#191919]/70 transition-colors duration-300 motion-reduce:transition-none hover:bg-[#191919]/10 hover:text-[#191919] lg:h-8 lg:w-8";

function Chevron({ dir }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
        </svg>
    );
}

/* One full project card. Two of these are stacked so the old one can leave while the new one arrives. */
function ProjectSlide({ project, role, dir, label }) {
    const d = dir > 0 ? "next" : "prev";
    const isIn = role === "in";
    const rise = (n) => ({ animationDelay: `${300 + n * 80}ms` });

    return (
        <div
            role="group"
            aria-roledescription="slide"
            aria-label={label}
            aria-hidden={!isIn}
            className={`grid min-h-0 [grid-area:1/1] lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] ${isIn
                ? "relative z-10"
                : "work-out-slot pointer-events-none z-0 max-lg:absolute max-lg:inset-x-0 max-lg:top-0"
                }`}
        >
            {/* Left: project details */}
            <div className={`flex min-h-0 min-w-0 flex-col justify-between gap-5 work-pad border-b border-[#B9B0A2]/50 p-4 min-[400px]:p-5 sm:gap-6 sm:p-7 lg:overflow-hidden lg:border-b-0 lg:border-r lg:p-8 ${isIn ? "" : `work-left-out-${d}`
                }`}>
                <div className="min-h-0">
                    <div className="work-rise flex flex-wrap items-center gap-2" style={rise(0)}>
                        <span className="inline-block rounded-full border border-[#D94F35]/25 bg-[#D94F35]/10 px-3 py-1 text-[11px] font-semibold text-[#D94F35] sm:text-xs">
                            {project.badge}
                        </span>
                    </div>

                    <div className="work-rise" style={rise(1)}>
                        <h3
                            className={`work-title ${HEADING} mt-4 text-balance text-[1.375rem] font-bold min-[400px]:text-2xl sm:text-3xl leading-tight tracking-tight sm:mt-5`}
                        >
                            {project.title}
                        </h3>
                        <div className="mt-1.5 text-[13px] text-[#191919]/65 sm:text-sm">
                            {project.category}
                        </div>
                    </div>

                    <p
                        className="work-rise work-desc mt-3 text-[13px] leading-relaxed text-[#191919]/80 sm:mt-4 sm:text-[15px] lg:line-clamp-4"
                        style={rise(2)}
                    >
                        {project.description}
                    </p>

                    <ul className="work-rise work-list mt-4 border-t border-[#B9B0A2]/50 sm:mt-5" style={rise(3)}>
                        {project.deliverables.map((item) => (
                            <li
                                key={item}
                                className="work-li flex items-start gap-3 border-b border-[#B9B0A2]/40 py-2 text-[13px] leading-snug text-[#191919]/85 last:border-b-0 sm:py-2.5 sm:text-sm"
                            >
                                <span
                                    className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-[#D94F35]/40 text-[#D94F35]"
                                    aria-hidden="true"
                                >
                                    <Check className="h-3 w-3" />
                                </span>
                                <span className="min-w-0 pt-0.5">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="work-rise" style={rise(4)}>
                    {project.url ? (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isIn ? 0 : -1}
                            className={`group flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-[#191919] bg-[#191919] px-4 py-3 text-[13px] font-semibold text-[#F5F1E8] transition-colors duration-300 motion-reduce:transition-none hover:border-[#D94F35] hover:bg-[#D94F35] sm:text-sm ${FOCUS}`}
                        >
                            <span className="min-w-0 truncate">Visit {project.displayUrl}</span>
                            <span
                                className="inline-block shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                aria-hidden="true"
                            >
                                ↗
                            </span>
                        </a>
                    ) : (
                        <div className="flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-[#B9B0A2]/60 px-4 py-3 text-[13px] text-[#191919]/75 sm:text-sm">
                            <span className="min-w-0 truncate">{project.displayUrl}</span>
                            <span className="shrink-0 text-[11px] font-semibold text-[#D94F35] sm:text-xs">
                                Internal showcase
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: browser-style preview, revealed with a wipe */}
            <div
                className={`flex min-h-0 min-w-0 flex-col work-pad bg-[#222320] p-4 text-[#F5F1E8] min-[400px]:p-5 sm:p-7 lg:p-8 ${isIn ? `work-wipe-${d}` : "work-right-out"
                    }`}
            >
                <div className="flex items-center justify-between gap-2 rounded-t-xl border border-[#3A3B36] bg-[#191919] px-3 py-2.5 text-xs sm:gap-3 sm:px-4 sm:py-3">
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#D94F35]/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#B9B0A2]/50" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#B9B0A2]/30" />
                    </div>

                    <div className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-[#B9B0A2] sm:text-xs">
                        {project.url || `https://${slug(project.title)}.internal/preview`}
                    </div>

                    <div className="shrink-0 text-[11px] font-semibold text-[#D94F35] sm:text-xs">
                        {project.status === "Live" ? "Live · SSL" : "Sandbox"}
                    </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-xl border-x border-b border-[#3A3B36] bg-[#2B2C28] work-prev p-3 min-[400px]:p-4 sm:p-5 lg:p-6">
                    <Preview project={project} />
                </div>
            </div>
        </div>
    );
}

export default function Work() {
    const total = PROJECTS.length;

    /* Two slots alternate: one shows the current project, the other holds the one leaving */
    const [slots, setSlots] = useState([{ idx: 0, key: 0 }, null]);
    const [activeSlot, setActiveSlot] = useState(0);
    const [dir, setDir] = useState(1);
    const [inView, setInView] = useState(true);
    const [reduced, setReduced] = useState(false);

    const keyRef = useRef(1);
    const lockRef = useRef(0);
    const rootRef = useRef(null);
    const touchRef = useRef(null);

    const active = slots[activeSlot].idx;

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduced(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    /* Only pause while the section is off screen */
    useEffect(() => {
        const node = rootRef.current;
        if (!node || typeof IntersectionObserver === "undefined") return undefined;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            threshold: 0.25,
        });
        io.observe(node);
        return () => io.disconnect();
    }, []);

    const go = useCallback(
        (index, direction) => {
            const target = ((index % total) + total) % total;
            if (target === active) return;
            /* Ignore clicks while the previous change is still playing */
            const now = performance.now();
            if (now - lockRef.current < 650) return;
            lockRef.current = now;
            const other = 1 - activeSlot;
            setDir(direction ?? (target > active ? 1 : -1));
            setSlots((prev) => {
                const copy = [...prev];
                copy[other] = { idx: target, key: keyRef.current++ };
                return copy;
            });
            setActiveSlot(other);
        },
        [active, activeSlot, total],
    );
    const next = useCallback(() => go(active + 1, 1), [go, active]);
    const prev = useCallback(() => go(active - 1, -1), [go, active]);

    const paused = !inView;

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
        }
    };

    const onTouchStart = (e) => {
        const t = e.touches[0];
        touchRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e) => {
        const start = touchRef.current;
        touchRef.current = null;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) next();
            else prev();
        }
    };

    return (
        <Section id="work" className="border-t border-[#B9B0A2]/40 lg:!pb-6 lg:!pt-20">
            <style>{CAROUSEL_CSS}</style>

            {/* On lg+ the block fills one screen (100svh minus the 6.5rem section padding), capped on very tall monitors */}
            <div
                className="flex flex-col lg:h-[calc(100svh-var(--work-offset))] lg:min-h-[620px]"
                style={{ "--work-offset": "6.5rem" }}
            >
                <header className="mb-4 flex shrink-0 flex-col gap-2 sm:mb-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                    <h2
                        className={`${HEADING} text-balance text-[1.625rem] font-bold min-[400px]:text-3xl sm:text-4xl leading-tight tracking-tight`}
                    >
                        Selected work &amp;{" "}
                        <span className="text-[#D94F35]">digital platforms.</span>
                    </h2>
                    <p className="max-w-xl text-[13px] leading-relaxed text-[#191919]/70 sm:text-sm lg:max-w-md">
                        Live client engagements, learning applications, and operational prototypes
                        built to solve tangible problems.
                    </p>
                </header>

                <div
                    ref={rootRef}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Selected work"
                    onKeyDown={onKeyDown}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* ---------- Top bar: minimal timeline + arrows ---------- */}
                    <div className="mb-1 flex shrink-0 items-center gap-3 sm:mb-3 sm:gap-6">
                        <ol className="flex min-w-0 flex-1 gap-2 sm:gap-3" aria-label="Project timeline">
                            {PROJECTS.map((item, index) => {
                                const isActive = index === active;
                                const isPast = index < active;

                                return (
                                    <li key={item.id} className="min-w-0 flex-1">
                                        <button
                                            type="button"
                                            onClick={() => go(index)}
                                            aria-label={`Show project ${index + 1}: ${item.title}`}
                                            aria-current={isActive ? "step" : undefined}
                                            title={item.title}
                                            className={`group flex w-full items-center py-3.5 lg:py-3 ${FOCUS}`}
                                        >
                                            <span
                                                className="block h-[2px] w-full overflow-hidden rounded-full bg-[#B9B0A2]/50 transition-colors duration-300 group-hover:bg-[#B9B0A2]"
                                                aria-hidden="true"
                                            >
                                                <span
                                                    key={isActive ? `run-${slots[activeSlot].key}` : `step-${index}-${isPast}`}
                                                    className="block h-full w-full origin-left bg-[#D94F35]"
                                                    style={
                                                        isActive
                                                            ? reduced
                                                                ? { transform: "scaleX(1)" }
                                                                : {
                                                                    animation: `work-progress ${INTERVAL}ms linear forwards`,
                                                                    animationPlayState: paused
                                                                        ? "paused"
                                                                        : "running",
                                                                }
                                                            : { transform: isPast ? "scaleX(1)" : "scaleX(0)" }
                                                    }
                                                    onAnimationEnd={(e) => {
                                                        if (
                                                            e.animationName === "work-progress" &&
                                                            e.target === e.currentTarget
                                                        ) {
                                                            next();
                                                        }
                                                    }}
                                                />
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>

                        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                            <button
                                type="button"
                                onClick={prev}
                                aria-label="Previous project"
                                className={`${NAV_BTN} ${FOCUS}`}
                            >
                                <Chevron dir="left" />
                            </button>
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next project"
                                className={`${NAV_BTN} ${FOCUS}`}
                            >
                                <Chevron dir="right" />
                            </button>
                        </div>
                    </div>

                    {/* ---------- Slides: static frame, contents animate inside ---------- */}
                    <div
                        className={`relative grid min-h-0 flex-1 touch-pan-y overflow-hidden lg:grid-rows-[minmax(0,1fr)] ${CARD_RADIUS} border border-[#B9B0A2]/50 bg-[#E8E1D6]`}
                        aria-live={reduced ? "polite" : "off"}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                    >
                        {slots.map((slot, i) =>
                            slot ? (
                                <ProjectSlide
                                    key={slot.key}
                                    project={PROJECTS[slot.idx]}
                                    role={i === activeSlot ? "in" : "out"}
                                    dir={dir}
                                    label={`${slot.idx + 1} of ${total}: ${PROJECTS[slot.idx].title}`}
                                />
                            ) : null,
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
}