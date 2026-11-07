export const PROJECTS = [
  {
    id: "sproughub",
    title: "SprougHub",
    category: "Non-Profit & Community Platform",
    badge: "Live Client Project",
    status: "Live",
    url: "https://sproughub.info",
    displayUrl: "sproughub.info",
    description:
      "A high-trust web platform for an active non-governmental organization, engineered to articulate its community mission, recruit volunteers, and facilitate transparent donation workflows.",
    deliverables: [
      "Custom responsive web development",
      "Mission & impact storytelling architecture",
      "Donation & volunteer onboarding flows",
      "Sub-second load speed & local SEO setup",
    ],
    previewType: "live-browser",
    previewData: {
      headline: "Nurturing Communities & Driving Grassroots Change",
      subtext:
        "Transparent impact metrics, active volunteer programs, and educational initiatives across rural and urban clusters.",
      stats: [
        { label: "Community Reach", val: "12,000+" },
        { label: "Active Programs", val: "18 Initiatives" },
        { label: "Volunteer Network", val: "450+ Members" },
      ],
      tagline: "SprougHub Foundation · Annual Impact Report",
    },
  },
  {
    id: "jhep",
    title: "JHEP",
    category: "EdTech & Learning Management",
    badge: "Live Client Platform",
    status: "Live",
    url: "https://jhep.sproughub.info",
    displayUrl: "jhep.sproughub.info",
    description:
      "A structured English language learning platform designed with accessible pedagogical modules, progressive assessments, and low-bandwidth optimization for learners.",
    deliverables: [
      "Modular curriculum & lesson hierarchy",
      "Interactive comprehension assessments",
      "Student progress and lesson state persistence",
      "Optimized for high performance on mobile devices",
    ],
    previewType: "learning-interface",
    previewData: {
      activeCourse: "English Fluency & Applied Communication",
      module: "Module 03: Practical Workplace Dialogue",
      progress: "68% Completed",
      progressValue: 68,
      lessons: [
        {
          title: "01. Professional Greetings & Inquiries",
          status: "Completed",
        },
        {
          title: "02. Framing Clarifications & Action Items",
          status: "Completed",
        },
        {
          title: "03. Presentation Delivery & Storytelling",
          status: "In Progress",
        },
        {
          title: "04. Constructive Cross-Team Feedback",
          status: "Up Next",
        },
      ],
    },
  },
  // {
  //   id: "krishilink",
  //   title: "KrishiLink",
  //   category: "AgriTech & B2B Marketplace",
  //   badge: "Prototype Concept",
  //   status: "Concept",
  //   url: null,
  //   displayUrl: "Prototype Architecture",
  //   description:
  //     "A direct farmer-to-buyer agricultural marketplace concept created to bypass predatory middlemen, providing transparent regional mandi prices and automated bulk order dispatch.",
  //   deliverables: [
  //     "Direct farmer quotation & bidding interface",
  //     "Real-time regional Mandi price tracking",
  //     "WhatsApp dispatch alerts & SMS fallback",
  //     "Bilingual interface design (English / Marathi)",
  //   ],
  //   previewType: "marketplace-feed",
  //   previewData: {
  //     marketIndex: "Maharashtra APMC Regional Bids",
  //     updatedAt: "Today · 06:30 AM IST",
  //     lots: [
  //       {
  //         item: "Grade-A Tomatoes",
  //         origin: "Nashik Mandi",
  //         avgPrice: "₹34 / kg",
  //         directOffer: "₹32 / kg",
  //         status: "Open",
  //       },
  //       {
  //         item: "Lasalgaon Red Onions",
  //         origin: "Lasalgaon Mandi",
  //         avgPrice: "₹26 / kg",
  //         directOffer: "₹24 / kg",
  //         status: "Verified",
  //       },
  //       {
  //         item: "Ratnagiri Hapus (Alphonso)",
  //         origin: "Ratnagiri Hub",
  //         avgPrice: "₹1,200 / crate",
  //         directOffer: "₹1,050 / crate",
  //         status: "Pre-order",
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: "taskflow",
  //   title: "Taskflow",
  //   category: "SaaS Workflow & Operations",
  //   badge: "Internal Tool Architecture",
  //   status: "Prototype",
  //   url: null,
  //   displayUrl: "System Architecture",
  //   description:
  //     "A lean task and project management application built for agencies and distributed teams, prioritizing distraction-free Kanban pipelines and zero-latency state synchronization.",
  //   deliverables: [
  //     "Real-time team board & sprint orchestration",
  //     "Automated milestone tracking & reminders",
  //     "Client view-only timeline links",
  //     "Integrated timesheet & invoice generation",
  //   ],
  //   previewType: "kanban-board",
  //   previewData: {
  //     boardName: "Client Sprint: Web System Release v2.4",
  //     columns: [
  //       {
  //         name: "Scoping & Brief",
  //         count: 2,
  //         task: "API Schema Specification",
  //       },
  //       {
  //         name: "In Development",
  //         count: 4,
  //         task: "WhatsApp Notification Webhook",
  //       },
  //       {
  //         name: "Quality Assurance",
  //         count: 1,
  //         task: "Core Web Vitals Audit (98/100)",
  //       },
  //     ],
  //   },
  // },
];

