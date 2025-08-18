import React, { useMemo, useState, useEffect } from "react";
import {
  WebAppProvider,
  MainButton,
  useExpand,
  useThemeParams,
} from "@vkruglikov/react-telegram-web-app";

const Survey = () => {
  const { colorScheme } = useThemeParams();
  const { expand } = useExpand();

  const [q1, setQ1] = useState(null); // 1..4
  const [q2, setQ2] = useState(null); // 'один' | 'два' | 'три' | 'четыре'

  useEffect(() => {
    try {
      expand();
    } catch {}
  }, [expand]);

  const canSend = q1 !== null && q2 !== null;
  const handleSend = () => {
    if (!canSend) return;
    const payload = JSON.stringify({ q1, q2 });
    // Доступно внутри Telegram-клиента
    if (window?.Telegram?.WebApp?.sendData) {
      window.Telegram.WebApp.sendData(payload);
    } else {
      alert("sendData недоступен (запустите из Telegram)");
    }
  };

  const q1Options = useMemo(() => [1, 2, 3, 4], []);
  const q2Options = useMemo(() => ["один", "два", "три", "четыре"], []);

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: colorScheme === "dark" ? "#0f0f10" : "#fff",
        color: colorScheme === "dark" ? "#f1f1f1" : "#111",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 6px 24px rgba(0,0,0,.08)",
          background: "inherit",
          border: "1px solid rgba(0,0,0,.1)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Короткий опрос</h1>
        <p style={{ opacity: 0.8, fontSize: 13 }}>
          Выберите варианты и нажмите «Отправить» внизу.
        </p>

        <h2 style={{ fontSize: 16 }}>1) Как игра?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {q1Options.map((v) => (
            <button
              key={v}
              onClick={() => setQ1(v)}
              style={{
                flex: "1 1 auto",
                padding: "12px 14px",
                borderRadius: 12,
                border: `2px solid ${q1 === v ? "#4c93ff" : "rgba(0,0,0,.15)"}`,
                background: "#fff",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: 16, marginTop: 18 }}>2) Как игра 2?</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {q2Options.map((v) => (
            <button
              key={v}
              onClick={() => setQ2(v)}
              style={{
                flex: "1 1 auto",
                padding: "12px 14px",
                borderRadius: 12,
                border: `2px solid ${q2 === v ? "#4c93ff" : "rgba(0,0,0,.15)"}`,
                background: "#fff",
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <div style={{ height: 24 }} />
        <MainButton
          text={canSend ? "Отправить" : "Выберите ответы"}
          disabled={!canSend}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <Survey />
    </WebAppProvider>
  );
}
