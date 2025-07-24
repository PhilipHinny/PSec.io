"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaCog,
  FaUser,
  FaDownload,
  FaSignOutAlt,
  FaFileAlt,
  FaBell,
  FaLock,
  FaSlidersH,
  FaTachometerAlt,
  FaEdit,
  FaPaperPlane,
} from "react-icons/fa"
import saveAs from "file-saver"
import Sidebar from "../components/Sidebar"
import Login from "../components/Login"
import "../styles/ActivityPage.css"
import API_BASE_URL from "../apiConfig"
import ReactMarkdown from "react-markdown"
import html2pdf from "html2pdf.js"
import { v4 as uuidv4 } from "uuid";

const defaultProfileImage = "https://www.example.com/default-profile-image.jpg"

const ActivityPage = ({ user, onLoginSuccess, onLogout }) => {
  // State Variables
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState("pdf")
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [lastPrompt, setLastPrompt] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [sessionId, setSessionId] = useState(null);

  const chatEndRef = useRef(null)
  const navigate = useNavigate()

  // Navigation Handlers
  const handleLogoClick = () => navigate("/")
  const handleLoginClick = () => setShowLoginPopup(true)
  const handleClosePopup = () => setShowLoginPopup(false)

  // Dropdown Toggles
  const toggleDropdown = () => setShowDropdown((prevState) => !prevState)
  const toggleSettingsDropdown = () => setShowSettingsDropdown((prevState) => !prevState)

  // Generate Report
  const handleGenerateClick = async () => {
    if (!query.trim()) return

    // Add user message and start loading immediately
    const userMessage = { text: query, sender: "user" }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setLoading(true)
    setQuery("") // Clear input immediately

    try {
      let body
      if (messages.length > 0 && editingIndex !== null) {
        body = { user_id: user.uid, follow_up_prompt: query }
      } else {
        body = { user_id: user.uid, prompt: query }
      }
      const response = await fetch(`${API_BASE_URL}/generate_report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error(`Request failed: ${await response.text()}`)

      const result = await response.json()
      if (result.generated_report) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: result.generated_report.report, sender: "ai" }
        ])
        setLastPrompt(userMessage.text)
        setEditingIndex(null)
        setEditValue("")
      } else {
        throw new Error("Empty response from AI")
      }
    } catch (error) {
      console.error("Report generation failed:", error)
      alert("Failed to generate the report.")
    } finally {
      setLoading(false)
    }
  }

  // Enhanced Download with HTML-to-PDF conversion for perfect formatting
  const handleDownloadClick = async (format) => {
    if (messages.length === 0) return

    const recentMessage = messages[messages.length - 1]
    const reportText = recentMessage.text.trim()

    try {
      if (format === "pdf") {
        // Create a temporary div to render the markdown exactly like in chat
        const tempDiv = document.createElement("div")
        tempDiv.style.cssText = `
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
          padding: 40px;
          background: white;
          width: 800px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        `

        // Parse and render markdown to HTML with exact chat styling
        const parseMarkdownToHTML = (text) => {
          const html = text
            // Handle headings with proper styling
            .replace(
              /^# (.+)$/gm,
              '<h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 32px 0 20px 0; border-bottom: 3px solid #10a37f; padding-bottom: 12px; line-height: 1.3;">$1</h1>',
            )
            .replace(
              /^## (.+)$/gm,
              '<h2 style="font-size: 24px; font-weight: 600; color: #1f2937; margin: 28px 0 16px 0; line-height: 1.4;">$1</h2>',
            )
            .replace(
              /^### (.+)$/gm,
              '<h3 style="font-size: 20px; font-weight: 600; color: #374151; margin: 24px 0 12px 0; line-height: 1.4;">$1</h3>',
            )
            .replace(
              /^#### (.+)$/gm,
              '<h4 style="font-size: 18px; font-weight: 600; color: #4b5563; margin: 20px 0 10px 0; line-height: 1.4;">$1</h4>',
            )

            // Handle bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: 700; color: #1f2937;">$1</strong>')

            // Handle italic text
            .replace(/\*(.+?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')

            // Handle code blocks
            .replace(/```[\s\S]*?```/g, (match) => {
              const code = match.replace(/```/g, "").trim()
              return `<pre style="background-color: #1f2937; color: #f9fafb; border-radius: 12px; padding: 20px; overflow-x: auto; margin: 24px 0; font-family: Monaco, Menlo, monospace; font-size: 14px; line-height: 1.6; border: 1px solid #374151;">${code}</pre>`
            })

            // Handle inline code
            .replace(
              /`(.+?)`/g,
              '<code style="background-color: #f3f4f6; color: #dc2626; padding: 3px 8px; border-radius: 6px; font-family: Monaco, Menlo, monospace; font-size: 14px; font-weight: 500; border: 1px solid #e5e7eb;">$1</code>',
            )

            // Handle bullet lists
            .replace(
              /^- (.+)$/gm,
              '<li style="margin: 10px 0; line-height: 1.6; color: #374151; font-size: 16px; list-style-type: disc; margin-left: 20px;">$1</li>',
            )
            .replace(/(<li[^>]*>.*<\/li>)/s, '<ul style="margin: 20px 0; padding-left: 28px;">$1</ul>')

            // Handle numbered lists
            .replace(
              /^\d+\. (.+)$/gm,
              '<li style="margin: 10px 0; line-height: 1.6; color: #374151; font-size: 16px; list-style-type: decimal; margin-left: 20px;">$1</li>',
            )

            // Handle blockquotes
            .replace(
              /^> (.+)$/gm,
              '<blockquote style="border-left: 4px solid #10a37f; background-color: #f0fdf4; padding: 20px 24px; margin: 24px 0; font-style: italic; color: #166534; border-radius: 0 8px 8px 0;">$1</blockquote>',
            )

            // Handle paragraphs
            .replace(
              /^(?!<[h|u|l|b|p])(.+)$/gm,
              '<p style="margin: 16px 0; line-height: 1.7; color: #374151; font-size: 16px;">$1</p>',
            )

            // Handle line breaks
            .replace(/\n/g, "<br>")

          return html
        }

        tempDiv.innerHTML = parseMarkdownToHTML(reportText)
        document.body.appendChild(tempDiv)

        // Use html2pdf library for perfect rendering
        const opt = {
          margin: [20, 20, 20, 20],
          filename: "Security_Report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
          },
          jsPDF: {
            unit: "pt",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        }

        await html2pdf().set(opt).from(tempDiv).save()
        document.body.removeChild(tempDiv)
      } else if (format === "docx") {
        // Enhanced DOCX generation
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import("docx")

        const parseMarkdownToDocx = (text) => {
          const children = []
          const lines = text.split("\n")

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            if (line === "") {
              children.push(new Paragraph({ text: "" }))
              continue
            }

            if (line.startsWith("# ")) {
              // H1 with underline
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.substring(2),
                      bold: true,
                      size: 56, // 28px * 2
                      color: "1f2937",
                    }),
                  ],
                  spacing: { after: 400, before: 640 },
                  border: {
                    bottom: {
                      color: "10a37f",
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 6,
                    },
                  },
                }),
              )
            } else if (line.startsWith("## ")) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.substring(3),
                      bold: true,
                      size: 48, // 24px * 2
                      color: "1f2937",
                    }),
                  ],
                  spacing: { after: 320, before: 560 },
                }),
              )
            } else if (line.startsWith("### ")) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.substring(4),
                      bold: true,
                      size: 40, // 20px * 2
                      color: "374151",
                    }),
                  ],
                  spacing: { after: 240, before: 480 },
                }),
              )
            } else if (line.startsWith("#### ")) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.substring(5),
                      bold: true,
                      size: 36, // 18px * 2
                      color: "4b5563",
                    }),
                  ],
                  spacing: { after: 200, before: 400 },
                }),
              )
            } else if (line.startsWith("- ") || line.startsWith("* ")) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.substring(2),
                      size: 32, // 16px * 2
                      color: "374151",
                    }),
                  ],
                  bullet: { level: 0 },
                  spacing: { after: 200 },
                }),
              )
            } else if (/^\d+\.\s/.test(line)) {
              const text = line.replace(/^\d+\.\s/, "")
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: text,
                      size: 32, // 16px * 2
                      color: "374151",
                    }),
                  ],
                  numbering: { reference: "default-numbering", level: 0 },
                  spacing: { after: 200 },
                }),
              )
            } else if (line.startsWith("> ")) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.substring(2),
                      italics: true,
                      size: 32,
                      color: "166534",
                    }),
                  ],
                  spacing: { after: 400, before: 200 },
                  border: {
                    left: {
                      color: "10a37f",
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 8,
                    },
                  },
                }),
              )
            } else if (line.startsWith("```")) {
              const codeContent = []
              i++
              while (i < lines.length && !lines[i].trim().startsWith("```")) {
                codeContent.push(lines[i])
                i++
              }
              if (codeContent.length > 0) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: codeContent.join("\n"),
                        font: "Courier New",
                        size: 28, // 14px * 2
                        color: "f9fafb",
                      }),
                    ],
                    spacing: { after: 480, before: 200 },
                  }),
                )
              }
            } else if (line.includes("**")) {
              const parts = line.split("**")
              const textRuns = []
              for (let j = 0; j < parts.length; j++) {
                if (parts[j]) {
                  textRuns.push(
                    new TextRun({
                      text: parts[j],
                      bold: j % 2 === 1,
                      size: 32, // 16px * 2
                      color: j % 2 === 1 ? "1f2937" : "374151",
                    }),
                  )
                }
              }
              children.push(
                new Paragraph({
                  children: textRuns,
                  spacing: { after: 300 },
                }),
              )
            } else {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      size: 32, // 16px * 2
                      color: "374151",
                    }),
                  ],
                  spacing: { after: 300 },
                }),
              )
            }
          }
          return children
        }

        const doc = new Document({
          sections: [
            {
              properties: {},
              children: parseMarkdownToDocx(reportText),
            },
          ],
          numbering: {
            config: [
              {
                reference: "default-numbering",
                levels: [
                  {
                    level: 0,
                    format: "decimal",
                    text: "%1.",
                    alignment: AlignmentType.START,
                  },
                ],
              },
            ],
          },
        })

        const blob = await Packer.toBlob(doc)
        saveAs(blob, "Security_Report.docx")
      }
    } catch (error) {
      console.error("Error formatting the document:", error)
      alert("There was an error trying to format the document. Please try again.")
    }
  }

  // Handler to load a chat session
  const handleSelectChat = async (session_id) => {
    const res = await fetch(`${API_BASE_URL}/chat?session_id=${session_id}&user_id=${user.uid}`);
    const chat = await res.json();
    setMessages(chat.messages || []);
    setSessionId(session_id);
    setEditingIndex(null);
    setEditValue("");
  };

  // Handler to start a new chat
  const handleNewChat = () => {
    setMessages([]);
    setSessionId(uuidv4()); // Generate a new unique sessionId
    setEditingIndex(null);
    setEditValue("");
  };

  // When the first user message is sent in a new chat, immediately notify the sidebar
  useEffect(() => {
    if (!user?.uid || !messages.length) return;
    if (messages.length === 1 && messages[0].sender === "user" && sessionId) {
      // Notify sidebar of new chat
      if (typeof window.onNewChatMeta === "function") {
        window.onNewChatMeta({
          session_id: sessionId,
          title: messages[0].text,
          created_at: new Date().toISOString()
        });
      }
    }
  }, [messages, user, sessionId]);

  // Save chat session after every message change
  useEffect(() => {
    if (!user?.uid || !messages.length) return;
    fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.uid,
        session_id: sessionId,
        messages,
        title: messages[0]?.text || "Untitled"
      })
    });
  }, [messages, user, sessionId]);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle Enter Key Press
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleGenerateClick()
    }
  }

  const handleEditClick = (index) => {
    setEditingIndex(index)
    setEditValue(messages[index].text)
  }

  const handleEditCancel = () => {
    setEditingIndex(null)
    setEditValue("")
  }

  const handleEditSave = async () => {
    if (!editValue.trim()) return
    setLoading(true)
    try {
      const body = { user_id: user.uid, follow_up_prompt: editValue }
      const response = await fetch(`${API_BASE_URL}/generate_report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error(`Request failed: ${await response.text()}`)
      const result = await response.json()
      if (result.generated_report) {
        const newMessages = [...messages]
        // Replace the user message at editingIndex
        newMessages[editingIndex] = { text: editValue, sender: "user" }
        // Replace the AI message right after the user message
        newMessages[editingIndex + 1] = { text: result.generated_report.report, sender: "ai" }
        setMessages(newMessages)
        setEditingIndex(null)
        setEditValue("")
      } else {
        throw new Error("Empty response from AI")
      }
    } catch (error) {
      console.error("Edit resubmit failed:", error)
      alert("Failed to edit and resubmit the report.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="Activity-container">
      <div className="sidebar-container">
        <Sidebar user={user} onSelectChat={handleSelectChat} onNewChat={handleNewChat} />
      </div>

      <div className="chat-body">
        <header className="app-header">
          <div className="header-left">
            <div className="logo" onClick={handleLogoClick}>
              PSEC AI
            </div>
          </div>

          <div className="header-center">
            <button className="upload-button" onClick={user ? () => navigate("/UploadPage") : handleLoginClick}>
              Upload Files
            </button>
          </div>

          <div className="profile">
            <div className="settings-option" onClick={toggleSettingsDropdown}>
              <FaCog className="option-icon" />
              {showSettingsDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/settings")}>
                    <FaSlidersH /> General Settings
                  </button>
                  <button onClick={() => navigate("/notifications")}>
                    <FaBell /> Notifications
                  </button>
                  <button onClick={() => navigate("/privacy")}>
                    <FaLock /> Privacy
                  </button>
                </div>
              )}
            </div>
            <div className="profile-option" onClick={user ? toggleDropdown : handleLoginClick}>
              {user ? (
                <img src={user.photoURL || defaultProfileImage} alt="Profile" className="profile-img" />
              ) : (
                <FaUser className="option-icon" />
              )}
              {showDropdown && user && (
                <div className="dropdown-menu">
                  <button onClick={() => navigate("/Dashboard")}>
                    <FaTachometerAlt /> Dashboard
                  </button>
                  <button onClick={() => navigate("/Policypage")}>
                    <FaFileAlt /> Policy
                  </button>
                  <button onClick={onLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="chat-content">
          {messages.length === 0 && !loading ? (
            <div className="empty-state">
              <h2>Generate Your Security Report</h2>
              <p>Ask me anything about security assessments, vulnerability analysis, or compliance requirements.</p>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  <div className={`message-avatar ${msg.sender}`}>{msg.sender === "ai" ? "AI" : "U"}</div>

                  <div className="message-content">
                    {editingIndex === index && msg.sender === "user" ? (
                      <>
                        <textarea
                          className="edit-textarea"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          disabled={loading}
                        />
                        <div className="edit-controls">
                          <button className="cancel-btn" onClick={handleEditCancel} disabled={loading}>
                            Cancel
                          </button>
                          <button className="save-btn" onClick={handleEditSave} disabled={loading}>
                            Save
                          </button>
                        </div>
                      </>
                    ) : msg.sender === "user" ? (
                      <>
                        <div className="user-message">{msg.text}</div>
                        <FaEdit className="edit-icon" title="Edit message" onClick={() => handleEditClick(index)} />
                      </>
                    ) : (
                      <div className="ai-response">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => <h1 className="ai-h1" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="ai-h2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="ai-h3" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="ai-h4" {...props} />,
                            h5: ({ node, ...props }) => <h5 className="ai-h5" {...props} />,
                            h6: ({ node, ...props }) => <h6 className="ai-h6" {...props} />,
                            p: ({ node, ...props }) => <p className="ai-p" {...props} />,
                            strong: ({ node, ...props }) => <strong className="ai-strong" {...props} />,
                            em: ({ node, ...props }) => <em className="ai-em" {...props} />,
                            ul: ({ node, ...props }) => <ul className="ai-ul" {...props} />,
                            ol: ({ node, ...props }) => <ol className="ai-ol" {...props} />,
                            li: ({ node, ...props }) => <li className="ai-li" {...props} />,
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code className="ai-code-inline" {...props} />
                              ) : (
                                <code className="ai-code-block" {...props} />
                              ),
                            pre: ({ node, ...props }) => <pre className="ai-pre" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="ai-blockquote" {...props} />,
                            table: ({ node, ...props }) => <table className="ai-table" {...props} />,
                            th: ({ node, ...props }) => <th className="ai-th" {...props} />,
                            td: ({ node, ...props }) => <td className="ai-td" {...props} />,
                            a: ({ node, ...props }) => <a className="ai-link" {...props} />,
                            hr: ({ node, ...props }) => <hr className="ai-hr" {...props} />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message ai">
                  <div className="message-avatar ai">AI</div>
                  <div className="message-content">
                    <div className="generating-loader">
                      <div className="loader-animation">
                        <div className="loader-dots">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      </div>
                      <div className="loader-text">
                        <h3>Generating Security Report...</h3>
                        <p>Analyzing your request and preparing comprehensive insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div className="search-box">
          <textarea
            className="chat-search-input"
            placeholder="Ask anything"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={editingIndex !== null}
            rows={1}
          />
          <button
            className="AiGenerate-button"
            onClick={user ? handleGenerateClick : handleLoginClick}
            disabled={editingIndex !== null || loading || !query.trim()}
          >
            <FaPaperPlane />
          </button>
          {messages.length > 0 && !loading && (
            <>
              <select
                className="download-format-select"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
              <button className="download-button" onClick={() => handleDownloadClick(downloadFormat)}>
                <FaDownload />
              </button>
            </>
          )}
        </div>
      </div>

      {showLoginPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <Login handleClose={handleClosePopup} onLoginSuccess={onLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityPage
