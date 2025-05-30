import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className, hoverEffect = true, onClick, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-background/60 p-6 shadow-sm backdrop-blur-md",
          hoverEffect && "transition-all hover:shadow-md hover:bg-background/80",
          onClick ? "cursor-pointer" : "",
          className
        )}
        whileHover={hoverEffect ? { scale: 1.02 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={onClick}  // Explicitly handle the onClick event
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    )
  }
)

GlassPanel.displayName = "GlassPanel"
