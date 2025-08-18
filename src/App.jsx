import React, { useEffect, useMemo, useState } from "react";
import {
  WebAppProvider,
  MainButton,
  useExpand,
  useThemeParams,
} from "@vkruglikov/react-telegram-web-app";

/** Берём цвета из Telegram Theme Params с понятными fallback'ами */
function useTGColors() {
  const { colorScheme, ...tp } = useThemeParams();
  const isDark = colorScheme === "dark";
  const bg = tp.secondaryBgColor || (isDark ? "#0f0f10" : "#ffffff");
  const text = tp.textColor || (isDark ? "#f1f1f1" : "#111111");
  const hint = tp.hintColor || (isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.6)");
  const stroke = isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)";
  const card = tp.bgColor || (isDark ? "#151517" : "#ffffff");
  const sel = tp.accentTextColor || "#4c93ff";
  return { isDark, bg, text, hint, stroke, card, sel };
}

function OptionCard(props) {
  const {
    name,
    optionText,
    selected,
    onSelect,
    selColor,
    stroke,
    textColor,
    cardBg,
  } = props;
  const checked = selected === optionText;

  // Вытащим число до первой точки для «чипа»
  const chip = (optionText.split(".")[0] || "").trim();

  return (
    <label
      htmlFor={`${name}-${chip}`}
      className="opt-card"
      style={{
        border: `1px solid ${checked ? selColor : stroke}`,
        background: cardBg,
        color: textColor,
      }}
    >
      <input
        id={`${name}-${chip}`}
        type="radio"
        name={name}
        value={optionText}
        checked={checked}
        onChange={() => onSelect(optionText)}
      />
      <span className="opt-chip" aria-hidden>
        {chip}
      </span>
      <span className="opt-text">{optionText}</span>

      <style>{`
        .opt-card {
          display:flex; align-items:flex-start; gap:12px;
          padding:14px 12px; border-radius:12px;
          transition: border-color .15s ease, background-color .15s ease, transform .02s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .opt-card:active { transform: scale(0.997); }
        .opt-card input { position:absolute; opacity:0; pointer-events:none; }
        .opt-chip {
          display:inline-flex; align-items:center; justify-content:center;
          min-width:28px; height:28px; border-radius:999px;
          border: 2px solid ${checked ? selColor : stroke};
          padding:0 8px; font-weight:700; line-height:1;
        }
        .opt-text { font-size:14px; line-height:1.35; }
        @media (min-width:420px){
          .opt-text { font-size:15px; }
        }
        .opt-card:focus-within { outline: 2px solid ${selColor}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .opt-card { transition:none; } }
      `}</style>
    </label>
  );
}

function Group({ title, hint, children }) {
  return (
    <section className="group">
      <h2 className="title">{title}</h2>
      {hint ? <p className="hint">{hint}</p> : null}
      <div className="list">{children}</div>
      <style>{`
        .group { display:block; }
        .title { font-size: clamp(16px, 4vw, 18px); line-height:1.25; margin: 18px 0 6px 0; font-weight: 700; }
        .hint { margin:0 0 10px 0; font-size:13px; opacity:.8; }
        .list { display: grid; gap: 10px; }
      `}</style>
    </section>
  );
}

function Survey() {
  const { expand } = useExpand();
  const c = useTGColors();

  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);

  useEffect(() => {
    try { expand(); } catch {}
  }, [expand]);

  const canSend = q1 !== null && q2 !== null;

  const handleSend = () => {
    if (!canSend) return;
    const payload = JSON.stringify({ q1, q2 });
    const tg = window?.Telegram?.WebApp;
    try { tg?.HapticFeedback?.impactOccurred?.("medium"); } catch {}
    if (tg?.sendData) tg.sendData(payload);
    else {
      alert("sendData недоступен (запустите из Telegram)");
      console.log("Payload:", payload);
    }
  };

  // === ИСХОДНЫЕ ТЕКСТОВКИ (без правок) ===
  const q1Options = useMemo(
    () => [
      '0. Не могу оценить',
      '1. Очень низкая вовлеченность. Команда проявляет минимальную активность. Не реагирует на проблемы и сбои.',
      '2. Низкая вовлеченность. Команда реагирует с задержками, не проявляет инициативу по устранению сбоев.',
      '3. Средняя вовлеченность. Команда отвечает в рабочее время, по запросу информирует о текущем статусе и планах.',
      '4. Высокая вовлеченност. Команда активно реагирует в рабочее время, своевременно информирует о статусе, проявляет инициативу.',
      '5. Очень высокая вовлеченность. Команда демонстрирует инициативу и проактивность.',
    ],
    []
  );

  const q2Options = useMemo(
    () => [
      "0. Не могу оценить",
      "1. Очень низкое качество решений и информации. Предложения команды неполные, необоснованные.",
      "2. Низкое качество решений и информации. Предложения содержат некоторые обоснования, но часто требуют доработки или дополнительных объяснений.",
      "3. Среднее качество решений и информации. Предоставляется достаточная информация для понимания ситуации.",
      "4. Высокое качество решений и информации. Предложения хорошо обоснованы, полностью способствуют эффективному устранению инцидентов. Информация предоставляется своевременно и ясно.",
      "5. Очень высокое качество решений и информации. Информация исчерпывающая, коммуникация проактивная, решения — оптимальные."
    ],
    []
  );

  return (
    <div
      className="wrap"
      style={{ background: c.bg, color: c.text }}
    >
      <div className="card" style={{ background: c.card, borderColor: c.stroke }}>
        <header className="hdr">
          <h1>Короткий опрос</h1>
          <p className="sub" style={{ color: c.hint }}>
            Выберите варианты и нажмите «Отправить» внизу.
          </p>
        </header>

        <Group
          title="I. Вовлеченность. Команда продукта проявляет активность и заинтересованность в решении сбоев и проблем."
        >
          {q1Options.map((text) => (
            <OptionCard
              key={text}
              name="q1"
              optionText={text}
              selected={q1}
              onSelect={setQ1}
              selColor={c.sel}
              stroke={c.stroke}
              textColor={c.text}
              cardBg={c.card}
            />
          ))}
        </Group>

        <Group
          title="II. Качество предлагаемых решений и информации. Предложения команды продукта полны, обоснованы и способствуют эффективному устранению инцидентов"
        >
          {q2Options.map((text) => (
            <OptionCard
              key={text}
              name="q2"
              optionText={text}
              selected={q2}
              onSelect={setQ2}
              selColor={c.sel}
              stroke={c.stroke}
              textColor={c.text}
              cardBg={c.card}
            />
          ))}
        </Group>

        <div style={{ height: 12 }} />
        <MainButton
          text={canSend ? "Отправить" : "Выберите ответы"}
          disabled={!canSend}
          onClick={handleSend}
        />
      </div>

      <style>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: start center;
          padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
        }
        .card {
          width: 100%;
          max-width: 560px;
          border-radius: 16px;
          border: 1px solid;
          padding: 16px;
          box-shadow: 0 6px 24px rgba(0,0,0,.08);
        }
        .hdr h1 {
          margin: 0 0 4px 0;
          font-size: clamp(18px, 4.8vw, 20px);
          line-height: 1.2;
        }
        .sub { margin: 0 0 8px 0; font-size: 13px; }
        /* Длинные описания не «рвут» вёрстку на узких экранах */
        .opt-text { overflow-wrap: anywhere; }
        @media (min-width: 520px) { .card { padding: 18px; } }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <Survey />
    </WebAppProvider>
  );
}