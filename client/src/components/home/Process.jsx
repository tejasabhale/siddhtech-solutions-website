import React, { useCallback, useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";

import { PROCESS_STEPS } from "./data.js";
import { CARD_RADIUS, CONTAINER, EASE, FOCUS, HEADING, SERIF, Reveal } from "./shared.jsx";

/** Time each step stays on screen (ms). */
const AUTOPLAY_MS = 6000;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 400;
const SMOOTH = [0.22, 1, 0.36, 1];

/** Slide shell: direction-aware cross-fade. Children stagger in via `StepBody`. */
const slideVariants = {
    enter: ({ dir, reduce }) => ({ opacity: 0, x: reduce ? 0 : dir * 56 }),
    center: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.65, ease: SMOOTH, delayChildren: 0.12, staggerChildren: 0.09 },
    },
    exit: ({ dir, reduce }) => ({
        opacity: 0,
        x: reduce ? 0 : dir * -56,
        transition: { duration: 0.35, ease: SMOOTH },
    }),
};

const riseVariants = {
    enter: { opacity: 0, y: 22 },
    center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SMOOTH } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};
const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.5, ease: SMOOTH } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * One slide, no empty areas:
 *  row 1: big number + title, side by side
 *  row 2: description (left) and "What you receive" panel (right), equal height
 * Used for both the visible slide and the invisible height sizer.
 */
