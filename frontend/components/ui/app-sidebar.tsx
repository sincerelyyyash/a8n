"use client"

import { Home, Plus, User, Boxes, Variable, BarChart2, HelpCircle, BellDot, Database, LogOut, MoreVertical } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient, type ApiResponse } from "@/lib/axios"
import { toast } from "sonner"
import * as Dialog from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { motion, AnimatePresence } from "motion/react"
import { getErrorMessage } from "@/lib/error-messages"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Primary Menu items.
const primaryItems = [
  { title: "Overview", url: "/workflows", icon: Home },
]

type Workflow = {
  id: number;
  name: string;
  title: string;
  enabled: boolean;
};

// Secondary Menu items (lower section)
const secondaryItems = [
  { title: "Admin Panel", url: "#", icon: Database },
  { title: "Templates", url: "#", icon: Boxes },
  { title: "Variables", url: "#", icon: Variable },
  { title: "Insights", url: "#", icon: BarChart2 },
  { title: "Help", url: "#", icon: HelpCircle },
  { title: "What’s New", url: "#", icon: BellDot },
]

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState("")
  const [workflowTitle, setWorkflowTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [workflowsLoading, setWorkflowsLoading] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
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

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User"
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) return user.firstName
    if (user.lastName) return user.lastName
    return user.email?.split("@")[0] || "User"
  }

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "U"
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user.firstName) return user.firstName[0].toUpperCase()
    if (user.lastName) return user.lastName[0].toUpperCase()
    if (user.email) {
      const emailPart = user.email.split("@")[0]
      return emailPart.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  // Fetch workflows
  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user?.id) {
        setWorkflows([])
        return
      }
      try {
        setWorkflowsLoading(true)
        const res = await apiClient.get<ApiResponse<Workflow[]>>("/api/v1/workflow/all")
        const data = (res.data?.data ?? []) as Workflow[]
        setWorkflows(Array.isArray(data) ? data : [])
      } catch (err) {
        setWorkflows([])
      } finally {
        setWorkflowsLoading(false)
      }
    }
    void fetchWorkflows()
  }, [user?.id])

  // Refresh workflows after creating a new one
  const refreshWorkflows = async () => {
    if (!user?.id) return
    try {
      const res = await apiClient.get<ApiResponse<Workflow[]>>("/api/v1/workflow/all")
      const data = (res.data?.data ?? []) as Workflow[]
      setWorkflows(Array.isArray(data) ? data : [])
    } catch (err) {
      // Silent fail
    }
  }

  // Check if a workflow is currently selected
  const isWorkflowSelected = (workflowId: number) => {
    return pathname === `/workflows/${workflowId}`
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Logged out successfully")
      router.push("/signin")
    } catch (error) {
      toast.error("Failed to logout")
    } finally {
      setIsUserMenuOpen(false)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleCreateWorkflow = async () => {
    if (!workflowName.trim() || !workflowTitle.trim()) {
      toast.error("Please fill in both name and title")
      return
    }

    setIsCreating(true)
    try {
      const response = await apiClient.post("/api/v1/workflow/create", {
        name: workflowName.trim(),
        title: workflowTitle.trim(),
        enabled: false,
        nodes: [],
        connections: []
      })

      if (response.data?.workflow_id) {
        toast.success("Workflow created successfully!")
        setIsDialogOpen(false)
        setWorkflowName("")
        setWorkflowTitle("")
        // Refresh workflows list
        await refreshWorkflows()
        // Navigate to the new workflow
        router.push(`/workflows/${response.data.workflow_id}`)
      }
    } catch (error: any) {
      console.error("Error creating workflow:", error)
      toast.error(getErrorMessage(error))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Sidebar className="bg-sidebar border border-sidebar-border rounded-lg h-[calc(100vh-1rem)] overflow-hidden mt-2 ml-2 mr-2">
      <SidebarContent className="px-1 pb-2 bg-sidebar flex h-full flex-col overflow-hidden">
        {/* Header */}
        <SidebarHeader className="flex items-center justify-between p-3">
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
                  className="text-foreground font-medium tracking-wide"
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
                  className="text-foreground font-medium tracking-wide"
                >
                  a8n
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* <button className="size-8 grid place-items-center rounded-md border border-border/60 text-foreground/80 hover:text-foreground hover:border-foreground/50 transition-colors">
            <Plus className="size-4" />
          </button> */}
        </SidebarHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Primary group */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {primaryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      size="lg"
                      isActive={pathname === item.url}
                    >
                      <a href={item.url} onClick={(e) => {
                        e.preventDefault()
                        router.push(item.url)
                      }}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />
          {/* Workflows Section */}
          <SidebarGroup>
            <SidebarGroupContent>
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="mt-2 w-full inline-flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm text-foreground/90 hover:text-foreground hover:border-foreground/60 transition-colors"
              >
                <Plus className="size-4" />
                <span>Add workflow</span>
              </button>
              
              <SidebarSeparator className="my-2" />
              
              {/* Workflows List */}
              <SidebarGroupLabel className="text-muted-foreground">Workflows</SidebarGroupLabel>
              <div className="mt-2 space-y-1">
                {workflowsLoading ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">Loading...</div>
                ) : workflows.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">No workflows yet</div>
                ) : (
                  workflows.map((workflow) => (
                    <button
                      key={workflow.id}
                      onClick={() => router.push(`/workflows/${workflow.id}`)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        isWorkflowSelected(workflow.id)
                          ? "border-l-2 border-primary text-foreground bg-accent/50"
                          : "text-foreground/80 hover:text-foreground hover:bg-accent border-l-2 border-transparent"
                      }`}
                    >
                      <span className="truncate">{workflow.title || workflow.name}</span>
                    </button>
                  ))
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        {/* Footer user pill */}
        <SidebarFooter className="mt-auto">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm text-foreground/90 hover:text-foreground hover:border-foreground/60 transition-colors"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <span className="inline-flex items-center gap-2">
                <span className="size-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 grid place-items-center text-[10px] text-white font-medium">
                  {getUserInitials()}
                </span>
                <span>{getUserDisplayName()}</span>
              </span>
              <MoreVertical className="size-4 text-muted-foreground" />
            </button>
            
            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors rounded-md"
                  aria-label="Logout"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </SidebarFooter>
      </SidebarContent>

      {/* Create Workflow Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-lg font-semibold mb-4">Create New Workflow</Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="workflow-name" className="block text-sm font-medium mb-2">
                  Workflow Name
                </label>
                <Input
                  id="workflow-name"
                  type="text"
                  placeholder="Enter workflow name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="workflow-title" className="block text-sm font-medium mb-2">
                  Workflow Title
                </label>
                <Input
                  id="workflow-title"
                  type="text"
                  placeholder="Enter workflow title"
                  value={workflowTitle}
                  onChange={(e) => setWorkflowTitle(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline" disabled={isCreating}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button 
                onClick={handleCreateWorkflow} 
                disabled={isCreating || !workflowName.trim() || !workflowTitle.trim()}
              >
                {isCreating ? "Creating..." : "Create Workflow"}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Sidebar>
  )
}
