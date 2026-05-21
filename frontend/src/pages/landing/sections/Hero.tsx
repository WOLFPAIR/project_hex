import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <header className="lp-hero">
      <nav className="lp-nav">
        <div className="lp-nav__brand">
          <span className="lp-nav__spark" aria-hidden />
          Emberdo
        </div>
        <div className="lp-nav__links">
          <a href="#supabase">Supabase</a>
          <a href="#telegram">Telegram</a>
          <a href="#flow">Как это работает</a>
        </div>
        <button className="lp-btn lp-btn--ghost" onClick={() => navigate('/login')}>
          Войти
        </button>
      </nav>

      <div className="lp-hero__grid">
        <div className="lp-hero__copy">
          <span className="lp-hero__badge">
            <span className="lp-pulse" aria-hidden />
            Supabase&nbsp;&middot;&nbsp;Realtime&nbsp;&middot;&nbsp;Telegram bot
          </span>
          <h1 className="lp-hero__title">
            Задачи, которые
            <span className="lp-hero__accent"> сами напомнят </span>
            о&nbsp;себе
          </h1>
          <p className="lp-hero__lede">
            Создавай тудушки за секунды, храни их в&nbsp;Supabase и&nbsp;получай
            напоминания прямо в&nbsp;Telegram — ровно тогда, когда время вышло.
          </p>
          <div className="lp-hero__cta">
            <button className="lp-btn lp-btn--solid" onClick={() => navigate('/register')}>
              Начать бесплатно
              <span className="lp-btn__arrow" aria-hidden>&rarr;</span>
            </button>
            <a className="lp-btn lp-btn--line" href="#flow">
              Посмотреть, как работает
            </a>
          </div>
          <div className="lp-hero__stats">
            <div>
              <strong>&lt;2&nbsp;сек</strong>
              <span>на создание задачи</span>
            </div>
            <div>
              <strong>Realtime</strong>
              <span>синхронизация в Supabase</span>
            </div>
            <div>
              <strong>0</strong>
              <span>пропущенных дедлайнов</span>
            </div>
          </div>
        </div>

        <div className="lp-hero__art">
          <div className="lp-card lp-card--app">
            <div className="lp-card__bar">
              <span /><span /><span />
              <em>emberdo / dashboard</em>
            </div>
            <div className="lp-card__row lp-card__row--done">
              <span className="lp-check" aria-hidden>&#10003;</span>
              <p>Свёрстать лендинг</p>
              <time>09:40</time>
            </div>
            <div className="lp-card__row lp-card__row--live">
              <span className="lp-check lp-check--empty" aria-hidden />
              <p>Подключить Telegram-бота</p>
              <time className="lp-card__due">через 5 мин</time>
            </div>
            <div className="lp-card__row">
              <span className="lp-check lp-check--empty" aria-hidden />
              <p>Залить миграцию в Supabase</p>
              <time>18:00</time>
            </div>
          </div>

          <div className="lp-card lp-card--ping">
            <div className="lp-ping__icon" aria-hidden>✈</div>
            <div className="lp-ping__body">
              <strong>Emberdo Bot</strong>
              <p>⏰ Напоминание: «Подключить Telegram-бота»</p>
            </div>
          </div>

          <div className="lp-hero__orb lp-hero__orb--a" aria-hidden />
          <div className="lp-hero__orb lp-hero__orb--b" aria-hidden />
        </div>
      </div>

      <div className="lp-hero__scroll" aria-hidden>
        <span />
        Листай вниз
      </div>
    </header>
  );
}
