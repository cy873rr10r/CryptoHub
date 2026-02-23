import React, { useEffect, useState, useMemo } from "react";
import { getTopCoins } from "../CryptoChatbot/coinGeckoService";
import { useNavigate } from "react-router-dom";

const COINS_PER_PAGE = 10;
const MAX_PAGES = 5;

const TrendingCoins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    async function fetchTopCoins() {
      setLoading(true);~
      setError(null);
      try {
        // Fetch top 50 coins by market cap in USD
        const data = await getTopCoins("usd", COINS_PER_PAGE * MAX_PAGES, 1);
        setCoins(data || []);
        setTotalPages(Math.ceil((data?.length || 0) / COINS_PER_PAGE));
      } catch (err) {
        setError("Failed to fetch top coins.");
      } finally {
        setLoading(false);
      }
    }
    fetchTopCoins();
  }, []);

  // Sort by market cap rank ascending
  const sortedCoins = useMemo(() => {
    return [...coins].sort((a, b) => {
      if (!a.market_cap_rank) return 1;
      if (!b.market_cap_rank) return -1;
      return a.market_cap_rank - b.market_cap_rank;
    });
  }, [coins]);

  // Paginate coins
  const paginatedCoins = useMemo(() => {
    const start = (page - 1) * COINS_PER_PAGE;
    return sortedCoins.slice(start, start + COINS_PER_PAGE);
  }, [sortedCoins, page]);

  // Pagination UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, MAX_PAGES); i++) {
      pages.push(
        <button
          key={i}
          style={i === page ? styles.paginationActive : styles.paginationBtn}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return (
      <div style={styles.paginationWrapper}>
        <button
          style={styles.paginationNav}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          &lt; Prev
        </button>
        {pages}
        <button
          style={styles.paginationNav}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next &gt;
        </button>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Trending Coins</h1>
        {loading && <p style={styles.message}>Loading...</p>}
        {error && <p style={{ ...styles.message, color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Coin</th>
                    <th style={styles.th}>Price (USD)</th>
                    <th style={styles.th}>Market Rank</th>
                    <th style={styles.th}>Market Cap</th>
                    <th style={styles.th}>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCoins.map((coin, index) => (
                    <tr
                      key={coin.id}
                      style={styles.tr}
                      onClick={() => navigate(`/coin/${coin.id}`)}
                    >
                      <td style={styles.td}>{(page - 1) * COINS_PER_PAGE + index + 1}</td>
                      <td style={styles.coinCell}>
                        <img
                          src={coin.image}
                          alt={coin.name}
                          style={styles.coinImg}
                        />
                        <div>
                          <div style={styles.coinName}>{coin.name}</div>
                          <div style={styles.coinSymbol}>{coin.symbol?.toUpperCase()}</div>
                        </div>
                      </td>
                      <td style={styles.td}>${coin.current_price?.toLocaleString()}</td>
                      <td style={styles.td}>#{coin.market_cap_rank || "N/A"}</td>
                      <td style={styles.td}>${coin.market_cap?.toLocaleString() || "N/A"}</td>
                      <td style={{...styles.td, color: coin.price_change_percentage_24h >= 0 ? '#00ffab' : '#ff4d4f', fontWeight: 600}}>
                        {coin.price_change_percentage_24h !== undefined ? `${coin.price_change_percentage_24h >= 0 ? '↑' : '↓'} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0b0f2a, #140c3a, #1c0f4d)",
    padding: "60px 20px",
    color: "#fff",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 0 40px rgba(98, 0, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "25px",
  },

  message: {
    textAlign: "center",
    padding: "20px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeadRow: {
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    fontSize: "13px",
    color: "#a78bfa",
    letterSpacing: "1px",
  },

  tr: {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    cursor: "pointer",
    transition: "0.3s",
  },

  td: {
    padding: "16px 14px",
    fontSize: "14px",
  },

  coinCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 14px",
  },

  coinImg: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
  },

  coinName: {
    fontWeight: "600",
  },

  coinSymbol: {
    fontSize: "12px",
    color: "#aaa",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    background: "rgba(0, 255, 255, 0.15)",
    color: "#00f7ff",
  },

  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    margin: "32px 0 0 0",
  },

  paginationBtn: {
    background: "#18192b",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 18px",
    fontSize: 18,
    fontWeight: 500,
    cursor: "pointer",
    margin: "0 2px",
    transition: "background 0.2s, color 0.2s",
  },

  paginationActive: {
    background: "#7c5cff",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 18px",
    fontSize: 18,
    fontWeight: 700,
    boxShadow: "0 0 12px #7c5cff55",
    margin: "0 2px",
    cursor: "pointer",
  },

  paginationNav: {
    background: "#18192b",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    padding: "10px 24px",
    fontSize: 17,
    fontWeight: 600,
    margin: "0 8px",
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 0.2s",
    outline: "none",
    boxShadow: "0 0 0 1.5px #23243a",
    disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
};

export default TrendingCoins;
