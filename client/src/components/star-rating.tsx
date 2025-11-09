import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, onRatingChange, size = "md" }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              onRatingChange(star)
            }
          }}
          className={cn(
            "transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
            "cursor-pointer",
          )}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              star <= rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  )
}
