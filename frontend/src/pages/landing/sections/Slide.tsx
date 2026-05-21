import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

export interface SlideProps {
  /** Two-digit chapter marker, e.g. "01". */
  index: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  /** Brand accent (Supabase green, Telegram blue, ember…). */
  accent: string;
  bullets?: string[];
  /** The illustrative artwork rendered beside the copy. */
  visual: ReactNode;
  /** Flip the column order so consecutive slides alternate sides. */
  reversed?: boolean;
}

/**
 * A single modular landing chapter. Every <Slide> shares the same skeleton —
 * copy on one side, an artwork on the other — so the page is composed by
 * stacking these, not by writing bespoke markup per section.
 */
export function Slide({
  index,
  eyebrow,
  title,
  description,
  accent,
  bullets,
  visual,
  reversed,
}: SlideProps) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`lp-slide${reversed ? ' lp-slide--reversed' : ''}${
        visible ? ' is-visible' : ''
      }`}
      style={{ '--accent': accent } as CSSProperties}
    >
      <div className="lp-slide__copy">
        <div className="lp-slide__eyebrow">
          <span className="lp-slide__index">{index}</span>
          <span className="lp-slide__line" />
          {eyebrow}
        </div>
        <h2 className="lp-slide__title">{title}</h2>
        <p className="lp-slide__desc">{description}</p>
        {bullets && (
          <ul className="lp-slide__bullets">
            {bullets.map((b) => (
              <li key={b}>
                <span className="lp-slide__dot" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lp-slide__visual">{visual}</div>
    </section>
  );
}
