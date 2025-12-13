interface EmojiDisplayProps {
  emoji: string;
  className?: string;
}

export function EmojiDisplay({
  emoji,
  className = "text-base",
}: EmojiDisplayProps) {
  // Special case for mantas - use image instead of emoji
  if (emoji === "🐟") {
    return (
      <img
        src="/mantas.png"
        alt="mantas"
        className={`inline-block ${className}`}
        style={{ width: "1em", height: "1em", objectFit: "contain" }}
      />
    );
  }

  // Regular emoji
  return <span className={className}>{emoji}</span>;
}
