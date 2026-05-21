import { Slide } from './Slide';

const ACCENT_SUPABASE = '#3ecf8e';

function SupabaseVisual() {
  return (
    <div className="lp-viz lp-viz--db">
      <div className="lp-viz__head">
        <span className="lp-viz__logo lp-viz__logo--supa" aria-hidden>⚡</span>
        public.tasks
        <span className="lp-viz__chip">realtime</span>
      </div>
      <pre className="lp-viz__sql">
        <code>
          <span className="tok-kw">select</span> id, title, reminder_time{'\n'}
          <span className="tok-kw">from</span> tasks{'\n'}
          <span className="tok-kw">where</span> completed = <span className="tok-val">false</span>;
        </code>
      </pre>
      <div className="lp-viz__table">
        <div className="lp-viz__tr lp-viz__tr--label">
          <span>id</span><span>title</span><span>reminder</span>
        </div>
        <div className="lp-viz__tr">
          <span>a1f</span><span>Свёрстать лендинг</span><span>09:40</span>
        </div>
        <div className="lp-viz__tr lp-viz__tr--new">
          <span>b7c</span><span>Подключить бота</span><span>+5 min</span>
        </div>
        <div className="lp-viz__tr">
          <span>c3e</span><span>Залить миграцию</span><span>18:00</span>
        </div>
      </div>
    </div>
  );
}

export function SupabaseSection() {
  return (
    <>
      <div id="supabase" />
      <Slide
        index="01"
        eyebrow="Хранилище"
        accent={ACCENT_SUPABASE}
        title={
          <>
            Данные живут в&nbsp;<span className="lp-accent-text">Supabase</span>
          </>
        }
        description="Каждая задача — это строка в Postgres. Никаких самописных бэкендов: аутентификация, Row Level Security и realtime-подписки идут из коробки."
        bullets={[
          'Postgres + Row Level Security для каждого пользователя',
          'Realtime-обновления без перезагрузки страницы',
          'Миграции и схема под версионным контролем',
        ]}
        visual={<SupabaseVisual />}
      />
    </>
  );
}
