interface BrandMarkProps {
  compact?: boolean
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark${compact ? ' brand-mark-compact' : ''}`} aria-label="She Owns the World, Playable Lives">
      <span className="brand-wordmark">SHE OWNS THE WORLD</span>
      <span className="brand-descriptor">PLAYABLE LIVES</span>
    </span>
  )
}
