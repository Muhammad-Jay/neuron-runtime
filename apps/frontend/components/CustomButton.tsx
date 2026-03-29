"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant =
    | "primary"
    | "ghost"
    | "outline"
    | "secondary"

interface AppButtonProps {
    label?: string
    icon?: ReactNode
    iconPosition?: "left" | "right"

    loading?: boolean
    showIcon?: boolean
    showLabel?: boolean

    disabled?: boolean

    variant?: ButtonVariant
    size?: "default" | "sm" | "lg" | "icon"

    onClick?: () => void

    className?: string
}

function getVariantStyles(variant: ButtonVariant) {
    switch (variant) {

        case "primary":
            return "bg-gradient-to-br from-primary/90 to-primary/60 text-primary-foreground hover:opacity-95"

        case "secondary":
            return "bg-gradient-to-br from-secondary/80 to-secondary/60 text-secondary-foreground"

        case "outline":
            return "border border-border bg-gradient-to-br from-background/40 to-muted/30"

        case "ghost":
        default:
            return "bg-gradient-to-br from-transparent to-muted/20"
    }
}

export function AppButton({
                              label,
                              icon,
                              iconPosition = "left",

                              loading = false,
                              showIcon = true,
                              showLabel = true,

                              disabled = false,

                              variant = "primary",
                              size = "default",

                              onClick,
                              className
                          }: AppButtonProps) {

    const variantStyles = getVariantStyles(variant)

    const isDisabled = disabled || loading

    return (
        <Button
            size={size}
            disabled={isDisabled}
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-2 transition-all",
                variantStyles,
                className
            )}
        >

            {/* Left icon */}
            {showIcon && icon && iconPosition === "left" && !loading && (
                <span className="flex items-center">
          {icon}
        </span>
            )}

            {/* Spinner */}
            {loading && (
                <Loader2 className="animate-spin size-4" />
            )}

            {/* Label */}
            {showLabel && (
                <span className="whitespace-nowrap">
          {label}
        </span>
            )}

            {/* Right icon */}
            {showIcon && icon && iconPosition === "right" && !loading && (
                <span className="flex items-center">
          {icon}
        </span>
            )}

        </Button>
    )
}