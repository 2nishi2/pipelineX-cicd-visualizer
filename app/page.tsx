"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  
  Play,
  RotateCcw,
  Loader2,
  Code2,
  Package,
  TestTube2,
  Rocket,
  Terminal,
  AlertTriangle,
  RefreshCw,
  GitMerge,
  Zap,
  Github,
  ChevronRight,
} from "lucide-react"

// --- Custom UI Components (React + Tailwind) ---

const Button = ({ children, variant = "primary", size = "default", className = "", ...props }: any) => {
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
    outline:
      "border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900",
  }
  const sizes: any = {
    default: "px-6 py-2.5",
    icon: "p-2",
  }
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Badge = ({ children, variant = "default", className = "" }: any) => {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        variant === "outline"
          ? "border-neutral-200 dark:border-neutral-800 text-neutral-500"
          : "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400"
      } ${className}`}
    >
      {children}
    </span>
  )
}

const Card = ({ children, className = "", id = "" }: any) => (
  <div
    id={id}
    className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden ${className}`}
  >
    {children}
  </div>
)

// --- Pipeline Logic & Constants ---

const STAGES = [
  {
    id: "source",
    name: "Code Commit",
    icon: <Code2 className="w-5 h-5" />,
    description: "Fetching latest changes from repository",
    logs: [
      "Cloning repository git@github.com:pipelinex/app.git...",
      "Checking out branch main...",
      "Verified commit hash: 7f3a1b2...",
      "Source code pull complete.",
    ],
  },
  {
    id: "build",
    name: "Build",
    icon: <Package className="w-5 h-5" />,
    description: "Compiling assets and dependencies",
    logs: [
      "Installing dependencies using pnpm...",
      "Running build script: pnpm build",
      "Optimizing images and assets...",
      "Compiled successfully in 12.4s",
    ],
  },
  {
    id: "test",
    name: "Test",
    icon: <TestTube2 className="w-5 h-5" />,
    description: "Running unit and integration tests",
    logs: [
      "Starting test suite...",
      "Running unit tests...",
      "Running integration tests...",
      "Coverage: 94.2%",
      "All tests passed.",
    ],
  },
  {
    id: "deploy",
    name: "Deploy",
    icon: <Rocket className="w-5 h-5" />,
    description: "Deploying to production environment",
    logs: [
      "Uploading artifacts to edge...",
      "Initializing functions...",
      "Updating DNS records...",
      "Deployment live at: pipelinex.app",
    ],
  },
]

