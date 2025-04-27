import React, { useState, useEffect } from "react";

// Constants
const API_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=s6YGZvbfvjvvoovzBVFJQ2eCVoYzfbTd';

// Helper function to get image URL
const getArticleImage = (article) => {
  if (article.multimedia && article.multimedia.length > 0) {
    const image = article.multimedia.find(media => media.subtype === 'thumbnail') || article.multimedia[0];
    return `https://www.nytimes.com/${image.url}`;
  }
  return null;
};

// Banner Component
const Banner = ({ imageUrl, altText }) => (
  <div style={{ marginBottom: "30px" }}>
    <img
      src={imageUrl}
      alt={altText}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "300px",
        objectFit: "cover",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    />
  </div>
);

// Article Card Component
const ArticleCard = ({ article, isExpanded, onExpand, index }) => {
  const imageUrl = getArticleImage(article);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onClick={() => onExpand(index)}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Article"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
          }}
        />
      )}

      <div style={{ padding: "15px", flexGrow: 1 }}>
        <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#003366" }}>
          {article.headline?.main}
        </h3>
        <p style={{ fontSize: "14px", color: "#555" }}>
          {article.snippet}
        </p>

        {isExpanded && (
          <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
            <p><strong>Lead:</strong> {article.lead_paragraph}</p>
            <p><strong>Author:</strong> {article.byline?.original || 'Unknown'}</p>
            <p><strong>Date:</strong> {new Date(article.pub_date).toLocaleDateString()}</p>
            <p><strong>Source:</strong> {article.source}</p>
            {article.web_url && (
              <p>
                <a href={article.web_url} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF" }}>
                  Read Full Article
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: isExpanded ? "#003366" : "#007BFF",
          color: "white",
          textAlign: "center",
          padding: "10px",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {isExpanded ? "Show Less" : "Read More"}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setArticles(data.response.docs || []);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Expand or collapse article
  const handleExpand = (index) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      
      {/* Banner */}
      <Banner imageUrl="./news.png" altText="News Banner" />

      {/* Articles Section */}
      {isLoading ? (
        <h2 style={{ textAlign: "center" }}>Loading articles...</h2>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              article={article}
              isExpanded={expandedIndex === index}
              onExpand={handleExpand}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
