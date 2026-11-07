
import React, { useState } from "react";
import {
    CARD_RADIUS,
    FOCUS,
    HEADING,
    SERIF,
    Reveal,
    Section,
} from "./shared.jsx";

const TEAM = [
    {
        name: "Yashraj Bhogade",
        role: "Co-founder",
        title: "AI & Machine Learning Engineer",
        photo: "/team/yashraj.jpg",
        bio: "Yashraj specializes in artificial intelligence and machine learning, developing intelligent systems powered by deep learning and large language models. His work spans model development, LLM-powered applications, retrieval-augmented generation (RAG), and the data pipelines and APIs required to integrate AI capabilities into production products.",
        links: {
            github: "https://github.com/itsthemaverick",
            linkedin:
                "https://in.linkedin.com/in/yashraj-bhogade-95231b385",
            email: "yashrajbhogadepatil@gmail.com",
        },
    },
    {
        name: "Tejas Abhale",
        role: "Co-founder",
        title: "Full-Stack Developer",
        photo: "/team/tejas.jpeg",
        bio: "Tejas designs and develops scalable web applications with a focus on system architecture, clean code, and intuitive user experiences. His expertise spans frontend and backend engineering, system design, UI/UX, cloud infrastructure, and deployment. He works across the development lifecycle, from architectural planning and implementation to production releases and version control.",
        links: {
            github: "https://github.com/tejasabhale",
            linkedin:
                "https://www.linkedin.com/in/tejas-abhale-50743128a/",
            x: "https://x.com/Tejas55451",
            email: "abhaletejas4@gmail.com",
        },
    },
    {
        name: "Pankaj Dandekar",
        role: "Co-founder",
        title: "Performance Marketing Specialist",
        photo: "/team/pankaj.jpg",
        bio: "Pankaj specializes in performance marketing across Google Ads and Meta Ads. He develops campaign strategies, manages paid advertising, and works on audience segmentation, conversion tracking, and campaign optimization. His approach focuses on reaching relevant audiences, measuring campaign performance, and making data-informed decisions to improve marketing effectiveness.",
        links: {
            github: "https://github.com/pankajdandekar9200-dot",
            linkedin:
                "https://www.linkedin.com/in/pankaj-dandekar-787801384/",
            email: "pankajdandekar9292@gmail.com",
        },
    },
];

const isProvided = (value) =>
    Boolean(value) &&
    !String(value).includes("your-handle");

const initials = (name) =>
    name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2);

/* ---------- Social icons ---------- */

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
            {name === "GitHub" && (
                <g {...stroke}>
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                </g>
            )}

            {name === "LinkedIn" && (
                <path
                    fill="currentColor"
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
                />
            )}

            {name === "X" && (
                <path
                    fill="currentColor"
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
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

/* ---------- Portrait with initials fallback ---------- */

function Portrait({ name, role, src }) {
    const [failed, setFailed] = useState(false);

    return (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#B9B0A2]/40 bg-[#E8E1D6] sm:aspect-[5/6] lg:aspect-[4/5]">
            <span className="absolute bottom-3 left-3 z-10 rounded-full border border-[#D94F35]/25 bg-[#F5F1E8]/90 px-3 py-1 text-[11px] font-semibold text-[#D94F35] backdrop-blur-sm sm:text-xs">
                {role}
            </span>

            {failed ? (
                <div className="grid h-full w-full place-items-center">
                    <span
                        className={`${SERIF} text-6xl italic text-[#D94F35] sm:text-7xl`}
                    >
                        {initials(name)}
                    </span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={`Portrait of ${name}`}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    onError={() => setFailed(true)}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.03]"
                />
            )}
        </div>
    );
}

/* ---------- Founder card ---------- */

function MemberCard({ member }) {
    const { github, linkedin, x, email } = member.links;

    const socials = [
        {
            name: "GitHub",
            label: "GitHub",
            href: github,
            external: true,
        },
        {
            name: "LinkedIn",
            label: "LinkedIn",
            href: linkedin,
            external: true,
        },
        {
            name: "X",
            label: "X",
            href: x,
            external: true,
        },
        {
            name: "Email",
            label: "Email",
            href: isProvided(email) ? `mailto:${email}` : null,
            external: false,
        },
    ].filter((item) => isProvided(item.href));

    return (
        <article
            className={`group flex h-full min-w-0 flex-col ${CARD_RADIUS} border border-[#B9B0A2] bg-[#F5F1E8] p-3 sm:p-4`}
        >
            <Portrait
                name={member.name}
                role={member.role}
                src={member.photo}
            />

            <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4 sm:px-2 sm:pt-5">
                <h3
                    className={`${HEADING} text-balance text-xl font-bold leading-tight tracking-tight sm:text-[1.375rem]`}
                >
                    {member.name}
                </h3>

                <p className="mt-1 text-[13px] font-medium text-[#191919]/65 sm:text-sm">
                    {member.title}
                </p>

                <div
                    className="my-3 h-px w-10 bg-[#D94F35]"
                    aria-hidden="true"
                />

                <p className="text-pretty text-[13px] leading-relaxed text-[#191919]/75 sm:text-sm">
                    {member.bio}
                </p>

                {/* Social links aligned at the bottom */}
                <div className="mt-auto pt-6">
                    {socials.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-t border-[#B9B0A2]/40 pt-4">
                            <span className="text-xs text-[#191919]/55">
                                Connect
                            </span>

                            <ul className="flex items-center gap-2">
                                {socials.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            {...(item.external
                                                ? {
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                }
                                                : {})}
                                            aria-label={`${member.name} on ${item.label}`}
                                            title={item.label}
                                            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#B9B0A2] text-[#191919]/70 transition-colors duration-200 hover:border-[#D94F35] hover:bg-[#D94F35] hover:text-white ${FOCUS}`}
                                        >
                                            <SocialIcon name={item.name} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ---------- Team section ---------- */

export default function Team() {
    return (
        <Section
            id="team"
            className="border-t border-[#B9B0A2]/40"
        >
            <Reveal>
                <header className="mb-8 text-center lg:mb-10">
                    <h2
                        className={`${HEADING} text-balance text-[1.625rem] font-bold leading-tight tracking-tight min-[400px]:text-3xl sm:text-4xl`}
                    >
                        The people behind{" "}
                        <span className={`${SERIF} italic text-[#D94F35]`}>
                            SiddhTech Solutions.
                        </span>
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-[#191919]/70 lg:text-base">
                        Meet the founders. You work directly with the people who build your project.
                    </p>
                </header>
            </Reveal>

            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {TEAM.map((member, index) => (
                    <Reveal
                        key={member.name}
                        delay={index * 100}
                        className={
                            index === TEAM.length - 1
                                ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)] lg:col-span-1 lg:w-full"
                                : ""
                        }
                    >
                        <MemberCard member={member} />
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}
