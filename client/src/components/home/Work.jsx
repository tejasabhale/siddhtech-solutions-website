import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJECTS } from "./data.js";
import {
    CARD_RADIUS,
    FOCUS,
    HEADING,
    Check,
    CountUp,
    Section,
} from "./shared.jsx";

gsap.registerPlugin(useGSAP);

const slug = (text) =>
    String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Orange accent words in titles: serif italic (--font-serif in your theme).
   font-normal because Instrument Serif has no bold aweight, and the slightly
   larger size balances the serif's smaller x-height. */
const ACCENT_TITLE =
    "font-serif font-normal italic text-[#D94F35] text-[1.12em] leading-none";

/* Shared look for every small card inside the dark preview */
const PREVIEW_CARD = "rounded-xl border border-[#3A3B36] bg-[#222320]";
const PREVIEW_ROW = `${PREVIEW_CARD} work-row px-3 py-2.5 sm:px-3.5 sm:py-3`;

/* ---------- Shared motion helpers ---------- */
const EASE = [0.22, 1, 0.36, 1];

/* A parent staggers its children; each child only needs variants={riseV} */
const stagger = {
    hidden: {},
    show: { transition: { delayChildren: 0.3, staggerChildren: 0.09 } },
};
const riseV = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* GSAP number tween: 0 -> value, re-tweens whenever value changes */
function Ticker({ value, suffix = "", className }) {
    const ref = useRef(null);
    const state = useRef({ n: 0 });
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            gsap.to(state.current, {
                n: value,
                duration: reduced ? 0 : 0.9,
                ease: "power3.out",
                onUpdate: () => {
                    if (ref.current) {
                        ref.current.textContent = `${Math.round(state.current.n)}${suffix}`;
                    }
                },
            });
        },
        { dependencies: [value, suffix] },
    );

    return (
        <span ref={ref} className={className}>
            0{suffix}
        </span>
    );
}

/* One header for all preview types: label, title, optional aside and optional extra content */
function PreviewHeader({ label, title, aside, children }) {
    return (
        <motion.div variants={riseV} className="border-b border-[#3A3B36] pb-3 sm:pb-4">
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
        </motion.div>
    );
}

/* ---------- TaskFlow-style kanban preview ---------- */
const TF = "#F97316"; /* TaskFlow's orange-500 */
const TF_RGB = "rgba(249,115,22,1)";
const BORDER = "rgba(58,59,54,0.8)";
const SPRING = { type: "spring", stiffness: 380, damping: 34, mass: 0.8 };
const TF_COLUMNS = [
    { key: "todo", name: "To Do" },
    { key: "progress", name: "In Progress" },
    { key: "done", name: "Done" },
];
const TF_EXTRAS = [
    { title: "Wire JWT role checks", tag: "Auth", priority: "high", who: "TA" },
    { title: "Polish sidebar states", tag: "UI", priority: "med", who: "RK" },
    { title: "Write Swagger docs", tag: "API", priority: "low", who: "SM" },
];
const TF_NEW_TASKS = ["Review pull request", "Fix mobile layout", "Add task filters", "Seed demo data"];
const PRIORITY_DOT = { high: "#F97316", med: "#FBBF24", low: "#8A8478" };
const MAX_TASKS = 7;

function buildSeed(data) {
    const statuses = ["todo", "progress", "done"];
    const fromData = (data.columns || []).slice(0, 3).map((column, i) => ({
        id: `seed-${i}`,
        title: column.task,
        tag: ["Backend", "UI", "QA"][i],
        priority: ["high", "med", "low"][i],
        who: ["TA", "RK", "SM"][i],
        status: statuses[i],
    }));
    const extras = TF_EXTRAS.map((task, i) => ({
        ...task,
        id: `extra-${i}`,
        status: ["progress", "todo", "done"][i],
    }));
    return [...fromData, ...extras];
}

const nextStatus = (status) =>
    status === "todo" ? "progress" : status === "progress" ? "done" : "todo";

