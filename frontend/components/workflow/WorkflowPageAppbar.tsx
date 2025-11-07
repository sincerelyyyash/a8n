"use client"

import { useState, useEffect } from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

interface WorkflowPageAppbarProps {
  workflowInfo?: { name?: string; title?: string; id?: number };
}

export default function WorkflowPageAppbar({ workflowInfo }: WorkflowPageAppbarProps) {
  // Component to display workflow information in the appbar
  const { state } = useSidebar()
  const pathname = usePathname()
  const isSidebarCollapsed = state === "collapsed"
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const shouldShowAutomation = isExpanded || hasScrolled
  
  // Only show buttons on workflow builder page (not on /workflows overview page)
  const isWorkflowBuilderPage = pathname?.startsWith("/workflows/") && pathname !== "/workflows"
  
  return (
    <div className="flex items-center justify-between bg-sidebar border border-sidebar-border rounded-lg mt-2 mb-2 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 mx-2">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <SidebarTrigger />
        {isSidebarCollapsed && (
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
                  className="text-xs sm:text-sm font-medium tracking-wide text-sidebar-foreground"
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
                  className="text-xs sm:text-sm font-medium tracking-wide text-sidebar-foreground"
                >
                  a8n
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="h-4 w-px bg-sidebar-border hidden sm:block" />
        {workflowInfo?.title || workflowInfo?.name ? (
          <div className="flex items-center gap-2">
            <div className="text-xs sm:text-sm font-medium text-sidebar-foreground">
              {workflowInfo.title || workflowInfo.name}
            </div>
            {workflowInfo.id && (
              <div className="text-xs text-sidebar-foreground/60">
                (ID: {workflowInfo.id})
              </div>
            )}
          </div>
        ) : workflowInfo?.id ? (
          <div className="text-xs sm:text-sm font-medium text-sidebar-foreground">
            Workflow ID: {workflowInfo.id}
          </div>
        ) : (
          <div className="text-xs text-sidebar-foreground/70">Workflow</div>
        )}
      </div>
      {isWorkflowBuilderPage && (
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-md border border-sidebar-border text-sidebar-foreground/80 hover:text-sidebar-foreground hover:border-sidebar-foreground/60 transition-colors"
            onClick={() => {
              const ev = new CustomEvent("toggle-action-toolbar");
              window.dispatchEvent(ev);
            }}
            aria-label="Toggle action toolbar"
          >
            <Plus className="size-3 sm:size-4" />
          </button>
          <button className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-md border border-sidebar-border text-sidebar-foreground/80 hover:text-sidebar-foreground hover:border-sidebar-foreground/60 transition-colors" onClick={() => {
            const ev = new CustomEvent("open-save-workflow-dialog");
            window.dispatchEvent(ev);
          }}>
            Save
          </button>
        </div>
      )}
    </div>
  )
}
