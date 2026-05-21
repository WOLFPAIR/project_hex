import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const MARQUEE = [
  'Supabase Postgres',
  'Row Level Security',
  'Realtime',
  'Telegram Bot API',
  'Напоминания',
  'Тудушки',
  'Дедлайны',
  'Edge Functions',
];

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="lp-footer">
      {/* animated atmosphere */}
      <div className="lp-footer__aurora" aria-hidden>
        <span className="lp-aurora lp-aurora--ember" />
        <span className="lp-aurora lp-aurora--mint" />
        <span className="lp-aurora lp-aurora--sky" />
      </div>
      <div className="lp-footer__stars" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>

      <div className="lp-footer__cta">
        <h2 className="lp-footer__title">
          Перестань держать дедлайны
          <br />
          <span className="lp-footer__shine">в голове.</span>
        </h2>
        <p className="lp-footer__sub">
          Заведи первую задачу за минуту — остальное сделают Supabase и&nbsp;Telegram.
        </p>
        <div className="lp-footer__buttons">
          <button className="lp-btn lp-btn--solid lp-btn--lg" onClick={() => navigate('/register')}>
            Создать аккаунт
            <span className="lp-btn__arrow" aria-hidden>&rarr;</span>
          </button>
          <button className="lp-btn lp-btn--line lp-btn--lg" onClick={() => navigate('/login')}>
            У меня уже есть аккаунт
          </button>
        </div>
      </div>

      <div className="lp-marquee" aria-hidden>
        <div className="lp-marquee__track">
          {[...MARQUEE, ...MARQUEE].map((label, i) => (
            <span key={i} className="lp-marquee__item">
              {label}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <div className="lp-footer__base">
        <div className="lp-footer__brand">
          <span className="lp-nav__spark" aria-hidden />
          Emberdo
        </div>
        <nav className="lp-footer__nav">
          <a href="#supabase">Supabase</a>
          <a href="#telegram">Telegram</a>
          <a href="#flow">Возможности</a>
        </nav>
        <p className="lp-footer__copy">© {new Date().getFullYear()} Emberdo. Сделано на ночных дедлайнах.</p>
      </div>
    </footer>
  );
}