export const SERVICES_DATA = [
  {
    id: "web-dev",
    title: "Web & App Development",
    subtitle:
      "Clean architecture, rapid loading speeds, and true code ownership.",
    summary:
      "We design and build bespoke business websites, high-performance web applications, and mobile solutions using modern React and Node frameworks. We never lock you into proprietary drag-and-drop builders.",
    deliverables: [
      "Business & organizational websites",
      "Custom web applications & SaaS MVPs",
      "E-commerce platforms & checkout flows",
      "Cross-platform mobile applications",
      "RESTful APIs and microservice integrations",
    ],
    outcome:
      "Clean semantic markup, sub-second load times, and maintainable repositories that your engineering team or partners can easily extend.",
  },
  {
    id: "automation",
    title: "Business Workflow Automation",
    subtitle: "Eliminating manual data re-entry and administrative friction.",
    summary:
      "We connect your isolated marketing funnels, CRMs, invoicing systems, and team notifications into resilient, automated pipelines. Your staff spends time consulting clients, not copying spreadsheet rows.",
    deliverables: [
      "CRM pipeline automations (HubSpot, Zoho, Notion)",
      "WhatsApp Business API automations & notifications",
      "Automated PDF invoicing & payment status updates",
      "AI-assisted lead qualification and routing",
      "Custom webhooks & scheduled database synchronization",
    ],
    outcome:
      "Zero missed leads, instant response times to prospect inquiries, and hours of operational overhead eliminated every week.",
  },
  {
    id: "seo",
    title: "Search Engine Optimization",
    subtitle:
      "Built into your codebase from day one, not treated as an afterthought.",
    summary:
      "We engineer search discoverability directly into site architecture. From semantic schema markup and mobile Core Web Vitals to localized search prominence for Pune and regional markets, we position your business where high-intent buyers search.",
    deliverables: [
      "Deep technical SEO audits & crawl remediation",
      "On-page content structure & JSON-LD schema",
      "Local SEO & Google Business Profile optimization",
      "Core Web Vitals performance tuning (90+ mobile)",
      "Keyword mapping & conversion-focused information architecture",
    ],
    outcome:
      "Steady, compounding organic search traffic from qualified buyers looking specifically for your services in your territory.",
  },
  {
    id: "ads",
    title: "Google & Meta Advertising",
    subtitle:
      "Targeted campaigns built for real pipeline inquiries, not vanity impressions.",
    summary:
      "We build paid acquisition campaigns aligned with actual business unit economics. Combining precise search intent on Google Ads with structured audience targeting on Meta, we pair ads with custom, high-converting landing pages.",
    deliverables: [
      "Google Search & Performance Max campaign architecture",
      "Meta Ads (Instagram & Facebook) lead generation",
      "Server-side conversion tracking & GA4 attribution",
      "Dedicated high-converting landing page development",
      "Systematic A/B creative testing & weekly optimization",
    ],
    outcome:
      "Predictable customer acquisition costs, transparent attribution tracking, and qualified inbound inquiries that your sales team can close.",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Alignment",
    duration: "Week 01",
    description:
      "We begin by understanding your business model, ideal customer profile, technical constraints, and measurable definition of success. We analyze competitor positioning and identify the exact leverage points where modern software creates a commercial advantage.",
    deliverables:
      "Discovery brief, technical requirements document, milestone schedule.",
  },
  {
    step: "02",
    title: "Strategy & Information Architecture",
    duration: "Week 01–02",
    description:
      "Before writing visual code, we architect the content hierarchy, user journeys, data structures, and automation logic. This blueprint ensures every page, form field, and button serves a distinct business function.",
    deliverables:
      "Sitemap, wireframe schematics, API integration map, copy direction.",
  },
  {
    step: "03",
    title: "Bespoke Editorial Design",
    duration: "Week 02–03",
    description:
      "We craft a distinctive visual system that reflects your organization's credibility. Bold typography, generous whitespace, intentional contrast, and responsive layout standards that feel crafted, not derived from templates.",
    deliverables:
      "High-fidelity interactive prototypes, responsive layout standards, component tokens.",
  },
  {
    step: "04",
    title: "Full-Stack Development & Testing",
    duration: "Week 03–05",
    description:
      "We write clean, modular React and backend services with strict attention to semantic HTML, accessibility (WCAG AA), Core Web Vitals, and security. Automations and third-party APIs are integrated with comprehensive error handling.",
    deliverables:
      "Production Git repository, staging environment preview, cross-browser test log.",
  },
  {
    step: "05",
    title: "Deployment, Tracking & Handover",
    duration: "Week 05–06",
    description:
      "We orchestrate production DNS rollout, configure SSL, link analytics and conversion tags, test form webhooks under live conditions, and train your team on updates. You maintain full ownership of all code and accounts.",
    deliverables:
      "Live production deployment, analytics verification, documentation & warranty support.",
  },
];

