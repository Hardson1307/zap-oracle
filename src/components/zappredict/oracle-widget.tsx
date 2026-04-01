"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles, Send, Zap } from "lucide-react";

export function OracleWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "oracle" | "user"; text: string }[]>([
    { from: "oracle", text: "Greetings, seeker. I am The Oracle of Zap-Oracle. Ask me anything about the markets, and I shall peer into the blockchain beyond... 🔮" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [orbPhase, setOrbPhase] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbPhase((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Hide pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false);
  }, [isOpen]);

  // Floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 200;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 320,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.3,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        hue: Math.random() * 40 + 10, // red-orange range
      });
    }

    let animFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, 320, 200);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += (Math.random() - 0.5) * 0.02;
        p.alpha = Math.max(0.05, Math.min(0.7, p.alpha));
        if (p.x < 0) p.x = 320;
        if (p.x > 320) p.x = 0;
        if (p.y < 0) p.y = 200;
        if (p.y > 200) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.alpha * 0.15})`;
        ctx.fill();
      });
      animFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animFrame);
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput("");
    const updatedMessages = [...messages, { from: "user" as const, text: userMsg }];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "oracle", text: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { from: "oracle", text: "The mystical connection falters... The Starknet nodes must be restless. Try again, seeker. 🔮" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {showPulse && !isOpen && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/30"
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
              />
            </>
          )}
        </button>
      </motion.div>

      {/* Oracle Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]"
          >
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#100a0c] shadow-2xl shadow-black/30 dark:shadow-red-500/10 overflow-hidden flex flex-col max-h-[75vh]">
              {/* Oracle Character Header */}
              <div className="relative overflow-hidden bg-gradient-to-b from-[#1a0a0c] to-[#0a0508] dark:from-[#1a0a0c] dark:to-[#0a0508] p-6">
                {/* Particle canvas background */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ opacity: 0.6 }}
                />

                {/* Glow effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-red-500/20 blur-[60px]" />
                <div className="absolute top-1/3 left-1/3 w-24 h-24 rounded-full bg-orange-500/15 blur-[40px]" />

                {/* 3D Oracle Character */}
                <div className="relative z-10 flex flex-col items-center">
                  {/* Outer rotating ring */}
                  <div
                    className="relative w-28 h-28 mb-3"
                    style={{
                      perspective: "600px",
                    }}
                  >
                    {/* Orbit ring 1 */}
                    <motion.div
                      className="absolute inset-0 rounded-full border border-red-500/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 shadow-lg shadow-red-400/50" />
                    </motion.div>

                    {/* Orbit ring 2 */}
                    <motion.div
                      className="absolute inset-2 rounded-full border border-orange-500/25"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50" />
                    </motion.div>

                    {/* Orbit ring 3 - tilted */}
                    <motion.div
                      className="absolute inset-1 rounded-full border border-red-400/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateX(60deg) rotateZ(${orbPhase}deg)`,
                      }}
                    >
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-300" />
                    </motion.div>

                    {/* Main Crystal Orb */}
                    <div className="absolute inset-4 flex items-center justify-center">
                      <motion.div
                        className="relative w-20 h-20 rounded-full"
                        animate={{
                          y: [0, -4, 0],
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          perspective: "500px",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Orb base */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "radial-gradient(circle at 35% 35%, rgba(255,180,120,0.9) 0%, rgba(239,68,68,0.7) 40%, rgba(220,38,38,0.5) 70%, rgba(127,29,29,0.8) 100%)",
                            boxShadow: `
                              0 0 30px rgba(239,68,68,0.5),
                              0 0 60px rgba(239,68,68,0.3),
                              0 0 100px rgba(239,68,68,0.15),
                              inset 0 0 20px rgba(255,255,255,0.15),
                              inset -5px -5px 15px rgba(0,0,0,0.3)
                            `,
                          }}
                        />

                        {/* Inner glow */}
                        <div
                          className="absolute inset-2 rounded-full"
                          style={{
                            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                          }}
                        />

                        {/* Specular highlight */}
                        <motion.div
                          className="absolute top-2 left-3 w-5 h-3 rounded-full"
                          style={{
                            background: "radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 100%)",
                            filter: "blur(1px)",
                          }}
                          animate={{ opacity: [0.6, 0.9, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Inner eye/mystical symbol */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="text-white/80"
                            style={{ filter: "drop-shadow(0 0 8px rgba(255,200,150,0.8))" }}
                          >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
                              <circle cx="12" cy="12" r="1" fill="currentColor" />
                            </svg>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <h3 className="text-white font-bold text-lg tracking-wide" style={{ letterSpacing: "0.05em" }}>
                      THE ORACLE
                    </h3>
                    <p className="text-red-400/70 text-xs mt-0.5 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Mystical Market Guide
                      <Sparkles className="w-3 h-3" />
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Divider glow line */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[350px] scrollbar-none">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-red-500/15 text-red-100 dark:text-red-200 rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200/50 dark:border-gray-700/50"
                      }`}
                    >
                      {msg.from === "oracle" && (
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Oracle</span>
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Zap className="w-3 h-3 text-red-400" />
                          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Oracle</span>
                        </div>
                        <div className="flex gap-1 ml-4">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-red-400"
                              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0508]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask the Oracle..."
                    className="flex-1 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-red-500/50 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