function StepBody({ step, reduce }) {
    const item = reduce ? fadeVariants : riseVariants;

    return (
        <div className="flex h-full flex-col gap-5 lg:gap-6">
            <div className="flex items-center gap-4 lg:gap-6">
                <motion.span
                    variants={item}
                    className={`${SERIF} shrink-0 text-5xl leading-none text-[#D94F35] lg:text-7xl`}
                >
                    {step.step}
                </motion.span>
                <span className="h-10 w-px shrink-0 bg-[#B9B0A2]/60 lg:h-14" aria-hidden="true" />
                <motion.h3
                    variants={item}
                    className={`${HEADING} text-balance text-2xl font-bold leading-tight tracking-tight lg:text-4xl`}
                >
                    {step.title}
                </motion.h3>
            </div>

            <motion.div variants={fadeVariants} className="h-px bg-[#B9B0A2]/40" aria-hidden="true" />

            <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-8">
                <motion.p
                    variants={item}
                    className="text-pretty leading-relaxed text-[#191919]/80 lg:text-base"
                >
                    {step.description}
                </motion.p>

                <motion.div
                    variants={item}
                    className="flex flex-col justify-center rounded-xl border border-[#B9B0A2]/40 bg-[#E8E1D6]/50 p-4 lg:p-5"
                >
                    <span className="block text-xs font-semibold text-[#D94F35]">What you receive</span>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-[#191919]">
                        {step.deliverables}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

/** Clickable progress segment. The active one fills as the autoplay timer runs. */
function Segment({ state, progress, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-current={state === "active" ? "step" : undefined}
            className={`group flex h-5 flex-1 items-center rounded-full ${FOCUS}`}
        >
            <span className="h-1 w-full overflow-hidden rounded-full bg-[#191919]/10 transition-colors duration-300 group-hover:bg-[#191919]/25">
                {state === "active" ? (
                    <motion.span
                        className="block h-full origin-left rounded-full bg-[#D94F35]"
                        style={{ scaleX: progress }}
                    />
                ) : (
                    <span
                        className={`block h-full origin-left rounded-full bg-[#D94F35] transition-transform duration-700 ${EASE} ${state === "done" ? "scale-x-100" : "scale-x-0"
                            }`}
                    />
                )}
            </span>
        </button>
    );
}

function ArrowButton({ label, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#B9B0A2] text-sm font-semibold text-[#191919] transition-[background-color,border-color,color] duration-300 hover:border-[#D94F35] hover:bg-[#D94F35] hover:text-white active:bg-[#B93E27] ${FOCUS}`}
        >
            {children}
        </button>
    );
}

export default function Process() {
    const [active, setActive] = useState(0);
    const [dragging, setDragging] = useState(false);

    const direction = useRef(1);
    const sectionRef = useRef(null);
    const carouselRef = useRef(null);

    const reduceMotion = useReducedMotion();
    const inView = useInView(carouselRef, { amount: 0.35 });

    const total = PROCESS_STEPS.length;
    const step = PROCESS_STEPS[active];

    // Autoplay pauses only while dragging, when off-screen, and for reduced-motion users.
    const running = !reduceMotion && inView && !dragging;
    const progress = useMotionValue(0);

    const goTo = useCallback(
        (index, dir) => {
            const target = (index + total) % total;
            if (target === active) return;
            direction.current = dir ?? (target > active ? 1 : -1);
            progress.set(0);
            setActive(target);
        },
        [active, total, progress],
    );

    const next = useCallback(() => goTo(active + 1, 1), [goTo, active]);
    const prev = useCallback(() => goTo(active - 1, -1), [goTo, active]);

    useAnimationFrame((_, delta) => {
        if (!running) return;
        const value = progress.get() + Math.min(delta, 64) / AUTOPLAY_MS;
        if (value >= 1) next();
        else progress.set(value);
    });

    const onKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            prev();
        }
    };

    const onDragEnd = (_, { offset, velocity }) => {
        setDragging(false);
        if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) next();
        else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) prev();
    };

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const ringY1 = useTransform(scrollYProgress, [0, 1], [65, -65]);
    const ringY2 = useTransform(scrollYProgress, [0, 1], [28, -28]);

    const custom = { dir: direction.current, reduce: !!reduceMotion };

    return (
        <section
            ref={sectionRef}
            id="process"
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
                {/* Title: same size as the other section titles (matches "Selected work") */}
                <Reveal>
                    <div className="mb-6 text-center lg:mb-8">
                        <h2
                            className={`${HEADING} text-balance text-[1.625rem] font-bold leading-tight tracking-tight min-[400px]:text-3xl sm:text-4xl`}
                        >
                            Five steps. From brief to{" "}
                            <span className={`${SERIF} italic text-[#D94F35]`}>operational launch.</span>
                        </h2>
                        <p className="mx-auto mt-3 max-w-3xl text-pretty text-sm text-[#191919]/70 lg:text-base">
                            Every project moves through structured milestones with concrete documentation,
                            clear communication, and predictable delivery dates.
                        </p>
                    </div>
                </Reveal>

                <Reveal>
                    <div
                        ref={carouselRef}
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Project process"
                        tabIndex={-1}
                        onKeyDown={onKeyDown}
                        className={`mx-auto w-full max-w-5xl overflow-hidden ${CARD_RADIUS} border border-[#B9B0A2] bg-[#F5F1E8] outline-none`}
                    >
                        <div className="flex gap-2 px-5 pt-4 sm:px-8 lg:px-10">
                            {PROCESS_STEPS.map((item, index) => (
                                <Segment
                                    key={item.step}
                                    progress={progress}
                                    label={`Go to step ${item.step}: ${item.title}`}
                                    state={index === active ? "active" : index < active ? "done" : "idle"}
                                    onClick={() => goTo(index)}
                                />
                            ))}
                        </div>

                        {/* Stage. The invisible sizer reserves the tallest step's height. */}
                        <motion.div
                            className="relative cursor-grab px-5 pb-6 pt-4 touch-pan-y active:cursor-grabbing sm:px-8 lg:px-10"
                            drag={reduceMotion ? false : "x"}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.15}
                            dragSnapToOrigin
                            onDragStart={() => setDragging(true)}
                            onDragEnd={onDragEnd}
                            aria-live={running ? "off" : "polite"}
                        >
                            <div className="invisible grid lg:min-h-[14rem]" aria-hidden="true">
                                {PROCESS_STEPS.map((item) => (
                                    <div key={item.step} className="col-start-1 row-start-1">
                                        <StepBody step={item} reduce />
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-x-5 bottom-6 top-4 sm:inset-x-8 lg:inset-x-10">
                                <AnimatePresence initial={false} custom={custom}>
                                    <motion.div
                                        key={step.step}
                                        custom={custom}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0 select-none"
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${active + 1} of ${total}`}
                                    >
                                        <StepBody step={step} reduce={!!reduceMotion} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <div className="flex items-center justify-between border-t border-[#B9B0A2]/40 px-5 py-3 sm:px-8 lg:px-10">
                            <span className="text-xs tabular-nums text-[#191919]/60">
                                {active + 1} / {total}
                            </span>
                            <div className="flex items-center gap-2">
                                <ArrowButton label="Previous step" onClick={prev}>
                                    ←
                                </ArrowButton>
                                <ArrowButton label="Next step" onClick={next}>
                                    →
                                </ArrowButton>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}