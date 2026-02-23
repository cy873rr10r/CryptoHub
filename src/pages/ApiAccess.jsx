import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiCopy,
  FiCheck,
  FiKey,
  FiZap,
  FiBookOpen,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
} from "react-icons/fi";
import "./ApiAccess.css";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const ENDPOINTS = [
  {
    method: "GET",
    path: "/coins/markets",
    description: "Fetch a list of coins with market data (price, volume, market cap, 24h change).",
    params: [
      { name: "vs_currency", type: "string", required: true, desc: "Target currency (e.g. usd, eur, inr)" },
      { name: "order", type: "string", required: false, desc: "market_cap_desc | market_cap_asc | volume_desc" },
      { name: "per_page", type: "number", required: false, desc: "Results per page (1–250). Default: 100" },
      { name: "page", type: "number", required: false, desc: "Page number. Default: 1" },
      { name: "sparkline", type: "boolean", required: false, desc: "Include sparkline 7d data. Default: false" },
      { name: "price_change_percentage", type: "string", required: false, desc: "Comma-separated intervals: 1h,24h,7d,14d,30d" },
      { name: "x_cg_demo_api_key", type: "string", required: false, desc: "Your CoinGecko Demo API Key" },
    ],
    example: {
      fetch: `const res = await fetch(
  "https://api.coingecko.com/api/v3/coins/markets?" +
  new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: "10",
    page: "1",
    sparkline: "false",
    price_change_percentage: "24h",
    x_cg_demo_api_key: "YOUR_API_KEY",
  })
);
const data = await res.json();
console.log(data);`,
      curl: `curl -X GET \\
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1" \\
  -H "accept: application/json" \\
  -H "x-cg-demo-api-key: YOUR_API_KEY"`,
    },
    responseSnippet: `[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "current_price": 67234.12,
    "market_cap": 1324678900000,
    "market_cap_rank": 1,
    "total_volume": 28456789012,
    "price_change_percentage_24h": 2.45,
    "circulating_supply": 19700000,
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  ...
]`,
  },
  {
    method: "GET",
    path: "/coins/{id}",
    description: "Get detailed data for a single coin including description, links, market data, and community stats.",
    params: [
      { name: "id", type: "string", required: true, desc: "Coin ID (e.g. bitcoin, ethereum, solana)" },
      { name: "localization", type: "boolean", required: false, desc: "Include all localized languages. Default: true" },
      { name: "tickers", type: "boolean", required: false, desc: "Include tickers data. Default: true" },
      { name: "market_data", type: "boolean", required: false, desc: "Include market data. Default: true" },
      { name: "community_data", type: "boolean", required: false, desc: "Include community data. Default: true" },
      { name: "developer_data", type: "boolean", required: false, desc: "Include developer activity data. Default: true" },
    ],
    example: {
      fetch: `const res = await fetch(
  "https://api.coingecko.com/api/v3/coins/bitcoin?" +
  new URLSearchParams({
    localization: "false",
    tickers: "false",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
  }),
  { headers: { "x-cg-demo-api-key": "YOUR_API_KEY" } }
);
const data = await res.json();
console.log(data.market_data.current_price);`,
      curl: `curl -X GET \\
  "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true" \\
  -H "accept: application/json" \\
  -H "x-cg-demo-api-key: YOUR_API_KEY"`,
    },
    responseSnippet: `{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "description": { "en": "Bitcoin is a decentralized..." },
  "market_data": {
    "current_price": { "usd": 67234.12, "eur": 61200 },
    "market_cap": { "usd": 1324678900000 },
    "price_change_percentage_24h": 2.45,
    "ath": { "usd": 73750 },
    "atl": { "usd": 67.81 }
  }
}`,
  },
  {
    method: "GET",
    path: "/coins/{id}/market_chart",
    description: "Get historical market data (price, market cap, volume) over a given time range for charting.",
    params: [
      { name: "id", type: "string", required: true, desc: "Coin ID (e.g. bitcoin)" },
      { name: "vs_currency", type: "string", required: true, desc: "Target currency (e.g. usd)" },
      { name: "days", type: "string", required: true, desc: "Number of days: 1, 7, 14, 30, 90, 180, 365, max" },
      { name: "interval", type: "string", required: false, desc: "Data interval: daily (optional, auto-calculated otherwise)" },
    ],
    example: {
      fetch: `const res = await fetch(
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?" +
  new URLSearchParams({
    vs_currency: "usd",
    days: "30",
    interval: "daily",
  }),
  { headers: { "x-cg-demo-api-key": "YOUR_API_KEY" } }
);
const { prices, market_caps, total_volumes } = await res.json();
// prices: [[timestamp, price], ...]`,
      curl: `curl -X GET \\
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily" \\
  -H "accept: application/json" \\
  -H "x-cg-demo-api-key: YOUR_API_KEY"`,
    },
    responseSnippet: `{
  "prices": [
    [1706745600000, 42365.12],
    [1706832000000, 43102.87],
    ...
  ],
  "market_caps": [
    [1706745600000, 832000000000],
    ...
  ],
  "total_volumes": [
    [1706745600000, 18900000000],
    ...
  ]
}`,
  },
  {
    method: "GET",
    path: "/search/trending",
    description: "Get the top 7 trending coins on CoinGecko in the last 24 hours based on search volume.",
    params: [],
    example: {
      fetch: `const res = await fetch(
  "https://api.coingecko.com/api/v3/search/trending",
  { headers: { "x-cg-demo-api-key": "YOUR_API_KEY" } }
);
const { coins } = await res.json();
console.log(coins.map(c => c.item.name));`,
      curl: `curl -X GET \\
  "https://api.coingecko.com/api/v3/search/trending" \\
  -H "accept: application/json" \\
  -H "x-cg-demo-api-key: YOUR_API_KEY"`,
    },
    responseSnippet: `{
  "coins": [
    {
      "item": {
        "id": "solana",
        "name": "Solana",
        "symbol": "SOL",
        "market_cap_rank": 5,
        "score": 0
      }
    },
    ...
  ]
}`,
  },
];