export const PRINCIPLES = [
  {
    title: "Thoughtful planning first",
    text: "We determine user intent, content hierarchy, and data schemas before writing code. Rushing into templates produces fragile sites; architecture produces longevity.",
    tag: "Zero bloated themes",
  },
  {
    title: "Complete asset ownership",
    text: "You own every line of code, domain, Git repository, and analytics property. We never lock you into recurring proprietary platform subscriptions.",
    tag: "100% client handover",
  },
  {
    title: "Speed & Core Web Vitals",
    text: "Speed directly dictates conversion rates and organic search rank. We target sub-second initial loads and 90+ Lighthouse scores on cellular networks.",
    tag: "Sub-second page loads",
  },
  {
    title: "Measurable business goals",
    text: "Every section, form field, and ad rupee spent is designed to generate qualified business inquiries, reduce manual busywork, or clarify your offering.",
    tag: "Practical commercial ROI",
  },
];

export const PRICING_TIERS = [
  {
    name: "Launch",
    startingPrice: "₹14,999",
    cadence: "Starting investment · One-time",
    tagline:
      "For small businesses and organizations establishing a professional digital presence.",
    featured: false,
    scope: [
      "One-page or five-page responsive website based on scope",
      "Handcrafted responsive UI (Desktop, Tablet, Mobile)",
      "Foundational on-page SEO & meta tags configuration",
      "Interactive contact form & direct WhatsApp chat link",
      "Google Maps & business contact integration",
      "Full ownership of code repository and assets",
      "7 days post-launch warranty & technical support",
    ],
    ctaText: "Choose Launch Plan",
    deliverableTime: "Typical delivery: 1–2 weeks",
  },
  {
    name: "Growth",
    startingPrice: "₹39,999",
    cadence: "Starting investment · One-time build",
    tagline:
      "For expanding businesses requiring a custom web application, automated workflows, and search visibility.",
    featured: true,
    badge: "Most selected by growing companies",
    scope: [
      "Custom multi-page website or bespoke web application",
      "Up to 3 business workflow automations (CRM / WhatsApp / Invoicing)",
      "Complete technical SEO architecture & JSON-LD schema",
      "Google Analytics 4 & Meta Pixel conversion tracking setup",
      "Initial Google Ads or Meta Ads campaign configuration",
      "Speed optimization targeting 90+ Lighthouse mobile score",
      "30 days dedicated post-launch support and refinement",
    ],
    ctaText: "Choose Growth Plan",
    deliverableTime: "Typical delivery: 3–5 weeks",
  },
  {
    name: "Scale",
    startingPrice: "₹89,999+",
    cadence: "Starting investment · Custom scoped",
    tagline:
      "For platforms, marketplaces, and brands seeking deep engineering and ongoing growth acceleration.",
    featured: false,
    scope: [
      "Complex web platform or hybrid web-plus-mobile solution",
      "Advanced custom integrations, webhooks & multi-step automations",
      "Custom administrative dashboard & operational reporting",
      "Optional ongoing technical SEO & paid acquisition management",
      "Database architecture & authenticated member portals",
      "High-availability hosting configuration & security hardening",
      "Priority SLA support & dedicated technical consultation",
    ],
    ctaText: "Discuss Custom Scope",
    deliverableTime: "Typical delivery: 6–10 weeks",
  },
];
