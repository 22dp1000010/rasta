"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Challan, ClassificationResult } from "@/lib/domain/types";
import { StatusChip } from "@/ui/StatusChip";

export function TriageForm({ challan, locale }: { challan: Challan; locale: "en" | "hi" }) {
  const router = useRouter();
  const [story, setStory] = useState(locale === "hi" ? challan.sampleStoryHi : challan.sampleStoryEn);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function classify() {
    setBusy(true);
    const response = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challanId: challan.id, text: story, locale }),
    });
    setResult(await response.json());
    setBusy(false);
  }

  function speak() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setStory(`${story}\n\nVoice input is not available in this browser, so I typed instead.`);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = locale === "hi" ? "hi-IN" : "en-IN";
    recognition.onresult = (event) => setStory(event.results[0][0].transcript);
    recognition.start();
  }

  return (
    <div className="field-stack" style={{ marginTop: 16 }}>
      <label htmlFor="story">{locale === "hi" ? "आपका विवरण" : "Your explanation"}</label>
      <textarea id="story" value={story} onChange={(event) => setStory(event.target.value)} />
      <div className="actions">
        <button className="button" type="button" onClick={() => setStory(locale === "hi" ? challan.sampleStoryHi : challan.sampleStoryEn)}>{locale === "hi" ? "नमूना विवरण लगाएं" : "Use sample explanation"}</button>
        <button className="button" type="button" onClick={speak}>{locale === "hi" ? "बोलें" : "Speak"}</button>
        <button className="button primary" type="button" onClick={classify} disabled={busy}>{busy ? "Classifying" : locale === "hi" ? "मेरे मामले को पहचानें" : "Classify my case"}</button>
      </div>
      <div aria-live="polite">
        {result ? (
          <div className="mini-card">
            <span className="provider-chip">{result.provider === "model" ? "Classified by model" : "Classified by rules (offline fallback)"}</span>
            <h3>{result.ground.replaceAll("_", " ")}</h3>
            <StatusChip severity={result.ground === "UNCLEAR" ? "bad" : result.ground === "APPEARS_VALID" ? "warn" : "good"}>{Math.round(result.confidence * 100)}% confidence</StatusChip>
            <p>{result.reasoning}</p>
            <ul>{result.evidenceNeeded.map((item) => <li key={item}>{item}</li>)}</ul>
            <button className="button primary" type="button" onClick={() => router.push(`/challan/${challan.id}/evidence?ground=${result.ground}&lang=${locale}`)}>
              {result.ground === "APPEARS_VALID" ? "Show pay-before-you-accept note" : "Continue to evidence"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

declare global {
  type RastaSpeechRecognitionEvent = {
    results: ArrayLike<ArrayLike<{ transcript: string }>>;
  };

  type RastaSpeechRecognition = {
    lang: string;
    onresult: ((event: RastaSpeechRecognitionEvent) => void) | null;
    start: () => void;
  };

  interface Window {
    SpeechRecognition?: new () => RastaSpeechRecognition;
    webkitSpeechRecognition?: new () => RastaSpeechRecognition;
  }
}
