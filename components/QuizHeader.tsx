'use client'

import Image from 'next/image'

const LOGO_PATH = '/images/logo.png'

type QuizHeaderProps = {
  onLogoClick?: () => void
}

export function QuizHeader({ onLogoClick }: QuizHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4">
      <button
        type="button"
        onClick={onLogoClick}
        className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 rounded-lg transition-opacity hover:opacity-90"
        aria-label="The Networking Lab"
      >
        <span className="flex-shrink-0 rounded-full overflow-hidden ring-2 ring-gray-200">
          <Image
            src={LOGO_PATH}
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 sm:h-10 sm:w-10 object-cover"
            priority
          />
        </span>
        <span className="text-base sm:text-lg font-semibold text-charcoal group-hover:text-accent transition-colors tracking-tight">
          The Networking Lab
        </span>
      </button>
    </header>
  )
}
