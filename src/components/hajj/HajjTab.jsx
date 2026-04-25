import React, { useState } from 'react';
import { useAppState } from '../../store/appStore';

export function HajjTab() {
  const { hajjDays } = useAppState();
  const [selectedId, setSelectedId] = useState(hajjDays[0]?.id);

  const selectedDay = hajjDays.find(d => d.id === selectedId) || hajjDays[0];

  return (
    <div className="tab">
      <header className="tab-header">
        <h2>Hajj days</h2>
        <p>Follow this overview for 8–13 Dhul Hijjah.</p>
      </header>

      <div className="hajj-day-chips">
        {hajjDays.map(day => (
          <button
            key={day.id}
            className={'hajj-chip' + (day.id === selectedId ? ' hajj-chip--active' : '')}
            onClick={() => setSelectedId(day.id)}
          >
            {day.title}
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="hajj-day-card">
          <div className="hajj-date">
            Dhul Hijjah {selectedDay.dhulHijjahDay} – {selectedDay.gregorianDate}
          </div>
          <div className="hajj-summary">{selectedDay.summary}</div>

          <div className="hajj-section">
            <h3>Where you’ll be</h3>
            <p>{selectedDay.locationFlow.join(' → ')}</p>
          </div>

          {selectedDay.checklists.map((cl, idx) => (
            <div className="hajj-section" key={idx}>
              <h3>{cl.title}</h3>
              <ul>
                {cl.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="hajj-section">
            <h3>Rituals today</h3>
            <ul>
              {selectedDay.rituals.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