function PipelineVisualizer() {
  const [activeStageIndex, setActiveStageIndex] = useState(-1)
  const [statuses, setStatuses] = useState<any>({
    source: "idle",
    build: "idle",
    test: "idle",
    deploy: "idle",
  })
  const [logs, setLogs] = useState<string[]>([])
  const [shouldFail, setShouldFail] = useState(false)
  const [showFixProcess, setShowFixProcess] = useState(false)
  const logEndRef = useRef<HTMLDivElement>(null)
  const failureRef = useRef<HTMLDivElement>(null)

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  const runPipeline = async () => {
    resetPipeline()
    setActiveStageIndex(0)
    addLog("Starting CI/CD Pipeline Execution...")

    for (let i = 0; i < STAGES.length; i++) {
      const stage = STAGES[i]
      setActiveStageIndex(i)
      setStatuses((prev: any) => ({ ...prev, [stage.id]: "running" }))
      addLog(`Entering stage: ${stage.name}`)

      for (const logLine of stage.logs) {
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 800))
        addLog(logLine)

        if (stage.id === "test" && shouldFail) {
          await new Promise((r) => setTimeout(r, 1000))
          addLog("ERROR: Test suite failed with exit code 1")
          addLog("FAIL: Integration test 'User Checkout Flow' timed out")
          setStatuses((prev: any) => ({ ...prev, [stage.id]: "failed" }))
          addLog("Pipeline terminated due to failure.")
          setShowFixProcess(true)
          setTimeout(() => {
            failureRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }, 100)
          return
        }
      }
      setStatuses((prev: any) => ({ ...prev, [stage.id]: "success" }))
      addLog(`Stage ${stage.name} completed successfully.`)
    }
    addLog("Pipeline finished successfully. Site is live!")
    setActiveStageIndex(-1)
  }

  const resetPipeline = () => {
    setActiveStageIndex(-1)
    setStatuses({ source: "idle", build: "idle", test: "idle", deploy: "idle" })
    setLogs([])
    setShowFixProcess(false)
  }

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  return (
    <div className="space-y-12">
      {/* Simulation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">Execution Engine</h3>
          <p className="text-xs text-neutral-500">Simulate automated delivery flows with failure injection</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Inject Failure?</span>
            <button
              onClick={() => {
                setShouldFail(!shouldFail)
                resetPipeline()
              }}
              className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${shouldFail ? "bg-red-500" : "bg-neutral-300 dark:bg-neutral-600"}`}
            >
              <div
                className={`absolute top-1 left-1 w-2 h-2 rounded-full bg-white transition-transform duration-200 ${shouldFail && "translate-x-4"}`}
              />
            </button>
          </div>
          <Button onClick={runPipeline} disabled={activeStageIndex !== -1}>
            {activeStageIndex !== -1 ? (
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
            ) : (
              <Play className="w-3 h-3 mr-2 fill-current" />
            )}
            {activeStageIndex !== -1 ? "Processing..." : "Start Execution"}
          </Button>
          <Button variant="outline" size="icon" onClick={resetPipeline}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent -translate-y-1/2 z-0 hidden lg:block" />
        {STAGES.map((stage, idx) => {
          const status = statuses[stage.id]
          const isActive = activeStageIndex === idx
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={`p-5 h-full transition-all duration-300 border-2 relative ${isActive ? "border-blue-600 ring-4 ring-blue-600/10" : "border-neutral-200 dark:border-neutral-800"} ${status === "success" && "border-green-500/50 bg-green-500/5"} ${status === "failed" && "border-red-500/50 bg-red-500/5"}`}
              >
                {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${status === "success" ? "text-green-500" : status === "failed" ? "text-red-500" : isActive ? "text-blue-600" : ""}`}
                  >
                    {stage.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className={`${status === "running" && "animate-pulse border-blue-600 text-blue-600"} ${status === "success" && "border-green-500 text-green-500"} ${status === "failed" && "border-red-500 text-red-500"}`}
                  >
                    {status}
                  </Badge>
                </div>
                <h4 className="font-bold text-lg mb-1">{stage.name}</h4>
                <p className="text-sm text-neutral-500 leading-relaxed">{stage.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Failure Handling Process */}
      <AnimatePresence>
        {showFixProcess && (
          <motion.div
            ref={failureRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card id="failure-handling" className="p-8 border-red-500/30 bg-red-500/5 space-y-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Pipeline Failure: Safe Fix Process</h3>
              </div>
              <p className="text-neutral-500">
                When a pipeline fails, the system halts to prevent broken code from reaching users.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "1. Debug", desc: "Identify the failure source in the logs.", icon: <Terminal /> },
                  { title: "2. Fix", desc: "Correct the code and push changes.", icon: <Code2 /> },
                  { title: "3. Verify", desc: "The pipeline restarts to verify the fix.", icon: <RefreshCw /> },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                      <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-blue-600">
                        {item.icon}
                      </div>
                      {item.title}
                    </div>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShouldFail(false)
                    runPipeline()
                  }}
                >
                  Apply Fix & Re-run
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Console Log */}
      <div className="rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs font-mono text-neutral-400">pipeline-execution.log</span>
        </div>
        <div className="p-6 h-[300px] overflow-y-auto font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
          {logs.length === 0 ? (
            <div className="text-neutral-500 italic">Waiting for execution...</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes("ERROR") ? "text-red-400" : log.includes("success") ? "text-green-400" : "text-white/80"
                }
              >
                <span className="text-white/30 mr-2">$</span>
                {log}
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  )
}

// --- Main App Component ---

export default function Page() {
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-blue-600/20">
      {/* Sticky Header */}
      <header className="fixed top-0 w-full z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <GitMerge className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight uppercase">PipelineX</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {["Intro", "Stages", "Simulation", "Tools"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-blue-600 transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Github className="w-5 h-5" />
            </Button>
            <Button className="hidden sm:inline-flex">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 container mx-auto px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl space-y-8 relative">
          <Badge>Version 2.0 Launch</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
            The Engine for <span className="text-blue-600">Continuous Delivery</span> at Scale.
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl leading-relaxed">
            A visual journey through continuous integration and continuous deployment. Automate your workflow, minimize
            human error, and ship faster with PipelineX.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="px-8 py-4">Start Visualizer</Button>
            <Button variant="outline" className="px-8 py-4 bg-transparent">
              View Docs
            </Button>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section id="intro" className="py-20 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">The Backbone of Modern Engineering</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Continuous Integration",
                  icon: <GitMerge className="text-blue-500" />,
                  desc: "Automate code merging and testing to catch bugs instantly.",
                },
                {
                  title: "Continuous Delivery",
                  icon: <Zap className="text-yellow-500" />,
                  desc: "Ensure your application is always ready for a production release.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-950 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative">
            <div className="space-y-6">
              <div className="flex justify-between items-center px-4">
                {["Code", "Build", "Test", "Ship"].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-md">
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-neutral-500">{s}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-600 uppercase">System Status: Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizer Section */}
      <section
        id="simulation"
        className="py-20 container mx-auto px-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-[40px] mb-20 border border-neutral-200 dark:border-neutral-800"
      >
        <div className="max-w-3xl mb-16">
          <Badge variant="outline" className="mb-4">
            Interactive Lab
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Pipeline Simulator</h2>
          <p className="text-lg text-neutral-500 leading-relaxed">
            Experience the automated path from a code commit to a production server. Experiment with failures to
            understand the safety nets in place.
          </p>
        </div>
        <PipelineVisualizer />
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale">
            <GitMerge className="w-5 h-5 text-blue-600" />
            <span className="font-bold tracking-tight uppercase">PipelineX</span>
          </div>
          <p className="text-xs text-neutral-500">© 2025 PipelineX Engineering. All rights reserved.</p>
          <div className="flex gap-6">
            {["Twitter", "GitHub", "Docs", "Status"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs font-medium text-neutral-500 hover:text-blue-600 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
