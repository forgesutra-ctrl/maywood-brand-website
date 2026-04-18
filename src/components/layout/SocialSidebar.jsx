import { createElement } from 'react'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { SOCIAL } from '../../config/social'

const linkBase =
  'flex items-center justify-center bg-brand-charcoal px-3 py-2.5 text-brand-brass transition-colors duration-200 hover:bg-brand-charcoal-mid'

const items = [
  { href: SOCIAL.instagram, label: 'Maywood Interiors on Instagram', Icon: Instagram, className: `${linkBase} rounded-tl-[4px]` },
  { href: SOCIAL.facebook, label: 'Maywood Interiors on Facebook', Icon: Facebook, className: linkBase },
  { href: SOCIAL.linkedin, label: 'Maywood Interiors on LinkedIn', Icon: Linkedin, className: linkBase },
  { href: SOCIAL.youtube, label: 'Maywood Interiors on YouTube', Icon: Youtube, className: `${linkBase} rounded-bl-[4px]` },
]

export default function SocialSidebar() {
  return (
    <aside
      className="pointer-events-auto fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 flex-col lg:flex"
      aria-label="Social media links"
    >
      {items.map(({ href, label, Icon, className }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          aria-label={label}
        >
          {createElement(Icon, { size: 16, strokeWidth: 1.5, 'aria-hidden': true })}
        </a>
      ))}
    </aside>
  )
}
