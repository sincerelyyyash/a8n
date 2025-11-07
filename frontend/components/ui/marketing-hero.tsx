"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hero from "@/components/ui/hero";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/components/providers/auth-provider";
import { Github } from "lucide-react";

type MarketingHeroProps = {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

const MarketingHero: React.FC<MarketingHeroProps> = ({
  onPrimaryClick,
  onSecondaryClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldShowAutomation = isExpanded || hasScrolled;

  const handleGetStarted = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else if (user) {
      router.push("/workflows");
    } else {
      router.push("/signup");
    }
  };

  return (
    <Hero>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-sidebar/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            a8n
          </Link>
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-9"
                  >
                    <Link href="/workflows">Workflows</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-9"
                    >
                      <Link href="/signin">Sign in</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="h-9"
                    >
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Minimal node shapes */}
        {[
          { x: "15%", y: "30%" },
          { x: "85%", y: "25%" },
          { x: "20%", y: "70%" },
          { x: "80%", y: "75%" },
        ].map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            className="absolute rounded-lg border border-border/20"
            style={{
              left: node.x,
              top: node.y,
              width: "50px",
              height: "35px",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Simple connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 15 30 Q 50 27.5 85 25"
            stroke="currentColor"
            strokeWidth="0.2"
            fill="none"
            strokeDasharray="1 2"
            className="text-border"
          />
          <path
            d="M 20 70 Q 50 72.5 80 75"
            stroke="currentColor"
            strokeWidth="0.2"
            fill="none"
            strokeDasharray="1 2"
            className="text-border"
          />
        </svg>
      </div>

      {/* Hero Content */}
      <section className="flex min-h-screen items-center justify-center px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-dm-mono)' }}>
          {/* Animated Brand Name - Smaller */}
          <div
            className="relative inline-block cursor-default"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
          >
            <AnimatePresence mode="wait">
              {shouldShowAutomation ? (
                <motion.div
                  key="automation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
                >
                  automation
                </motion.div>
              ) : (
                <motion.div
                  key="a8n"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
                >
                  a8n
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Hook/Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tight text-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Automate your workflows, visually
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Design, connect, and run tasks in minutes. No code required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <Button
              onClick={handleGetStarted}
              className="px-8 h-11 text-base"
              size="lg"
            >
              {user ? "Go to workflows" : "Get started"}
            </Button>
            {!user && (
              <Button
                onClick={() => {
                  if (onSecondaryClick) {
                    onSecondaryClick();
                  } else {
                    window.open('https://github.com/sincerelyyyash/a8n', '_blank', 'noopener,noreferrer');
                  }
                }}
                variant="outline"
                className="px-8 h-11 text-base"
                size="lg"
              >
                <Github className="size-4 mr-2" />
                Star on GitHub
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </Hero>
  );
};

export default MarketingHero;


