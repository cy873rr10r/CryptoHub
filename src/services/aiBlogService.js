/**
 * AI Blog Service
 * Generates educational crypto blog posts using Google Gemini API.
 * Falls back to a smart demo mode when no API key is configured.
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Build a structured prompt that asks the AI for JSON output.
 */
function buildPrompt(topic) {
  return `You are a professional cryptocurrency educator and writer. Generate a short, readable educational blog post about the following crypto topic: "${topic}".

Return ONLY valid JSON (no markdown fences, no extra text) in this exact format:
{
  "title": "A compelling title for the article",
  "introduction": "A clear 2-3 sentence introduction paragraph",
  "keyPoints": [
    { "heading": "Point 1 heading", "text": "1-2 sentence explanation" },
    { "heading": "Point 2 heading", "text": "1-2 sentence explanation" },
    { "heading": "Point 3 heading", "text": "1-2 sentence explanation" },
    { "heading": "Point 4 heading", "text": "1-2 sentence explanation" }
  ],
  "summary": "A concise 2-3 sentence conclusion summarizing the key takeaways"
}

Rules:
- Write for beginners who are new to crypto
- Keep language simple, clear, and engaging
- Use real-world analogies where helpful
- Be factually accurate and avoid hype`;
}

/**
 * Call the Gemini API and return structured blog content.
 */
async function callGeminiAPI(topic, apiKey) {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(topic) }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Gemini API error: ${response.status}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No content returned from Gemini API");
  }

  // Strip markdown fences if present
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

/**
 * Demo fallback — generates realistic-looking content without an API call.
 * This lets contributors and reviewers test the feature without an API key.
 */
