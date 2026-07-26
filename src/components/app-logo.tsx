export function AppLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/dummy-logo.svg"
      height={40}
      width={40}
      className="inline-block object-contain"
      style={{ width: size, height: size }}
    />
  )
}