const RATE_LIMITS = [
  { tier: "Free (No Key)", limit: "10–15 calls/min", notes: "Public access, no key needed. May be throttled." },
  { tier: "Demo Key", limit: "30 calls/min", notes: "Free CoinGecko Demo API key via coingecko.com." },
  { tier: "Analyst", limit: "500 calls/min", notes: "Paid plan — includes priority access." },
  { tier: "Lite", limit: "500 calls/min", notes: "Paid plan — dedicated endpoints." },
  { tier: "Pro", limit: "1000 calls/min", notes: "Highest throughput for production apps." },
];

const FAQS = [
  {
    q: "Where does CryptoHub get its data?",
    a: "All market data is sourced from the CoinGecko API (v3). CryptoHub uses the public endpoints for prices, market caps, volumes, and coin details.",
  },
  {
    q: "How do I get a free API key?",
    a: "Register at coingecko.com/en/developers/dashboard and generate a free Demo API key. Add it as VITE_CG_API_KEY in your .env file.",
  },
  {
    q: "Do I need an API key to run CryptoHub?",
    a: "No. CryptoHub works without a key using CoinGecko's public endpoints, but you may hit rate limits faster. A free Demo key is recommended.",
  },
  {
    q: "How do I set the API key in the project?",
    a: 'Create a .env file at the project root and add: VITE_CG_API_KEY=your_key_here. Then restart the dev server.',
  },
  {
    q: "Are there WebSocket / real-time feeds?",
    a: "CoinGecko's free tier does not provide WebSocket streams. CryptoHub polls the REST API on an interval to refresh data.",
  },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const MethodBadge = ({ method }) => (
  <span className={`aa-method-badge aa-method-${method.toLowerCase()}`}>{method}</span>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="aa-copy-btn" onClick={handleCopy} title="Copy to clipboard">
      {copied ? <FiCheck /> : <FiCopy />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const EndpointCard = ({ endpoint }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("fetch");

  return (
    <div className="aa-endpoint-card glass-panel">
      <button className="aa-endpoint-header" onClick={() => setOpen((o) => !o)}>
        <div className="aa-endpoint-title">
          <MethodBadge method={endpoint.method} />
          <code className="aa-path">{endpoint.path}</code>
        </div>
        <div className="aa-endpoint-right">
          <span className="aa-endpoint-desc-inline">{endpoint.description}</span>
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </button>

      {open && (
        <div className="aa-endpoint-body">
          <p className="aa-desc">{endpoint.description}</p>

          {/* Parameters */}
          {endpoint.params.length > 0 && (
            <div className="aa-params-section">
              <h4 className="aa-section-label">Parameters</h4>
              <div className="aa-params-table">
                <div className="aa-params-head">
                  <span>Name</span>
                  <span>Type</span>
                  <span>Required</span>
                  <span>Description</span>
                </div>
                {endpoint.params.map((p) => (
                  <div key={p.name} className="aa-params-row">
                    <code className="aa-param-name">{p.name}</code>
                    <span className="aa-param-type">{p.type}</span>
                    <span className={`aa-param-req ${p.required ? "required" : "optional"}`}>
                      {p.required ? "Yes" : "No"}
                    </span>
                    <span className="aa-param-desc">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Examples */}
          <div className="aa-code-section">
            <div className="aa-code-tabs">
              <h4 className="aa-section-label">Example Request</h4>
              <div className="aa-tab-btns">
                <button
                  className={`aa-tab-btn ${tab === "fetch" ? "active" : ""}`}
                  onClick={() => setTab("fetch")}
                >
                  fetch (JS)
                </button>
                <button
                  className={`aa-tab-btn ${tab === "curl" ? "active" : ""}`}
                  onClick={() => setTab("curl")}
                >
                  cURL
                </button>
              </div>
            </div>
            <div className="aa-code-block">
              <CopyButton text={endpoint.example[tab]} />
              <pre><code>{endpoint.example[tab]}</code></pre>
            </div>
          </div>

          {/* Response */}
          <div className="aa-response-section">
            <h4 className="aa-section-label">Sample Response</h4>
            <div className="aa-code-block aa-response-block">
              <CopyButton text={endpoint.responseSnippet} />
              <pre><code>{endpoint.responseSnippet}</code></pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="aa-faq-item glass-panel">
      <button className="aa-faq-q" onClick={() => setOpen((o) => !o)}>
        <span>{faq.q}</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {open && <p className="aa-faq-a">{faq.a}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const ApiAccess = () => {
  return (
    <div className="api-access-container">
      {/* Hero */}
      <section className="aa-hero">
        <div className="aa-hero-glow" />
        <div className="aa-hero-glow-secondary" />

        <motion.div
          className="aa-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="aa-hero-badge">
            <FiCode className="badge-icon" />
            <span>Developer API</span>
          </div>

          <h1 className="aa-hero-title">
            <span className="aa-title-purple">CryptoHub</span>
            <br />
            <span className="aa-title-cyan">API Reference</span>
          </h1>

          <p className="aa-hero-subtitle">
            Everything you need to integrate and build with CryptoHub. All
            market data is powered by the{" "}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="aa-ext-link"
            >
              CoinGecko API v3 <FiExternalLink style={{ display: "inline" }} />
            </a>
            .
          </p>

          <div className="aa-hero-stats">
            <div className="aa-stat-card glass-card">
              <FiZap className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">4</span>
                <span className="stat-label">Endpoints</span>
              </div>
            </div>
            <div className="aa-stat-card glass-card">
              <FiKey className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">Free</span>
                <span className="stat-label">Demo Key</span>
              </div>
            </div>
            <div className="aa-stat-card glass-card">
              <FiBookOpen className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">REST</span>
                <span className="stat-label">Protocol</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Base URL banner */}
      <section className="aa-section">
        <div className="aa-base-url glass-panel">
          <span className="aa-base-label">Base URL</span>
          <code className="aa-base-value">https://api.coingecko.com/api/v3</code>
          <CopyButton text="https://api.coingecko.com/api/v3" />
        </div>
      </section>

      {/* API Key Setup */}
      <section className="aa-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="aa-h2">
            <FiKey className="aa-h2-icon" /> API Key Setup
          </h2>
          <div className="aa-key-grid">
            <div className="aa-key-step glass-panel">
              <span className="aa-step-num">01</span>
              <h3>Create an Account</h3>
              <p>
                Visit{" "}
                <a href="https://www.coingecko.com/en/developers/dashboard" target="_blank" rel="noopener noreferrer" className="aa-ext-link">
                  coingecko.com/developers <FiExternalLink style={{ display: "inline" }} />
                </a>{" "}
                and sign up for a free account.
              </p>
            </div>
            <div className="aa-key-step glass-panel">
              <span className="aa-step-num">02</span>
              <h3>Generate a Demo Key</h3>
              <p>
                In the developer dashboard, create a new Demo API key. It's
                free and gives you 30 calls/minute.
              </p>
            </div>
            <div className="aa-key-step glass-panel">
              <span className="aa-step-num">03</span>
              <h3>Add Key to Project</h3>
              <p>
                Create a <code>.env</code> file at the project root and add:
              </p>
              <div className="aa-code-block aa-env-block">
                <CopyButton text="VITE_CG_API_KEY=your_api_key_here" />
                <pre><code>VITE_CG_API_KEY=your_api_key_here</code></pre>
              </div>
            </div>
            <div className="aa-key-step glass-panel">
              <span className="aa-step-num">04</span>
              <h3>Restart Dev Server</h3>
              <p>
                Stop the running server and run <code>npm run dev</code> again.
                The key is now picked up automatically by CryptoHub.
              </p>
            </div>
          </div>

          <div className="aa-notice glass-panel">
            <FiAlertCircle className="aa-notice-icon" />
            <p>
              <strong>Never commit your API key.</strong> Add <code>.env</code>{" "}
              to your <code>.gitignore</code> to prevent accidental exposure.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Endpoints */}
      <section className="aa-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="aa-h2">
            <FiCode className="aa-h2-icon" /> Available Endpoints
          </h2>
          <p className="aa-section-sub">
            Click any endpoint to expand its parameters, code examples, and sample response.
          </p>
          <div className="aa-endpoints-list">
            {ENDPOINTS.map((ep) => (
              <EndpointCard key={ep.path} endpoint={ep} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Rate Limits */}
      <section className="aa-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="aa-h2">
            <FiZap className="aa-h2-icon" /> Rate Limits
          </h2>
          <div className="aa-rate-table glass-panel">
            <div className="aa-rate-head">
              <span>Tier</span>
              <span>Rate Limit</span>
              <span>Notes</span>
            </div>
            {RATE_LIMITS.map((r) => (
              <div key={r.tier} className="aa-rate-row">
                <span className="aa-rate-tier">{r.tier}</span>
                <span className="aa-rate-limit">{r.limit}</span>
                <span className="aa-rate-notes">{r.notes}</span>
              </div>
            ))}
          </div>
          <p className="aa-rate-note">
            When a rate limit is exceeded the API returns HTTP <code>429 Too Many Requests</code>. Implement
            exponential back-off in production apps.
          </p>
        </motion.div>
      </section>

      {/* Authentication */}
      <section className="aa-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="aa-h2">
            <FiKey className="aa-h2-icon" /> Authentication
          </h2>
          <div className="aa-auth-grid">
            <div className="aa-auth-card glass-panel">
              <h3>Query Parameter</h3>
              <p>Append your key as a URL query param:</p>
              <div className="aa-code-block">
                <CopyButton text={`?x_cg_demo_api_key=YOUR_KEY`} />
                <pre><code>?x_cg_demo_api_key=YOUR_KEY</code></pre>
              </div>
            </div>
            <div className="aa-auth-card glass-panel">
              <h3>Request Header</h3>
              <p>Pass the key as an HTTP header:</p>
              <div className="aa-code-block">
                <CopyButton text={`x-cg-demo-api-key: YOUR_KEY`} />
                <pre><code>x-cg-demo-api-key: YOUR_KEY</code></pre>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="aa-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="aa-h2">
            <FiBookOpen className="aa-h2-icon" /> FAQ
          </h2>
          <div className="aa-faq-list">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} faq={faq} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="aa-section aa-cta-section">
        <motion.div
          className="aa-cta glass-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Ready to build?</h2>
          <p>Get your free CoinGecko Demo API key and start integrating in minutes.</p>
          <a
            href="https://www.coingecko.com/en/developers/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="aa-cta-btn"
          >
            Get Free API Key <FiExternalLink />
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default ApiAccess;
