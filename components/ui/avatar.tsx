import Image from 'next/image'

type AvatarProps = {
  name?: string | null
  email?: string | null
  imageUrl?: string | null
  size?: number
}

export function Avatar({ name, email, imageUrl, size = 32 }: AvatarProps) {
  const hash = email ? new TextEncoder().encode(email.toLowerCase()) : undefined
  const placeholder = `https://www.gravatar.com/avatar/${hash ? Array.from(hash).join('') : '000'}?d=identicon`
  const src = imageUrl || placeholder
  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative inline-block rounded-full overflow-hidden" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name ?? email ?? 'User'} width={size} height={size} />
      </span>
      {name ? <span className="text-sm text-gray-700">{name}</span> : null}
    </div>
  )
}

export default Avatar