function generateDemoContent(topic) {
  const topicLower = topic.toLowerCase().trim();

  const demoArticles = {
    default: {
      title: `Understanding ${topic}: A Beginner's Guide`,
      introduction: `${topic} is one of the most important concepts in the cryptocurrency ecosystem. Whether you're just starting your crypto journey or looking to deepen your understanding, this guide breaks down everything you need to know about ${topic} in simple, easy-to-follow terms.`,
      keyPoints: [
        {
          heading: "What It Is",
          text: `At its core, ${topic} refers to a fundamental mechanism in the blockchain and cryptocurrency space. Think of it like a building block that helps the entire ecosystem function more efficiently and securely.`,
        },
        {
          heading: "Why It Matters",
          text: `Understanding ${topic} is crucial because it directly impacts how value is transferred, stored, and secured in the crypto world. It plays a key role in making decentralized finance accessible to everyone.`,
        },
        {
          heading: "How It Works",
          text: `The process involves a combination of cryptographic techniques and consensus mechanisms that work together seamlessly. Users interact with it through wallets, exchanges, and decentralized applications without needing deep technical knowledge.`,
        },
        {
          heading: "Getting Started",
          text: `To begin exploring ${topic}, start with reputable exchanges and educational resources. Always do your own research (DYOR) and never invest more than you can afford to lose.`,
        },
      ],
      summary: `${topic} represents a fascinating aspect of the crypto ecosystem that continues to evolve. By understanding its fundamentals, you're better equipped to navigate the world of digital assets. Stay curious, stay informed, and remember that the crypto space rewards those who take the time to learn.`,
    },
    staking: {
      title: "What is Crypto Staking? Earn Rewards While You Sleep",
      introduction:
        "Staking is one of the easiest ways to earn passive income in crypto. By locking up your tokens to help secure a blockchain network, you earn rewards — similar to earning interest in a savings account, but often with much higher returns.",
      keyPoints: [
        {
          heading: "How Staking Works",
          text: "When you stake crypto, you lock your tokens in a smart contract to help validate transactions on a Proof-of-Stake (PoS) blockchain. In return, the network rewards you with additional tokens — typically between 4-12% APY.",
        },
        {
          heading: "Proof-of-Stake vs Proof-of-Work",
          text: "Unlike Proof-of-Work (Bitcoin mining) which requires massive computing power, Proof-of-Stake selects validators based on how many tokens they've staked. This makes it far more energy-efficient and accessible to everyday users.",
        },
        {
          heading: "Popular Staking Coins",
          text: "Ethereum (ETH), Solana (SOL), Cardano (ADA), and Polkadot (DOT) are among the most popular staking cryptocurrencies. Each offers different reward rates and lock-up periods.",
        },
        {
          heading: "Risks to Consider",
          text: "Staking isn't risk-free. Your tokens may be locked for a period (unbonding period), token prices can drop while staked, and some protocols have slashing penalties for validator misbehavior.",
        },
      ],
      summary:
        "Staking offers an attractive way to earn passive income while supporting blockchain networks. Start small, choose reputable platforms, and understand the lock-up periods before committing your tokens. It's one of the most beginner-friendly ways to grow your crypto portfolio.",
    },
    defi: {
      title: "DeFi Explained: The Future of Finance Without Banks",
      introduction:
        "Decentralized Finance (DeFi) is reimagining traditional financial services — lending, borrowing, trading, and insurance — without intermediaries like banks. Built on blockchain technology, DeFi gives anyone with an internet connection access to financial services that were once exclusive to the privileged few.",
      keyPoints: [
        {
          heading: "What Makes DeFi Different",
          text: "DeFi protocols run on smart contracts — self-executing code on the blockchain. There's no CEO, no bank branch, and no approval process. Anyone can participate, and all transactions are transparent and verifiable on-chain.",
        },
        {
          heading: "Key DeFi Applications",
          text: "The most popular DeFi use cases include decentralized exchanges (DEXs) like Uniswap, lending platforms like Aave and Compound, and yield farming protocols that let users maximize returns across multiple platforms.",
        },
        {
          heading: "How to Get Started",
          text: "To use DeFi, you need a Web3 wallet like MetaMask, some cryptocurrency (usually ETH), and a basic understanding of gas fees. Start with well-established protocols and small amounts while you learn the ropes.",
        },
        {
          heading: "Risks and Challenges",
          text: "DeFi is powerful but not without risks: smart contract vulnerabilities, impermanent loss in liquidity pools, and the complexity of navigating multiple protocols. Always research before depositing funds.",
        },
      ],
      summary:
        "DeFi represents one of the most transformative innovations in finance. While it's still early and risks exist, the ability to access financial services without gatekeepers is revolutionary. Start small, learn continuously, and remember that DeFi rewards the curious and the cautious alike.",
    },
    bitcoin: {
      title: "Bitcoin 101: The Digital Gold That Started It All",
      introduction:
        "Bitcoin is the world's first and most well-known cryptocurrency, created in 2009 by the mysterious Satoshi Nakamoto. Often called 'digital gold,' Bitcoin introduced the concept of decentralized, peer-to-peer money that operates without any central authority.",
      keyPoints: [
        {
          heading: "How Bitcoin Works",
          text: "Bitcoin runs on a decentralized network of computers (nodes) that maintain a shared ledger called the blockchain. Transactions are verified by miners who solve complex mathematical puzzles, earning new Bitcoin as a reward.",
        },
        {
          heading: "Why Bitcoin Has Value",
          text: "Bitcoin's value comes from its scarcity (only 21 million will ever exist), its decentralized nature, security through cryptography, and growing adoption by individuals, institutions, and even nations as a store of value.",
        },
        {
          heading: "Bitcoin Halvings",
          text: "Approximately every four years, the reward for mining new Bitcoin is cut in half — an event called the 'halving.' This built-in scarcity mechanism has historically preceded major price increases as new supply decreases.",
        },
        {
          heading: "Storing Bitcoin Safely",
          text: "Bitcoin can be stored in hot wallets (online, convenient) or cold wallets (offline, more secure). Hardware wallets like Ledger and Trezor offer the best security for long-term storage. Always backup your seed phrase.",
        },
      ],
      summary:
        "Bitcoin remains the cornerstone of the cryptocurrency ecosystem. Its fixed supply, decentralized nature, and growing institutional adoption make it a unique digital asset. Whether you're looking to invest or simply understand the technology, Bitcoin is the essential starting point for your crypto education.",
    },
    solana: {
      title: "Solana: The High-Speed Blockchain Taking On Ethereum",
      introduction:
        "Solana is a high-performance blockchain known for its blazing-fast transaction speeds and ultra-low fees. Launched in 2020, it has quickly become one of the top platforms for DeFi, NFTs, and decentralized applications, processing thousands of transactions per second.",
      keyPoints: [
        {
          heading: "Speed and Scalability",
          text: "Solana can handle up to 65,000 transactions per second (TPS) with sub-second finality, thanks to its unique Proof-of-History consensus mechanism. This makes it one of the fastest blockchains in existence.",
        },
        {
          heading: "Low Transaction Costs",
          text: "Average transaction fees on Solana are fractions of a cent — typically around $0.00025. This makes it ideal for micropayments, gaming, and high-frequency DeFi activities where Ethereum's gas fees would be prohibitive.",
        },
        {
          heading: "Growing Ecosystem",
          text: "Solana hosts a thriving ecosystem including Jupiter (DEX aggregator), Marinade Finance (staking), Magic Eden (NFT marketplace), and hundreds of other dApps. Developer activity continues to grow rapidly.",
        },
        {
          heading: "Trade-offs and Challenges",
          text: "Solana has faced network outages in the past, raising questions about reliability. It's also more centralized than Ethereum with fewer validators. However, ongoing upgrades aim to address these concerns.",
        },
      ],
      summary:
        "Solana offers a compelling alternative for developers and users who need speed and low costs. While it has trade-offs compared to Ethereum, its growing ecosystem and technical improvements make it a blockchain worth watching. It's proof that innovation in the crypto space is far from over.",
    },
  };

  // Match against known topics
  for (const [key, article] of Object.entries(demoArticles)) {
    if (key !== "default" && topicLower.includes(key)) {
      return article;
    }
  }

  return demoArticles.default;
}

/**
 * Main entry point — generates a blog post for the given topic.
 * Uses Gemini API if configured, otherwise falls back to demo mode.
 *
 * @param {string} topic - The crypto topic to write about
 * @returns {Promise<{title, introduction, keyPoints, summary, isDemo}>}
 */
export async function generateBlogPost(topic) {
  if (!topic || topic.trim().length === 0) {
    throw new Error("Please enter a topic to generate an article.");
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // If no API key or it's the placeholder, use demo mode
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    // Simulate a network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ...generateDemoContent(topic), isDemo: true };
  }

  try {
    const content = await callGeminiAPI(topic, apiKey);
    return { ...content, isDemo: false };
  } catch (error) {
    console.error("Gemini API error, falling back to demo mode:", error);
    // Graceful fallback to demo
    return { ...generateDemoContent(topic), isDemo: true };
  }
}
