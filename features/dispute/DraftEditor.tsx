"use client";

import { useState } from "react";

export function DraftEditor({ grievanceLetter, recordRequest }: { grievanceLetter: string; recordRequest: string }) {
  const [letter, setLetter] = useState(`${grievanceLetter}\n\n---\n\n${recordRequest}`);
  return (
    <div className="panel">
      <label htmlFor="draft">Draft text</label>
      <textarea id="draft" className="draft-box" value={letter} onChange={(event) => setLetter(event.target.value)} />
      <div className="actions">
        <button className="button primary" type="button" onClick={() => window.print()}>Save as PDF</button>
        <button className="button" type="button" onClick={() => setLetter(`${grievanceLetter}\n\n---\n\n${recordRequest}`)}>Reset draft</button>
      </div>
    </div>
  );
}
