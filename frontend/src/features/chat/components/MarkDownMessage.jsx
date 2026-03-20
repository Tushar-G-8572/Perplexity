import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { FiCopy, FiCheck } from "react-icons/fi";

const MarkdownMessage = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = async (text, index = "all") => {
    await navigator.clipboard.writeText(text);

    if (index === "all") {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  return (
    <div
      style={{
        maxWidth: "920px",        // ⭐ VERY IMPORTANT READABLE WIDTH
        lineHeight: "1.85",
        fontSize: "15.5px",
        color: "#e5e7eb",
        position: "relative"
      }}
    >
      {/* Copy Full Response */}
      <button
        onClick={() => handleCopy(content)}
        style={{
          position: "absolute",
          bottom: "-30px",
          right: "-5px",
          background: "#111827",
          border: "1px solid #374151",
          padding: "6px 10px",
          borderRadius: "8px",
          cursor: "pointer",
          color: "#e5e7eb"
        }}
      >
        {copiedAll ? <FiCheck /> : <FiCopy />}
      </button>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: "30px", fontWeight: 700, marginTop: 28 }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginTop: 24 }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginTop: 22 }}>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p style={{ marginTop: 14, color: "#d1d5db" }}>{children}</p>
          ),
          ul: ({ children }) => (
            <ul style={{ marginTop: 14, paddingLeft: 22 }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ marginTop: 14, paddingLeft: 22 }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ marginTop: 8 }}>{children}</li>
          ),
          strong: ({ children }) => (
            <strong style={{ color: "#fff", fontWeight: 600 }}>
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "4px solid #374151",
                paddingLeft: 12,
                marginTop: 18,
                color: "#9ca3af"
              }}
            >
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr
              style={{
                borderColor: "#374151",
                marginTop: 26,
                marginBottom: 26
              }}
            />
          ),
          table: ({ children }) => (
            <table
              style={{
                marginTop: 18,
                borderCollapse: "collapse",
                width: "100%"
              }}
            >
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th
              style={{
                border: "1px solid #374151",
                padding: 8,
                background: "#111827"
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{ border: "1px solid #374151", padding: 8 }}>
              {children}
            </td>
          ),

          code({ inline, children, node }) {
            const codeText = String(children).replace(/\n$/, "");
            const index = node?.position?.start?.line;

            if (inline) {
              return (
                <code
                  style={{
                    background: "#111827",
                    padding: "3px 7px",
                    borderRadius: 6,
                    fontSize: 13
                  }}
                >
                  {children}
                </code>
              );
            }

            return (
              <div style={{ position: "relative", marginTop: 20 }}>
                <button
                  onClick={() => handleCopy(codeText, index)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "#111827",
                    border: "1px solid #374151",
                    padding: "5px 8px",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#e5e7eb"
                  }}
                >
                  {copiedIndex === index ? <FiCheck /> : <FiCopy />}
                </button>
                
                <pre
                  style={{
                    background: "#020617",
                    padding: 18,
                    borderRadius: 14,
                    overflow: "auto",
                    fontSize: 13,
                    border: "1px solid #1f2937"
                  }}
                >
                  <code>{children}</code>
                </pre>
              </div>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;