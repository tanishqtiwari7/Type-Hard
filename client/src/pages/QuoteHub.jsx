import React, { useEffect, useState } from "react";
import { QuoteService } from "../services/quote.service";
import useStore from "../store/useStore";
import {
  FaPenNib,
  FaThumbsUp,
  FaCheckCircle,
  FaBookOpen,
} from "react-icons/fa";

const QuoteHub = () => {
  const { isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState("pending"); // pending, submit, library
  const [pendingQuotes, setPendingQuotes] = useState([]);
  const [libraryQuotes, setLibraryQuotes] = useState([]);

  // Submission Form
  const [quoteContent, setQuoteContent] = useState("");
  const [quoteSource, setQuoteSource] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === "pending") loadPending();
    if (activeTab === "library") loadLibrary();
  }, [activeTab]);

  const loadPending = async () => {
    try {
      const res = await QuoteService.getPending();
      if (res.data.success) setPendingQuotes(res.data.quotes);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLibrary = async () => {
    try {
      const res = await QuoteService.getLibrary();
      if (res.data.success) setLibraryQuotes(res.data.quotes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please Login to submit quotes!");

    setSubmitting(true);
    try {
      const res = await QuoteService.submit(quoteContent, quoteSource);
      if (res.data.success) {
        alert("Quote Submitted for Review!");
        setQuoteContent("");
        setQuoteSource("");
        setActiveTab("pending");
      }
    } catch (err) {
      alert("Submission Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id) => {
    if (!isAuthenticated) return alert("Please Login to vote!");
    try {
      const res = await QuoteService.vote(id);
      if (res.data.success) {
        setPendingQuotes(
          pendingQuotes.map((q) =>
            q.id === id ? { ...q, votes: q.votes + 1 } : q
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 min-h-[80vh] px-4">
      <h1 className="text-4xl font-bold text-center text-textWhite font-mono mb-8">
        <span className="text-cskYellow">
          <FaBookOpen className="inline mb-2" />
        </span>{" "}
        Quote Hub
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10">
        <TabButton
          id="pending"
          label="Vote Pending"
          icon={<FaThumbsUp />}
          active={activeTab}
          set={setActiveTab}
        />
        <TabButton
          id="submit"
          label="Submit New"
          icon={<FaPenNib />}
          active={activeTab}
          set={setActiveTab}
        />
        <TabButton
          id="library"
          label="Library"
          icon={<FaCheckCircle />}
          active={activeTab}
          set={setActiveTab}
        />
      </div>

      {/* Content Area */}
      <div className="bg-[#2c2e31] rounded-xl border border-white/5 p-6 min-h-[400px]">
        {activeTab === "pending" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-textGray mb-4">
              Community Submissions
            </h2>
            {pendingQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-halkaBlack p-4 rounded border border-white/5 flex gap-4"
              >
                <div className="flex-1">
                  <p className="text-textWhite font-mono text-lg mb-2">
                    "{quote.content}"
                  </p>
                  <div className="text-xs text-textGray opacity-50">
                    Submitted by: {quote.username}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-white/10 pl-4">
                  <button
                    onClick={() => handleVote(quote.id)}
                    className="text-textGray hover:text-cskYellow transition-colors p-2"
                  >
                    <FaThumbsUp size={20} />
                  </button>
                  <span className="text-cskYellow font-bold">
                    {quote.votes}
                  </span>
                </div>
              </div>
            ))}
            {pendingQuotes.length === 0 && (
              <div className="text-center text-textGray opacity-50 pt-20">
                No pending quotes. Be the first to submit!
              </div>
            )}
          </div>
        )}

        {activeTab === "submit" && (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto space-y-6 pt-10"
          >
            <div>
              <label className="block text-textGray text-sm mb-2">
                Quote Content
              </label>
              <textarea
                className="w-full bg-halkaBlack text-textWhite p-4 rounded border border-white/10 focus:border-cskYellow outline-none min-h-[150px] font-mono"
                placeholder="Type a meaningful quote here..."
                value={quoteContent}
                onChange={(e) => setQuoteContent(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-textGray text-sm mb-2">
                Source (Optional)
              </label>
              <input
                className="w-full bg-halkaBlack text-textWhite p-3 rounded border border-white/10 focus:border-cskYellow outline-none"
                placeholder="Book, Author, or Movie"
                value={quoteSource}
                onChange={(e) => setQuoteSource(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cskYellow text-halkaBlack font-bold py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Quote"}
            </button>
          </form>
        )}

        {activeTab === "library" && (
          <div className="grid grid-cols-1 gap-4">
            {libraryQuotes.map((q) => (
              <div
                key={q.id}
                className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <p className="text-textWhite font-mono mb-1">{q.content}</p>
                <div className="text-xs text-textGray flex justify-between">
                  <span>— {q.author || "Unknown"}</span>
                  <span>{q.length} chars</span>
                </div>
              </div>
            ))}
            {libraryQuotes.length === 0 && (
              <div className="text-center text-textGray opacity-50 pt-20">
                Library is empty.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ id, label, icon, active, set }) => (
  <button
    onClick={() => set(id)}
    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all font-bold ${
      active === id
        ? "bg-cskYellow text-halkaBlack"
        : "text-textGray hover:text-textWhite bg-white/5"
    }`}
  >
    {icon} {label}
  </button>
);

export default QuoteHub;