function KanbanPreview({ data }) {
    const [tasks, setTasks] = useState(() => buildSeed(data));
    const [paused, setPaused] = useState(false);
    const [flash, setFlash] = useState(null);
    const reduced = useReducedMotion();

    const newCount = useRef(0);
    const seed = useRef(null);
    if (!seed.current) seed.current = buildSeed(data);

    const move = useCallback((id) => {
        setFlash(id);
        setTasks((prev) => {
            const task = prev.find((t) => t.id === id);
            if (!task) return prev;
            /* Moved card goes to the end of its new column */
            return [...prev.filter((t) => t.id !== id), { ...task, status: nextStatus(task.status) }];
        });
    }, []);

    useEffect(() => {
        if (!flash) return undefined;
        const id = setTimeout(() => setFlash(null), 900);
        return () => clearTimeout(id);
    }, [flash]);

    const addTask = () => {
        if (tasks.length >= MAX_TASKS) return;
        const title = TF_NEW_TASKS[newCount.current % TF_NEW_TASKS.length];
        const id = `new-${newCount.current++}`;
        setFlash(id);
        setTasks((prev) => [
            ...prev,
            { id, title, tag: "Task", priority: "med", who: "TA", status: "todo" },
        ]);
    };

    /* Auto-play: finish in-progress work first, then start the next to-do; reset when all done */
    useEffect(() => {
        if (paused || reduced) return undefined;
        const allDone = tasks.every((t) => t.status === "done");
        const id = setTimeout(
            () => {
                if (allDone) {
                    setTasks(seed.current);
                    return;
                }
                const target =
                    tasks.find((t) => t.status === "progress") ||
                    tasks.find((t) => t.status === "todo");
                if (target) move(target.id);
            },
            allDone ? 2200 : 2600,
        );
        return () => clearTimeout(id);
    }, [tasks, paused, reduced, move]);

    const doneCount = tasks.filter((t) => t.status === "done").length;
    const percent = Math.round((doneCount / tasks.length) * 100);

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="space-y-3 sm:space-y-4"
        >
            <PreviewHeader
                label="TaskFlow · Team workflow board"
                title={data.boardName}
                aside={
                    <span
                        className="shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] tabular-nums sm:px-3 sm:text-xs"
                        style={{ borderColor: `${TF}66`, backgroundColor: `${TF}26`, color: TF }}
                    >
                        <Ticker value={percent} suffix="% done" />
                    </span>
                }
            >
                <div className="mt-3 flex items-center gap-3 sm:mt-4">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3A3B36]">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: TF }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
                        />
                    </div>
                    <motion.button
                        type="button"
                        onClick={addTask}
                        disabled={tasks.length >= MAX_TASKS}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        className="shrink-0 rounded-full border border-[#3A3B36] px-2.5 py-1 text-[11px] text-[#F5F1E8] transition-colors duration-300 hover:border-[#F97316] hover:text-[#F97316] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#3A3B36] disabled:hover:text-[#F5F1E8] motion-reduce:transition-none sm:text-xs"
                    >
                        + Add task
                    </motion.button>
                </div>
            </PreviewHeader>

            <LayoutGroup>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {TF_COLUMNS.map((column) => {
                        const items = tasks.filter((t) => t.status === column.key);
                        return (
                            <motion.div
                                key={column.key}
                                layout
                                variants={riseV}
                                className={`min-w-0 ${PREVIEW_CARD} p-2 sm:p-2.5`}
                            >
                                <div className="mb-2 flex items-center justify-between gap-1 text-[11px] text-[#B9B0A2] sm:text-xs">
                                    <span className="flex min-w-0 items-center gap-1.5">
                                        <span
                                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    column.key === "todo"
                                                        ? "#8A8478"
                                                        : column.key === "progress"
                                                            ? "#FBBF24"
                                                            : TF,
                                            }}
                                        />
                                        <span className="truncate">{column.name}</span>
                                    </span>
                                    <span className="shrink-0 rounded-full bg-[#3A3B36] px-1.5 py-0.5 tabular-nums">
                                        {items.length}
                                    </span>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    {items.map((task) => {
                                        const isDone = task.status === "done";
                                        const isFlash = flash === task.id;
                                        return (
                                            <motion.button
                                                key={task.id}
                                                layout
                                                layoutId={task.id}
                                                type="button"
                                                onClick={() => move(task.id)}
                                                aria-label={`${task.title}: ${column.name}. Click to move.`}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                    borderColor: BORDER,
                                                    boxShadow: "0 0 0 0px rgba(249,115,22,0)",
                                                }}
                                                animate={{
                                                    opacity: isDone ? 0.7 : 1,
                                                    scale: 1,
                                                    borderColor: isFlash ? TF_RGB : BORDER,
                                                    boxShadow: isFlash
                                                        ? "0 0 0 3px rgba(249,115,22,0.2)"
                                                        : "0 0 0 0px rgba(249,115,22,0)",
                                                }}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                                transition={{
                                                    layout: reduced ? { duration: 0 } : SPRING,
                                                    default: { duration: 0.35, ease: EASE },
                                                }}
                                                className="block w-full rounded-lg border bg-[#2B2C28] p-2 text-left sm:p-2.5"
                                            >
                                                <span
                                                    className={`line-clamp-2 block text-[11px] leading-snug text-[#F5F1E8] sm:text-xs ${isDone ? "line-through decoration-[#B9B0A2]/60" : ""}`}
                                                >
                                                    {task.title}
                                                </span>
                                                <span className="mt-2 flex items-center justify-between gap-1">
                                                    <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-[#B9B0A2]">
                                                        {isDone ? (
                                                            <Check className="h-3 w-3 shrink-0 text-[#F97316]" />
                                                        ) : (
                                                            <span
                                                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                                                style={{ backgroundColor: PRIORITY_DOT[task.priority] }}
                                                            />
                                                        )}
                                                        <span className="truncate">{task.tag}</span>
                                                    </span>
                                                    <span
                                                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
                                                        style={{ backgroundColor: TF }}
                                                    >
                                                        {task.who}
                                                    </span>
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </LayoutGroup>
        </motion.div>
    );
}

/* ---------- Live-site preview (animated mock, used when a project has no real preview) ---------- */

/* Framer: cycling "live activity" line */
function ActivityFeed({ items = [] }) {
    const [i, setI] = useState(0);
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced || items.length < 2) return undefined;
        const id = setInterval(() => setI((v) => (v + 1) % items.length), 2800);
        return () => clearInterval(id);
    }, [items.length, reduced]);

    if (!items.length) return null;

    return (
        <motion.div
            variants={riseV}
            className={`${PREVIEW_CARD} relative h-11 overflow-hidden px-3 sm:h-12`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={i}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex h-full items-center gap-2 text-[11px] text-[#B9B0A2] sm:text-xs"
                >
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D94F35] opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D94F35]" />
                    </span>
                    <span className="truncate">{items[i]}</span>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

/* GSAP: one orchestrated timeline on mount, then a gentle idle float */
function LiveSitePreview({ data }) {
    const root = useRef(null);

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power3.out" } });
            tl.from(".ls-tag", { y: 12, opacity: 0, duration: 0.5 })
                .from(".ls-word", { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.06 }, "-=0.2")
                .from(".ls-sub", { y: 12, opacity: 0, duration: 0.5 }, "-=0.4")
                .from(
                    ".ls-stat",
                    { y: 18, opacity: 0, scale: 0.96, duration: 0.6, stagger: 0.1 },
                    "-=0.2",
                )
                .from(
                    ".ls-bar",
                    { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power2.inOut" },
                    "-=0.4",
                )
                .from(".ls-chip", { y: 10, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.7");

            gsap.to(".ls-chip", {
                y: -3,
                duration: 2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: { each: 0.3, from: "random" },
                delay: 2.5,
            });
        },
        { scope: root },
    );

    return (
        <div ref={root} className="space-y-3 sm:space-y-4">
            <div className="border-b border-[#3A3B36] pb-3 sm:pb-4">
                <span className="ls-tag block text-[11px] text-[#D94F35] sm:text-xs">{data.tagline}</span>
                <h4
                    className={`${HEADING} mt-1 text-base font-bold leading-snug text-[#F5F1E8] sm:text-lg`}
                >
                    {data.headline.split(" ").map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden align-bottom">
                            <span className="ls-word inline-block">{word}&nbsp;</span>
                        </span>
                    ))}
                </h4>
                <p className="ls-sub mt-2 text-[13px] leading-relaxed text-[#B9B0A2] sm:text-sm">
                    {data.subtext}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {data.stats.map((stat) => (
                    <div key={stat.label} className={`ls-stat min-w-0 ${PREVIEW_ROW}`}>
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

            {data.progress && (
                <div className={`${PREVIEW_CARD} px-3 py-2.5 sm:px-3.5 sm:py-3`}>
                    <div className="mb-2 flex items-center justify-between text-[11px] text-[#B9B0A2] sm:text-xs">
                        <span>{data.progress.label}</span>
                        <span className="tabular-nums text-[#D94F35]">{data.progress.value}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#3A3B36]">
                        <div
                            className="ls-bar h-full rounded-full bg-[#D94F35]"
                            style={{ width: `${data.progress.value}%` }}
                        />
                    </div>
                </div>
            )}

            {data.chips && (
                <div className="flex flex-wrap gap-1.5">
                    {data.chips.map((chip) => (
                        <span
                            key={chip}
                            className="ls-chip rounded-full border border-[#3A3B36] bg-[#222320] px-2.5 py-1 text-[11px] text-[#F5F1E8]"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            )}

            <motion.div variants={stagger} initial="hidden" animate="show">
                <ActivityFeed items={data.activity} />
            </motion.div>
        </div>
    );
}

/* ---------- Coded site previews: rebuilt in JSX at desktop width, then scaled to fit the panel ----------
   Both follow the real sites' layout: navbar, then a two-column hero with a card on the right.
   GSAP runs the entrance, count-up, typewriter and sparkle loops.
   Framer Motion handles the cards (spring in, slow float), the primary button sweep and the status dot. */
const SITE_W = 1100; /* width the mini-sites are drawn at */
const SITE_SANS = '"Plus Jakarta Sans", system-ui, "Segoe UI", Roboto, Arial, sans-serif';
const SITE_SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
const SITE_DEVANAGARI = '"Noto Sans Devanagari", "Nirmala UI", Mangal, sans-serif';
const SITE_HAND = '"Caveat", "Segoe Script", "Bradley Hand", "Comic Sans MS", cursive';
const SITE_HAND_DEV = '"Kalam", "Noto Sans Devanagari", "Nirmala UI", sans-serif';

const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ScaledSite({ label, children }) {
    const box = useRef(null);
    const [dims, setDims] = useState({ scale: 0.4, h: 800 });

    useEffect(() => {
        const node = box.current;
        if (!node) return undefined;
        const measure = () => {
            const scale = node.clientWidth / SITE_W || 0.4;
            setDims({ scale, h: node.clientHeight / scale });
        };
        measure();
        if (typeof ResizeObserver === "undefined") return undefined;
        const ro = new ResizeObserver(measure);
        ro.observe(node);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={box}
            role="img"
            aria-label={label}
            className="relative min-h-[240px] flex-1 overflow-hidden bg-white sm:min-h-[300px] lg:min-h-0"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 select-none overflow-hidden"
                style={{
                    width: SITE_W,
                    height: dims.h,
                    transform: `scale(${dims.scale})`,
                    transformOrigin: "top left",
                    fontFamily: SITE_SANS,
                }}
            >
                {children}
            </div>
        </div>
    );
}

function SproutMark({ className }) {
    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
            <g className="sh-sprout">
                <path d="M32 60V36" stroke="#2E8B2E" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M32 38C19 38 6 29 6 8c15 0 26 9 26 30z" fill="#6CC04A" />
                <path d="M32 38C45 38 58 29 58 8c-15 0-26 9-26 30z" fill="#2E8B2E" />
            </g>
        </svg>
    );
}

function HeartIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 5 6 5c2.2 0 3.6 1.2 4.4 2.5h3.2C14.4 6.2 15.8 5 18 5c3.4 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
        </svg>
    );
}

/* One light sweep that loops across the primary button (Framer Motion) */
function Shine({ reduced, delay = 3 }) {
    if (reduced) return null;
    return (
        <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "420%" }}
            transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 4, delay }}
        />
    );
}

/* Word inside a masked line, so GSAP can slide it up from below */
function MaskWord({ style, children }) {
    return (
        <>
            <span
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.14em", marginBottom: "-0.14em" }}
            >
                <span className="sh-word inline-block" style={style}>
                    {children}
                </span>
            </span>{" "}
        </>
    );
}

/* ----- sproughub.info ----- */
function SproughHubSite() {
    const root = useRef(null);
    const count = useRef(null);
    const reduced = useReducedMotion();
    const GOLD = "#C99A2E";
    const GOLD_TEXT = "#D3A62F";
    const MINT = "#2FD3A0";
    const accent = { color: GOLD_TEXT, fontStyle: "italic", fontWeight: 600 };

    useGSAP(
        () => {
            if (prefersReducedMotion()) return;

            if (count.current) count.current.textContent = "0%";
            const n = { v: 0 };

            const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
            tl.from(".sh-nav", { y: -12, opacity: 0, duration: 0.5, stagger: 0.04 })
                .from(".sh-sprout", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, ease: "back.out(1.8)" }, 0.2)
                .from(".sh-badge", { y: 12, opacity: 0, duration: 0.5 }, 0.4)
                .from(".sh-word", { yPercent: 118, duration: 0.85, stagger: 0.055 }, 0.55)
                .from(".sh-mar", { y: 12, opacity: 0, duration: 0.6 }, "-=0.45")
                .from(".sh-para", { y: 12, opacity: 0, duration: 0.6 }, "-=0.4")
                .from(".sh-btn", { y: 14, opacity: 0, duration: 0.5, stagger: 0.09 }, "-=0.35")
                .from(".sh-rule", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power2.inOut" }, "-=0.2")
                .from(".sh-stat", { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, "<0.15")
                .to(
                    n,
                    {
                        v: 100,
                        duration: 1.3,
                        ease: "power2.out",
                        onUpdate: () => {
                            if (count.current) count.current.textContent = `${Math.round(n.v)}%`;
                        },
                    },
                    "<",
                );

            gsap.to(".sh-star", {
                opacity: 0.25,
                duration: 1.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                stagger: { each: 0.35, from: "random" },
            });
        },
        { scope: root },
    );

    return (
        <div ref={root} className="flex h-full flex-col bg-[#14412E] text-white">
            {/* Navbar */}
            <div className="relative z-10 flex h-[62px] shrink-0 items-center justify-between bg-white px-[64px] text-[#1F2937]">
                <div className="sh-nav flex items-center gap-2">
                    <SproutMark className="h-[30px] w-[30px]" />
                    <div className="leading-none">
                        <div className="text-[21px] font-semibold tracking-tight text-[#1C4A33]">
                            Sproug <span style={{ color: "#B8891F" }}>Hub</span>
                        </div>
                        <div
                            className="mt-[1px] text-[8.5px] font-extrabold"
                            style={{ color: "#B8891F", fontFamily: SITE_DEVANAGARI }}
                        >
                            स्प्रॉग हब
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-[18px] text-[13px] font-medium">
                    <span className="sh-nav border-b-2 border-[#B8891F] py-1 text-[#B8891F]">Home</span>
                    <span className="sh-nav">About</span>
                    <span className="sh-nav">Programs</span>
                    <span className="sh-nav">Gallery</span>
                    <span className="sh-nav flex items-center gap-1.5">
                        Yearbook
                        <span className="rounded border border-[#E6D6A8] bg-[#F7EFD6] px-1.5 py-[1px] text-[8px] font-bold text-[#B8891F]">
                            PDF
                        </span>
                    </span>
                    <span className="sh-nav">Campaigns</span>
                    <span className="sh-nav">Volunteers</span>
                    <span className="sh-nav">Contact</span>
                </div>

                <div className="flex items-center gap-2 text-[13px] font-semibold">
                    <span className="sh-nav rounded-md border border-[#C9CDD2] px-3.5 py-[7px]">Volunteer</span>
                    <span
                        className="sh-nav flex items-center gap-1.5 rounded-md px-3.5 py-[7px] text-white"
                        style={{ backgroundColor: GOLD }}
                    >
                        <HeartIcon className="h-3.5 w-3.5" />
                        Donate (QR)
                    </span>
                </div>
            </div>

            {/* Hero */}
            <div
                className="grid min-h-[560px] flex-1 grid-cols-[650px_298px] content-center justify-center gap-x-[24px] overflow-hidden px-[64px] py-10"
                style={{ background: "linear-gradient(135deg, #1A4B33 0%, #144030 55%, #103726 100%)" }}
            >
                <div>
                    <div
                        className="sh-badge inline-flex h-[27px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 text-[12px]"
                        style={{ color: "#EBD88F" }}
                    >
                        <span className="text-[13px]" style={{ color: GOLD }}>✺</span>
                        Pune, Maharashtra • Since 2018
                        <span className="text-white/40">|</span>
                        <b className="text-white" style={{ fontFamily: SITE_DEVANAGARI }}>स्प्रॉग हब</b>
                    </div>

                    <h1
                        className="mt-[26px] text-[44px] font-bold leading-[1.15] tracking-[-0.04em]"
                        style={{ fontFamily: SITE_SERIF }}
                    >
                        <span className="block whitespace-nowrap">
                            <MaskWord>Small</MaskWord>
                            <MaskWord>acts,</MaskWord>
                            <MaskWord>planted</MaskWord>
                            <MaskWord>together,</MaskWord>
                        </span>
                        <span className="block whitespace-nowrap">
                            <MaskWord>grow</MaskWord>
                            <MaskWord>into</MaskWord>
                            <MaskWord style={accent}>enduring</MaskWord>
                            <MaskWord style={accent}>hope.</MaskWord>
                        </span>
                    </h1>

                    <p
                        className="sh-mar mt-[20px] text-[13px] font-bold leading-[1.5]"
                        style={{ color: MINT, fontFamily: SITE_DEVANAGARI }}
                    >
                        पुण्यात रुजलेले, प्रगतीकडे वाटचाल — गरजू मुलांच्या शिक्षणासाठी आणि पोषणासाठी एक प्रामाणिक पाऊल.
                    </p>

                    <p className="sh-para mt-[18px] max-w-[540px] text-[14.5px] leading-[1.6] text-white/90">
                        Sproug Hub Foundation is a 100% volunteer-run charitable trust in Pune, working
                        alongside shelter homes and learning centres — providing nourishing food, school
                        dignity kits, and education, with zero overhead and not a single rupee spent on
                        salaries.
                    </p>

                    <div className="mt-[26px] flex items-center gap-3 text-[14px] font-semibold">
                        <span
                            className="sh-btn relative flex h-[42px] items-center gap-2 overflow-hidden rounded-md px-[22px]"
                            style={{ backgroundColor: GOLD }}
                        >
                            <HeartIcon className="h-4 w-4" />
                            Donate via UPI QR <span aria-hidden="true">→</span>
                            <Shine reduced={reduced} />
                        </span>
                        <span className="sh-btn flex h-[42px] items-center gap-2 rounded-md border border-white/25 bg-white/10 px-[18px]">
                            <span aria-hidden="true">☺</span> Become a Volunteer
                        </span>
                        <span className="sh-btn flex items-center gap-1.5 text-[13px]" style={{ color: MINT }}>
                            <span aria-hidden="true">▯</span> Read 2026 Yearbook (PDF)
                        </span>
                    </div>

                    <div className="sh-rule mt-[26px] h-px bg-white/15" />
                    <div className="grid grid-cols-3 pt-[18px]">
                        {[
                            ["100%", "Direct to Beneficiaries", true],
                            ["80G & CSR", "Tax Exemption Certified"],
                            ["₹0 Salary", "Pure Volunteer Ethos"],
                        ].map(([value, caption, counter]) => (
                            <div key={caption} className="sh-stat">
                                <div
                                    ref={counter ? count : undefined}
                                    className="text-[26px] font-bold leading-none"
                                    style={{ color: GOLD_TEXT, fontFamily: SITE_SERIF }}
                                >
                                    {value}
                                </div>
                                <div className="mt-2 text-[10.5px] text-white/80">{caption}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: identity + campaign card. Spring in, then a slow float. */}
                <motion.div
                    initial={reduced ? false : { opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18, delay: reduced ? 0 : 0.9 }}
                    className="self-center"
                >
                    <motion.div
                        animate={reduced ? undefined : { y: [0, -6, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
                        className="relative rounded-[18px] bg-white px-[25px] pb-[18px] pt-[32px] text-[#1F2937] shadow-[0_24px_50px_rgba(0,0,0,0.3)]"
                    >
                        {["left-3 top-2.5", "right-3 top-2.5", "bottom-2.5 left-3", "bottom-2.5 right-3"].map((pos) => (
                            <span
                                key={pos}
                                className={`sh-star absolute text-[9px] ${pos}`}
                                style={{ color: GOLD }}
                                aria-hidden="true"
                            >
                                ✦
                            </span>
                        ))}

                        <div className="flex flex-col items-center text-center">
                            <SproutMark className="h-[54px] w-[56px]" />
                            <div className="mt-1 text-[36px] font-semibold leading-none tracking-[-0.03em] text-[#1C4A33]">
                                Sproug <span style={{ color: "#B8891F" }}>Hub</span>
                            </div>
                            <div
                                className="mt-0.5 text-[13px] font-extrabold leading-none"
                                style={{ color: "#B8891F", fontFamily: SITE_DEVANAGARI }}
                            >
                                स्प्रॉग हब
                            </div>
                            <div className="mt-[20px] w-full border-b border-[#E5E7EB] pb-[14px] text-[10.5px] tracking-[0.06em] text-[#2D6A4F]">
                                ROOTED IN COMMUNITY • PUNE
                            </div>
                        </div>

                        <div className="mt-[10px] flex items-center justify-between text-[11px]">
                            <span className="text-[#2D6A4F]">✧ Our Change Maker</span>
                            <span className="flex items-center gap-1.5 rounded bg-[#DDF3E4] px-2 py-[2px] text-[10px] font-semibold text-[#2D6A4F]">
                                <motion.span
                                    className="h-1.5 w-1.5 rounded-full bg-[#2D9D5B]"
                                    animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                />
                                Active
                            </span>
                        </div>

                        <div className="mt-2 rounded-lg border border-[#E7E2D0] bg-[#FBF9F0] px-[10px] py-[9px]">
                            <div className="text-[12px] font-bold">Annadana &amp; Notebook Distribution</div>
                            <div className="mt-0.5 text-[10px] text-[#6B7280]">Pimpri &amp; Bhosari Learning Shelter</div>
                            <div className="mt-2 flex justify-between text-[10px]">
                                <span>Target: 150 Children</span>
                                <span className="font-semibold">₹1,500 = 45 Meals</span>
                            </div>
                        </div>

                        <div className="mt-2.5 flex h-[28px] items-center justify-center gap-1.5 rounded-md bg-[#14412E] text-[10.5px] font-semibold text-white">
                            <span aria-hidden="true">▦</span> Scan UPI QR &amp; Sponsor a Child
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

/* ----- jhep.sproughub.info ----- */
function JhepSite() {
    const root = useRef(null);
    const reduced = useReducedMotion();
    const NAVY = "#1B3A52";
    const ORANGE = "#EA580C";

    useGSAP(
        () => {
            if (prefersReducedMotion()) return;

            /* entrance */
            const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
            tl.from(".jh-nav", { y: -12, opacity: 0, duration: 0.5, stagger: 0.06 })
                .from(".jh-line", { yPercent: 112, duration: 0.9, stagger: 0.13 }, 0.2)
                .from(".jh-band", { scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power2.inOut" }, "-=0.35")
                .from(".jh-para", { y: 14, opacity: 0, duration: 0.6 }, "-=0.55")
                .from(".jh-cta", { y: 14, opacity: 0, duration: 0.6 }, "-=0.35");

            /* chalkboard: type English, then Marathi, then the dashes; hold, wipe, repeat */
            const board = gsap.timeline({ repeat: -1, delay: 1.3 });
            board
                .set(".jh-write", { opacity: 1 })
                .fromTo(".jh-en", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "steps(20)" })
                .fromTo(".jh-mr", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "steps(17)" }, "+=0.25")
                .fromTo(".jh-dash", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.4, stagger: 0.15 }, "+=0.1")
                .to(".jh-write", { opacity: 0, duration: 0.5 }, "+=3.2");
        },
        { scope: root },
    );

    const lineMask = { paddingBottom: "0.1em", marginBottom: "-0.1em" };

    return (
        <div ref={root} className="flex h-full flex-col bg-white" style={{ color: NAVY }}>
            {/* Navbar */}
            <div className="relative z-10 flex h-[62px] shrink-0 items-center justify-between bg-white px-8 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
                <div className="jh-nav flex items-center gap-2">
                    <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
                        <path d="M3 42c11-2 19-8 23-21 2 8 7 12 15 14-8 0-12 4-14 10-5-4-13-5-24-3z" fill="#D93A2B" />
                        <path d="M25 21c0-9 7-15 18-17-2 9-7 15-18 17z" fill="#F97316" />
                    </svg>
                    <span className="text-[22px] font-extrabold tracking-[-0.03em]">
                        Project <span style={{ color: "#F26A0F" }}>Jhep</span>
                    </span>
                </div>

                <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 text-[15px] font-semibold">
                    <span className="jh-nav rounded-full bg-[#FFF3E8] px-4 py-2.5">Home</span>
                    <span className="jh-nav px-4 py-2.5">About</span>
                    <span className="jh-nav px-4 py-2.5">Team</span>
                    <span className="jh-nav px-4 py-2.5">Sprough Hub</span>
                </div>

                <div className="flex items-center gap-6 text-[15px] font-semibold">
                    <span className="jh-nav">Login</span>
                    <span
                        className="jh-nav rounded-full px-5 py-[10px] font-bold text-white shadow-[0_8px_20px_rgba(242,106,15,0.3)]"
                        style={{ backgroundColor: "#F26A0F" }}
                    >
                        Start learning
                    </span>
                </div>
            </div>

            {/* Hero: classroom photo approximated with soft colour */}
            <div
                className="relative flex min-h-[560px] flex-1 items-center overflow-hidden px-[48px] py-10"
                style={{
                    background: [
                        "radial-gradient(40% 55% at 34% 22%, rgba(255,255,255,0.95), transparent 70%)",
                        "radial-gradient(28% 50% at 92% 50%, rgba(226,150,170,0.45), transparent 70%)",
                        "radial-gradient(45% 35% at 55% 100%, rgba(116,84,76,0.45), transparent 72%)",
                        "#EEE1D2",
                    ].join(","),
                }}
            >
                <div className="absolute left-[40%] top-[16%] h-[40%] w-[13%] rounded-[40%] bg-[#C7889A]/40 blur-3xl" aria-hidden="true" />
                <div className="absolute left-[56%] top-[40%] h-[24%] w-[14%] rounded-full bg-[#7A5645]/35 blur-3xl" aria-hidden="true" />
                <div className="absolute inset-0 bg-white/35" aria-hidden="true" />

                <div className="relative grid w-full grid-cols-[minmax(0,1fr)_380px] items-center gap-8">
                    <div>
                        <h1 className="text-[56px] font-extrabold leading-[1.2] tracking-[-0.05em]" style={{ color: NAVY }}>
                            {["Every child", "deserves"].map((line) => (
                                <span key={line} className="block overflow-hidden whitespace-nowrap" style={lineMask}>
                                    <span className="jh-line block">{line}</span>
                                </span>
                            ))}
                            <span className="block overflow-hidden whitespace-nowrap" style={lineMask}>
                                <span className="jh-line block">
                                    a{" "}
                                    <span className="relative inline-block">
                                        <span
                                            className="jh-band absolute inset-x-0 bottom-[8%] h-[36%]"
                                            style={{ backgroundColor: "rgba(249,115,22,0.28)" }}
                                            aria-hidden="true"
                                        />
                                        <span className="relative" style={{ color: ORANGE }}>
                                            confident voice.
                                        </span>
                                    </span>
                                </span>
                            </span>
                        </h1>

                        <p className="jh-para mt-6 max-w-[430px] text-[15px] font-semibold leading-[27px] text-[#6B7C93]">
                            Simple English learning with Marathi support, designed to build confidence.
                        </p>

                        <div
                            className="jh-cta relative mt-6 inline-flex h-[46px] items-center gap-3 overflow-hidden rounded-full pl-6 pr-[12px] text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(234,88,12,0.3)]"
                            style={{ backgroundColor: ORANGE }}
                        >
                            Explore Project Jhep
                            <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white/25 text-[11px]">↗</span>
                            <Shine reduced={reduced} />
                        </div>
                    </div>

                    {/* Learning card: spring in, then a slow float */}
                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 36, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 110, damping: 16, delay: reduced ? 0 : 0.8 }}
                    >
                        <motion.div
                            animate={reduced ? undefined : { y: [0, -7, 0] }}
                            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="rounded-[26px] px-7 pb-7 pt-6 shadow-[0_22px_50px_rgba(80,50,30,0.16)]"
                            style={{ background: "linear-gradient(135deg, #FDF6EE, #F9E9DC)" }}
                        >
                            <div className="text-[10px] font-bold tracking-[0.2em] text-[#7B8794]">PROJECT JHEP</div>
                            <div className="mt-1.5 text-[19px] font-bold tracking-[-0.01em]">Learn • Speak • Grow</div>

                            <div className="mt-5 h-[168px] rounded-[22px] border-[5px] border-[#1F3447] bg-[#162C3F] px-6 pt-6 text-white">
                                <div className="jh-write">
                                    <div
                                        className="jh-en inline-block border-b-[3px] pb-1 text-[30px] font-bold leading-none"
                                        style={{ fontFamily: SITE_HAND, borderColor: "#F97316" }}
                                    >
                                        Let’s learn English!
                                    </div>
                                    <div
                                        className="jh-mr mt-3 block w-fit text-[22px] font-bold leading-[1.3]"
                                        style={{ fontFamily: SITE_HAND_DEV }}
                                    >
                                        चला इंग्रजी शिकूया
                                    </div>
                                    <div className="mt-[16px] flex gap-2 border-t border-white/10 pt-[14px]">
                                        <span className="jh-dash h-1 w-6 rounded-full bg-white/80" />
                                        <span className="jh-dash h-1 w-4 rounded-full bg-white/60" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

/* Hostname -> coded mini-site. Anything else falls back to the generic Preview below. */
const SITE_MOCKS = {
    "sproughub.info": { Site: SproughHubSite, label: "Preview of the Sproug Hub website" },
    "jhep.sproughub.info": { Site: JhepSite, label: "Preview of the Project Jhep website" },
};
const siteMock = (project) => {
    try {
        return SITE_MOCKS[new URL(project.url).hostname.replace(/^www\./, "")] || null;
    } catch {
        return null;
    }
};

function Preview({ project }) {
    const data = project.previewData;
    const type = project.previewType;

    return (
        <div className="flex min-h-[220px] flex-1 flex-col justify-between gap-4 sm:min-h-[240px] sm:gap-5 lg:min-h-0">
            <div className="space-y-3 sm:space-y-4">
                {type === "live-browser" && <LiveSitePreview data={data} />}

                {type === "learning-interface" && (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-3 sm:space-y-4"
                    >
                        <PreviewHeader
                            label={data.module}
                            title={data.activeCourse}
                            aside={
                                <span className="shrink-0 whitespace-nowrap rounded-full border border-[#D94F35]/40 bg-[#D94F35]/15 px-2.5 py-1 text-[11px] text-[#D94F35] sm:px-3 sm:text-xs">
                                    {data.progress}
                                </span>
                            }
                        >
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#3A3B36] sm:mt-4">
                                <motion.div
                                    className="h-full rounded-full bg-[#D94F35]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${data.progressValue}%` }}
                                    transition={{ duration: 1, delay: 0.55, ease: EASE }}
                                />
                            </div>
                        </PreviewHeader>

                        <div className="space-y-2">
                            {data.lessons.map((lesson) => (
                                <motion.div
                                    key={lesson.title}
                                    variants={riseV}
                                    whileHover={{ x: 4 }}
                                    className={`work-row flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-xs sm:px-3.5 sm:py-3 ${lesson.status === "Completed"
                                        ? "border-[#3A3B36] bg-[#222320]/60 text-[#B9B0A2]"
                                        : lesson.status === "In Progress"
                                            ? "border-[#D94F35]/50 bg-[#D94F35]/10 font-semibold text-[#F5F1E8]"
                                            : "border-[#3A3B36]/60 bg-[#222320]/30 text-[#B9B0A2]/70"
                                        }`}
                                >
                                    <span className="min-w-0">{lesson.title}</span>
                                    <span className="flex shrink-0 items-center gap-1.5">
                                        {lesson.status === "Completed" && (
                                            <Check className="h-3.5 w-3.5 text-[#D94F35]" />
                                        )}
                                        {lesson.status}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {type === "marketplace-feed" && (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-3 sm:space-y-4"
                    >
                        <PreviewHeader
                            label="Real-time APMC mandi feed"
                            title={data.marketIndex}
                            aside={
                                <span className="shrink-0 pt-0.5 text-[11px] text-[#B9B0A2] sm:text-xs">
                                    {data.updatedAt}
                                </span>
                            }
                        />

                        <div className="space-y-2 text-xs">
                            {data.lots.map((lot) => (
                                <motion.div
                                    key={lot.item}
                                    variants={riseV}
                                    whileHover={{ scale: 1.015, borderColor: "rgba(217,79,53,0.5)" }}
                                    className={`flex flex-col justify-between gap-2 ${PREVIEW_ROW} sm:flex-row sm:items-center`}
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
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {type === "kanban-board" && <KanbanPreview data={data} />}
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

/* Slide-to-slide transitions live here, so the section needs nothing in your global CSS */
const CAROUSEL_CSS = `
/* Fonts used by the coded site previews (falls back to system fonts if blocked) */
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Kalam:wght@700&family=Noto+Sans+Devanagari:wght@500;700;800&family=Playfair+Display:ital,wght@0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

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
    const mock = siteMock(project);

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

                <div
                    className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-xl border-x border-b border-[#3A3B36] bg-[#2B2C28] ${mock ? "" : "work-prev p-3 min-[400px]:p-4 sm:p-5 lg:p-6"
                        }`}
                >
                    {mock ? (
                        <ScaledSite label={mock.label}>
                            <mock.Site />
                        </ScaledSite>
                    ) : (
                        <Preview project={project} />
                    )}
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
                        <span className={ACCENT_TITLE}>digital platforms.</span>
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