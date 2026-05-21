import { Slide } from './Slide';

const ACCENT_TELEGRAM = '#2ea6e0';

function TelegramVisual() {
  return (
    <div className="lp-viz lp-viz--chat">
      <div className="lp-viz__chathead">
        <span className="lp-viz__avatar" aria-hidden>✈</span>
        <div>
          <strong>Emberdo Bot</strong>
          <em>bot</em>
        </div>
        <span className="lp-viz__online">online</span>
      </div>
      <div className="lp-viz__messages">
        <div className="lp-bubble lp-bubble--in">
          ⏰ Время вышло по задаче
          <b>«Подключить бота»</b>
          <time>сейчас</time>
        </div>
        <div className="lp-bubble lp-bubble--in lp-bubble--delay">
          Открыть в Emberdo? 👇
          <time>сейчас</time>
        </div>
        <div className="lp-bubble lp-bubble--out">
          Готово ✅
          <time>сейчас</time>
        </div>
      </div>
      <div className="lp-viz__compose">
        <span>Сообщение…</span>
        <i aria-hidden>➤</i>
      </div>
    </div>
  );
}

export function TelegramSection() {
  return (
    <>
      <div id="telegram" />
      <Slide
        index="02"
        eyebrow="Напоминания"
        accent={ACCENT_TELEGRAM}
        reversed
        title={
          <>
            Прилетают в&nbsp;<span className="lp-accent-text">Telegram</span>
          </>
        }
        description="Указал время — и бот сам напишет в нужный момент. Подключение в один клик: связываешь чат и больше не открываешь приложение, чтобы не забыть."
        bullets={[
          'Бот пишет ровно когда вышло время задачи',
          'Подключение чата за один шаг',
          'Отметить выполненной можно прямо из Telegram',
        ]}
        visual={<TelegramVisual />}
      />
    </>
  );
}
