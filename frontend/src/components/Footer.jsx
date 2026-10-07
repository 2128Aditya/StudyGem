import React, { useState } from "react";
import {
  ArrowUpRight,
  Heart,
  Mail,
  Phone,
  X,
} from "lucide-react";
import logo from "../assets/logo.png";

const Footer = ({
  onHome,
  onMockTests,
  onAI,
  onRoadmaps,
  onPYQ,
  onNotes,
  onLeaderboard,
}) => {
  const [showContact, setShowContact] = useState(false);

  const currentYear = new Date().getFullYear();

  const navigate = (callback) => {
    if (callback) {
      callback();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <footer className="relative overflow-hidden bg-[#0b0714] text-white">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-7 pt-14 sm:px-8 lg:px-10">
          {/* Main Footer */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <img
                  src={logo}
                  alt="StudyGem"
                  className="h-12 w-12 rounded-xl object-contain"
                />

                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Study<span className="text-purple-400">Gem</span>
                  </h2>

                  <p className="text-xs text-white/40">
                    Learn. Practice. Grow.
                  </p>
                </div>
              </div>

              <p className="max-w-sm text-sm leading-6 text-white/55">
  StudyGem is an online study platform for students with mock tests,
  previous year questions, current affairs, study roadmaps, and AI
  learning tools to help you prepare smarter and learn with confidence.
</p>

              {/* Social */}
              <div className="mt-6 flex items-center gap-3">
                {/* GitHub */}
                <a
                  href="https://github.com/2128Aditya"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                >
                  <span className="text-xs font-semibold">GH</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                >
                  <span className="text-sm font-bold">in</span>
                </a>

                {/* Contact */}
                <button
                  type="button"
                  onClick={() => setShowContact(true)}
                  aria-label="Contact Us"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                >
                  <Mail size={18} strokeWidth={1.7} />
                </button>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="mb-5 text-sm font-medium text-white">
                Platform
              </h3>

              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onHome)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Home
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onMockTests)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Mock Tests
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onPYQ)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    PYQ
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onRoadmaps)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Roadmaps
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-5 text-sm font-medium text-white">
                Resources
              </h3>

              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onNotes)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Notes
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onNotes)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Current Affairs
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onLeaderboard)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Leaderboard
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate(onAI)}
                    className="group flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
                  >
                    AI Assistant
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-5 text-sm font-medium text-white">
                Support
              </h3>

              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => setShowContact(true)}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Contact Us
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Terms & Conditions
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => setShowContact(true)}
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Help Center
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Bottom */}
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-white/35">
              © {currentYear} StudyGem. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-xs text-white/40">
              Made with
              <Heart
                size={13}
                className="fill-purple-500 text-purple-500"
              />
              by
              <a
                href="https://github.com/2128Aditya"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                Aditya singh
              </a>

              <span className="text-white/20">·</span>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple-400 transition-colors hover:text-purple-300"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContact && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setShowContact(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#110b1d] p-7 shadow-2xl shadow-purple-950/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl" />

            {/* Close */}
            <button
              type="button"
              onClick={() => setShowContact(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative">
              {/* Logo */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/10">
                <img
                  src={logo}
                  alt="StudyGem"
                  className="h-full w-full object-contain"
                />
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-purple-400">
                Get in touch
              </p>

              <h2 className="text-2xl font-semibold text-white">
                Contact StudyGem
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                Have a question, suggestion, or need help? Feel free to
                get in touch.
              </p>

              {/* Name */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs text-white/35">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Aditya singh 
                </p>
              </div>

              {/* Phone */}
              <div className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-xs text-white/35">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    +91 8052269388
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="mt-3 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Mail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-white/35">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-white">
                    aadi21082003@gmail.com 
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <a
                  href="mailto:contact@studygem.com"
                  className="flex flex-1 items-center justify-center rounded-xl bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-purple-500"
                >
                  Email Me
                </a>

                <button
                  type="button"
                  onClick={() => setShowContact(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;