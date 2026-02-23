import React, { useState } from "react";
import { motion } from "framer-motion";
import { generateBlogPost } from "../../services/aiBlogService";
import AIBlogCard from "./AIBlogCard";
import "./AIBlogGenerator.css";

const SUGGESTIONS = [
    "What is staking?",
    "DeFi explained",
    "Bitcoin basics",
    "Solana overview",
    "What are gas fees?",
    "NFTs for beginners",
];

/**
 * AIBlogGenerator — input + generate button + rendered output.
 * Completely self-contained, no props required.
 *
 * Props (optional):
 *   onArticleGenerated(article) — callback when an article is produced
 */
export default function AIBlogGenerator({ onArticleGenerated }) {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState(null);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        const trimmed = topic.trim();
        if (!trimmed) {
            setError("Please enter a crypto topic to generate an article.");
            return;
        }

        setError("");
        setLoading(true);
        setArticle(null);

        try {
            const result = await generateBlogPost(trimmed);
            setArticle(result);
            onArticleGenerated?.(result);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !loading) {
            handleGenerate();
        }
    };

    const handleSuggestion = (text) => {
        setTopic(text);
        setError("");
    };

    const handleNewArticle = () => {
        setArticle(null);
        setTopic("");
    };

    return (
        <div className="ai-blog-generator">
            {/* Input + Button */}
            <motion.div
                className="ai-blog-generator__input-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <input
                    id="ai-blog-topic"
                    type="text"
                    className="ai-blog-generator__input"
                    placeholder='Enter a crypto topic — e.g. "What is DeFi?"'
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    autoComplete="off"
                />
                <button
                    id="ai-blog-generate-btn"
                    className="ai-blog-generator__btn"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="ai-blog-generator__spinner" />
                            Generating…
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M8 1L10.2 5.6L15 6.5L11.5 10L12.3 15L8 12.6L3.7 15L4.5 10L1 6.5L5.8 5.6L8 1Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Generate Article
                        </>
                    )}
                </button>
            </motion.div>

            {/* Quick Suggestions */}
            {!article && (
                <motion.div
                    className="ai-blog-generator__suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            className="ai-blog-generator__suggestion"
                            onClick={() => handleSuggestion(s)}
                            disabled={loading}
                        >
                            {s}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Error Message */}
            {error && (
                <motion.div
                    className="ai-blog-generator__error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </motion.div>
            )}

            {/* Generated Article Card */}
            {article && (
                <AIBlogCard article={article} onNewArticle={handleNewArticle} />
            )}
        </div>
    );
}
