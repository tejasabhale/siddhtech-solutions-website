import React, { useEffect, useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";

import { CARD_RADIUS, CONTAINER, HEADING, SERIF, Reveal, RollButton } from "./shared.jsx";

const COMPANY = "SiddhTech Solutions";
const EMAIL = "siddhtechsoftwaresolutions@gmail.com";
const SMOOTH = [0.22, 1, 0.36, 1];

// text-base on mobile prevents iOS Safari from zooming into focused fields
const FIELD =
    "w-full rounded-xl border border-[#B9B0A2]/70 bg-[#F5F1E8] px-4 py-2.5 text-base text-[#191919] placeholder-[#191919]/40 transition-[border-color,box-shadow] duration-300 hover:border-[#B9B0A2] sm:text-sm focus-visible:border-[#D94F35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D94F35]/15";

const LABEL = "mb-1.5 block text-sm font-medium text-[#191919]";

const SERVICES = [
    { value: "Web & App Development", label: "Web & App Development" },
    { value: "Workflow Automation", label: "Workflow Automation" },
    { value: "Search Engine Optimization", label: "Search Engine Optimization" },
    { value: "Google & Meta Ads", label: "Google & Meta Ads" },
    { value: "Comprehensive System Overhaul", label: "Integrated multi-service scope" },
];

/** Details shown in the left panel of the card. */
const INFO = [
    {
        label: "Email",
        value: (
            <a
                href={`mailto:${EMAIL}`}
                className="break-all text-base font-medium transition-colors duration-300 hover:text-[#D94F35]"
            >
                {EMAIL}
            </a>
        ),
    },
    {
        label: "Studio",
        value: (
            <>
                <span className="block font-medium">Pune, Maharashtra, India</span>
                <span className="block text-[#191919]/60">
                    Serving clients across India, UAE, UK, and worldwide
                </span>
            </>
        ),
    },
    {
        label: "Response time",
        value: (
            <span className="text-[#191919]/80">
                Typically within 24 business hours. No spam, no high-pressure sales calls.
            </span>
        ),
    },
];

/* ------------------------------------------------------------------ */
/* Custom dropdown (replaces the browser's default <select> look)      */
/* ------------------------------------------------------------------ */
function Dropdown({ id, name, label, value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const rootRef = useRef(null);
    const reduceMotion = useReducedMotion();

    const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
    const selected = options[selectedIndex];

    // Close on outside click / tap
    useEffect(() => {
        if (!open) return;
        const close = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener("pointerdown", close);
        return () => document.removeEventListener("pointerdown", close);
    }, [open]);

    const openList = () => {
        setHighlight(selectedIndex);
        setOpen(true);
    };

    const choose = (index) => {
        onChange({ target: { name, value: options[index].value } });
        setOpen(false);
    };

    const onKeyDown = (event) => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                if (!open) openList();
                else setHighlight((h) => (h + 1) % options.length);
                break;
            case "ArrowUp":
                event.preventDefault();
                if (!open) openList();
                else setHighlight((h) => (h - 1 + options.length) % options.length);
                break;
            case "Home":
                if (open) {
                    event.preventDefault();
                    setHighlight(0);
                }
                break;
            case "End":
                if (open) {
                    event.preventDefault();
                    setHighlight(options.length - 1);
                }
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                if (open) choose(highlight);
                else openList();
                break;
            case "Escape":
                if (open) {
                    event.preventDefault();
                    setOpen(false);
                }
                break;
            case "Tab":
                setOpen(false);
                break;
            default:
        }
    };

    return (
        <div ref={rootRef} className="relative">
            <label htmlFor={id} className={LABEL}>
                {label}
            </label>

            <button
                id={id}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-activedescendant={open ? `${id}-opt-${highlight}` : undefined}
                onClick={() => (open ? setOpen(false) : openList())}
                onKeyDown={onKeyDown}
                className={`${FIELD} flex items-center justify-between gap-3 text-left ${open ? "border-[#D94F35] ring-4 ring-[#D94F35]/15" : ""
                    }`}
            >
                <span className="truncate">{selected.label}</span>
                <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 shrink-0 text-[#191919]/60 transition-transform duration-300 ${open ? "rotate-180 text-[#D94F35]" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="m5 7.5 5 5 5-5" />
                </svg>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        id={`${id}-list`}
                        role="listbox"
                        aria-labelledby={id}
                        initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: SMOOTH } }}
                        exit={{ opacity: 0, y: reduceMotion ? 0 : -6, transition: { duration: 0.15 } }}
                        className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-[#B9B0A2] bg-[#F5F1E8] p-1.5"
                    >
                        {options.map((option, index) => {
                            const isSelected = option.value === value;
                            const isHighlighted = index === highlight;

                            return (
                                <li
                                    key={option.value}
                                    id={`${id}-opt-${index}`}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setHighlight(index)}
                                    onClick={() => choose(index)}
                                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-base transition-colors duration-200 sm:text-sm ${isHighlighted ? "bg-[#D94F35]/10" : ""
                                        } ${isSelected ? "font-semibold text-[#D94F35]" : "text-[#191919]"}`}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <svg
                                            viewBox="0 0 20 20"
                                            className="h-4 w-4 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                                        </svg>
                                    )}
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Email composer                                                      */
/* ------------------------------------------------------------------ */
const formatRupees = (digits) => (digits ? `₹${Number(digits).toLocaleString("en-IN")}` : "");

function buildEmail({ name, email, service, budget, details }) {
    const cleanName = (name || "").trim();
    const budgetText = formatRupees(budget);

    const subject = `Project Inquiry: ${service} | ${cleanName}`;

    const body = [
        `Dear ${COMPANY} Team,`,
        "",
        `My name is ${cleanName}, and I am writing to discuss a project with you. I would like to explore working together on ${service}.`,
        "",
        "Here is a summary of my requirement:",
        "",
        `- Name / organization: ${cleanName}`,
        `- Email: ${email}`,
        `- Primary service: ${service}`,
        `- Target budget: ${budgetText || "Not finalised yet; I would value your guidance on a suitable range."}`,
        "",
        "Project details and goals:",
        (details || "").trim(),
        "",
        "I would be grateful if you could review the above and share your suggested approach, an estimated timeline, and a quotation. I am also happy to schedule a call at a time that suits you.",
        "",
        "Thank you for your time. I look forward to hearing from you.",
        "",
        "Warm regards,",
        cleanName,
        email,
    ].join("\r\n");

    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact({ formData, setFormData, submitted, setSubmitted }) {
    const sectionRef = useRef(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const ringY1 = useTransform(scrollYProgress, [0, 1], [65, -65]);
    const ringY2 = useTransform(scrollYProgress, [0, 1], [28, -28]);

    // Budget is digits only. Anything else (e.g. an old preset label) is treated as empty.
    const budgetDigits = /^\d*$/.test(formData.budget || "") ? formData.budget || "" : "";

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const onBudgetChange = (event) => {
        const digits = event.target.value.replace(/\D/g, "").slice(0, 10);
        setFormData((previous) => ({ ...previous, budget: digits }));
    };

    const onSubmit = (event) => {
        event.preventDefault();

        const href = buildEmail({ ...formData, budget: budgetDigits });

        // A programmatic link click opens the mail app more reliably than changing location.
        const link = document.createElement("a");
        link.href = href;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSubmitted(true);
    };

    // Staggered rise-in for the success message (same easing as the Process slides).
    const container = {
        hidden: {},
        show: { transition: { delayChildren: 0.1, staggerChildren: 0.09 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };
    const item = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SMOOTH } },
    };

    return (
        <section
            ref={sectionRef}
            id="contact"
            className="relative isolate flex min-h-[100svh] scroll-mt-20 flex-col justify-center overflow-hidden border-t border-[#B9B0A2]/40 bg-[#E8E1D6]/30 py-10 lg:py-12"
        >
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-20 hidden h-72 w-72 rounded-full border border-[#B9B0A2]/30 md:block"
                style={{ y: reduceMotion ? 0 : ringY1 }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 left-[-5rem] hidden h-64 w-64 rounded-full border border-[#D94F35]/10 md:block"
                style={{ y: reduceMotion ? 0 : ringY2 }}
            />

            <div className={`relative z-10 ${CONTAINER}`}>
                {/* Title: one line on large screens, wraps naturally on small ones */}
                <Reveal>
                    <div className="mb-6 text-center lg:mb-8">
                        <h2
                            className={`${HEADING} text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:whitespace-nowrap lg:text-[clamp(1.5rem,2.7vw,2.75rem)]`}
                        >
                            Have a project in mind?{" "}
                            <span className={`${SERIF} italic text-[#D94F35]`}>
                                Let&apos;s build something that matters.
                            </span>
                        </h2>
                    </div>
                </Reveal>

                <Reveal delay={120}>
                    <div
                        className={`mx-auto grid w-full max-w-5xl ${CARD_RADIUS} border border-[#B9B0A2] bg-[#F5F1E8] lg:grid-cols-12`}
                    >
                        {/* Left: intro + contact details, filled top to bottom */}
                        <div className="flex flex-col gap-6 rounded-t-[inherit] border-b border-[#B9B0A2]/50 p-6 sm:p-8 lg:col-span-5 lg:justify-between lg:rounded-l-[inherit] lg:rounded-tr-none lg:border-b-0 lg:border-r lg:p-10">
                            <p className="text-pretty leading-relaxed text-[#191919]/80">
                                Whether you need a custom website, a high-performing web application,
                                workflow automation, or strategic search visibility, tell us about your
                                goals. We read every brief and reply with clear next steps.
                            </p>

                            <dl className="space-y-4 text-sm">
                                {INFO.map((row) => (
                                    <div key={row.label} className="border-t border-[#B9B0A2]/40 pt-4">
                                        <dt className="mb-0.5 text-[#191919]/55">{row.label}</dt>
                                        <dd>{row.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Right: form. It stays mounted so the card never changes height. */}
                        <div className="relative rounded-b-[inherit] bg-[#E8E1D6]/30 p-6 sm:p-8 lg:col-span-7 lg:rounded-r-[inherit] lg:rounded-bl-none lg:p-10">
                            <motion.form
                                onSubmit={onSubmit}
                                className="space-y-4"
                                animate={{ opacity: submitted ? 0 : 1 }}
                                transition={{ duration: 0.3, ease: SMOOTH }}
                                aria-hidden={submitted}
                                {...(submitted ? { inert: "" } : {})}
                                style={{ visibility: submitted ? "hidden" : "visible" }}
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className={LABEL}>
                                            Your name or organization <span className="text-[#D94F35]">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={formData.name}
                                            onChange={onChange}
                                            placeholder="e.g. Rohini Sharma"
                                            className={FIELD}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={LABEL}>
                                            Email address <span className="text-[#D94F35]">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={onChange}
                                            placeholder="rohini@company.com"
                                            className={FIELD}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Dropdown
                                        id="service"
                                        name="service"
                                        label="Primary service"
                                        value={formData.service}
                                        options={SERVICES}
                                        onChange={onChange}
                                    />

                                    <div>
                                        <label htmlFor="budget" className={LABEL}>
                                            Target budget
                                        </label>
                                        <div className="relative">
                                            <span
                                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#191919]/60 sm:text-sm"
                                                aria-hidden="true"
                                            >
                                                ₹
                                            </span>
                                            <input
                                                id="budget"
                                                name="budget"
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                value={budgetDigits ? Number(budgetDigits).toLocaleString("en-IN") : ""}
                                                onChange={onBudgetChange}
                                                placeholder="e.g. 50,000"
                                                className={`${FIELD} pl-8`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="details" className={LABEL}>
                                        Project details and goals <span className="text-[#D94F35]">*</span>
                                    </label>
                                    <textarea
                                        id="details"
                                        name="details"
                                        rows={3}
                                        required
                                        value={formData.details}
                                        onChange={onChange}
                                        placeholder="Tell us about your organization, the problem you want to solve, and your timeline..."
                                        className={`${FIELD} resize-none`}
                                    />
                                </div>

                                <div className="pt-1">
                                    <RollButton type="submit" variant="accent" className="w-full">
                                        Send project brief
                                    </RollButton>
                                </div>
                            </motion.form>

                            {/* Success state sits on top of the form, so the card keeps its size */}
                            <AnimatePresence>
                                {submitted && (
                                    <motion.div
                                        key="success"
                                        variants={container}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        role="status"
                                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center sm:p-8 lg:p-10"
                                    >
                                        <motion.div
                                            variants={item}
                                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D94F35] text-white"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                                                <path
                                                    className="ns-draw"
                                                    d="M5 12.5 10 17.5 19 7"
                                                    stroke="currentColor"
                                                    strokeWidth="2.2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </motion.div>

                                        <motion.h3 variants={item} className={`${HEADING} mb-2 text-2xl font-bold`}>
                                            Inquiry prepared
                                        </motion.h3>

                                        <motion.p
                                            variants={item}
                                            className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-[#191919]/80"
                                        >
                                            Your email app should have opened with your project summary filled
                                            in. Press send to deliver it to{" "}
                                            <strong className="break-all">{EMAIL}</strong>.
                                        </motion.p>

                                        <motion.div
                                            variants={item}
                                            className="mx-auto mb-5 w-full max-w-md rounded-2xl border border-[#B9B0A2]/40 bg-[#F5F1E8] p-4 text-sm text-[#191919]/80"
                                        >
                                            If it didn&apos;t open, write to us directly:
                                            <a
                                                href={`mailto:${EMAIL}`}
                                                className="mt-1 block break-all font-semibold text-[#D94F35] transition-colors duration-300 hover:text-[#BF412A]"
                                            >
                                                {EMAIL}
                                            </a>
                                        </motion.div>

                                        <motion.button
                                            variants={item}
                                            type="button"
                                            onClick={() => setSubmitted(false)}
                                            className="text-sm font-medium text-[#D94F35] underline underline-offset-4 transition-colors duration-300 hover:text-[#BF412A]"
                                        >
                                            Edit brief or send another
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}