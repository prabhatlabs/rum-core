export const hero = {
    herotext: "Stop guessing. See exactly what your users experience.",
    herodesc: "Go beyond Lighthouse scores. Monitor real-world interactions across every ISP, region, and device. Get deep visibility into broken APIs and slow page loads with one simple script.",

    secondarytext: "Performance monitoring that doesnt cost you performance.",
    secondarydesc: "A ~5kb heartbeat for your web app. Capture Web Vitals, API latencies, and user environment data with zero overhead—enriched at the edge and built for the modern developer."
}

export const features = [
    {
        text: "Lightweight Script (~5kb)",
        desc: "Our tracking script is optimized for performance. It wont affect your Lighthouse scores or LCP."
    },
    {
        title: "Core Web Vitals",
        desc: "Capture LCP, CLS, and INP from actual user sessions to see your site's true performance floor."
    },
    {
        title: "Request Interception",
        desc: "Automatically intercept fetch and XHR calls, capturing API latency, status codes, and payload sizes without manual instrumenting."
    },
    {
        title: "Geo & ISP Enrichment",
        desc: "Analyze performance by country, city, and ISP. Understand how global network conditions impact your app."
    }
]

export const howto = {
    head: "Integrated in 60 seconds. No SDK required.",
    subhead: "Stop wrestling with complex configurations. rum-core is a drop-in solution that works with any framework.",
    steps: [
        "The Script. Add our ~5kb vanilla JS snippet to your <head>.",
        "The Key. Provide your unique project API key.",
        "The Insight. Watch as events stream into your dashboard in real-time."
    ],
    code: `
        <script,
          src="<script-url>",
          data-worker="<worker-url>",
          data-key="<project-key>",
        />
    `
}


export const pricing = {
    head: "Simple, transparent pricing.",
    subhead: "Scale your monitoring as you grow.",
    plans: [
        {
            name: "Free",
            price: 0,
            activeProjects: 2,
            callsPerDay: 50000,
            dataRetentionDays: 7,
            features: [
                "Core Web Vitals (LCP, CLS, INP)",
                "Basic API & Network Interception",
                "Community Support"
            ],
            buttonText: "Get Started for Free"
        },
        {
            name: "Pro",
            price: 10,
            activeProjects: 8,
            callsPerDay: 500000,
            dataRetentionDays: 30,
            features: [
                "Priority API & Network Interception",
                "Advanced Geo & ISP Breakdown",
                "Full Environment drill-down (OS/Browser/Connection)",
                "Email Support"
            ],
            buttonText: "Contact Us / Join Beta"
        }
    ]
}

export const bottomhero = {
    herotext: "Your users aren't browsing in a lab.",
    herodesc: "Lab tests hide real-world lag. rum-core captures the truth of every ISP, every 3G connection, and every regional outage. Stop optimizing for robots and start building for people."
}