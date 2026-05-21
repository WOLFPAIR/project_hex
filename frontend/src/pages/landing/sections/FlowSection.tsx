import { Slide } from './Slide';

const ACCENT_EMBER = '#ff7a45';

function FlowVisual() {
  return (
    <div className="lp-viz lp-viz--board">
      <div className="lp-board__col">
        <header>В процессе <span>2</span></header>
        <div className="lp-board__card lp-board__card--accent">Подключить бота</div>
        <div className="lp-board__card">Залить миграцию</div>
      </div>
      <div className="lp-board__col lp-board__col--done">
        <header>Готово <span>1</span></header>
        <div className="lp-board__card lp-board__card--done">Свёрстать лендинг</div>
      </div>
    </div>
  );
}

export function FlowSection() {
  return (
    <>
      <div id="flow" />
      <Slide
        index="03"
        eyebrow="Поток работы"
        accent={ACCENT_EMBER}
        title={
          <>
            Создавай задачи
            <span className="lp-accent-text"> за секунды</span>
          </>
        }
        description="Две колонки, ноль лишнего. Добавляешь задачу, ставишь напоминание, перетаскиваешь в «Готово». Всё остальное Emberdo берёт на себя."
        bullets={[
          'Доска «В процессе» / «Готово» без визуального шума',
          'Напоминание на каждую задачу одним полем',
          'Мгновенный отклик интерфейса',
        ]}
        visual={<FlowVisual />}
      />
    </>
  );
}
