// src/components/itinerary/ItineraryTab.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { useAppState } from '../../store/appStore';
import { useParams } from 'react-router-dom';

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function ItineraryTab() {
  const { itinerary, notes, saveNote, loadingNotes, users } = useAppState();
  const { id: userId } = useParams();
  const [editingNote, setEditingNote] = useState({});
  const [selectedDayId, setSelectedDayId] = useState(null);

  const currentUser = users.find(u => u.id === userId);
  const displayName = currentUser?.name || 'your';

  const tripStart = itinerary.length ? parseDate(itinerary[0].date) : null;
  const tripEnd = itinerary.length
    ? parseDate(itinerary[itinerary.length - 1].date)
    : null;

  const today = new Date();
  const isBeforeTrip = tripStart && today < tripStart;
  const isAfterTrip = tripEnd && today > tripEnd;

  const userNotesMap = useMemo(() => {
    if (!userId) return {};
    const map = {};
    notes
      .filter(n => n.userId === userId)
      .forEach(n => {
        map[n.itineraryId] = n.text || '';
      });
    return map;
  }, [notes, userId]);

  // Initial selected day:
  // - before trip: nothing (null) -> no card shown
  // - during trip: today or first day
  // - after trip: first day
  useEffect(() => {
    if (!itinerary || itinerary.length === 0) return;

    if (isBeforeTrip) {
      setSelectedDayId(null);
      return;
    }

    if (!isBeforeTrip && !isAfterTrip) {
      let matchId = null;
      for (const item of itinerary) {
        const itemDate = parseDate(item.date);
        if (
          itemDate.getFullYear() === today.getFullYear() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getDate() === today.getDate()
        ) {
          matchId = item.id;
          break;
        }
      }
      setSelectedDayId(matchId != null ? matchId : itinerary[0].id);
    } else {
      // after trip
      setSelectedDayId(itinerary[0].id);
    }
  }, [itinerary]);

  const handleNoteChange = (itineraryId, value) => {
    setEditingNote(prev => ({
      ...prev,
      [itineraryId]: value,
    }));
  };

  const handleNoteBlur = async itineraryId => {
    if (!userId) return;
    const text =
      editingNote[itineraryId] ?? userNotesMap[itineraryId] ?? '';
    if (text === (userNotesMap[itineraryId] || '')) return;
    await saveNote(userId, itineraryId, text.trim());
  };

  const handleJumpChange = event => {
    const value = event.target.value;
    if (!value) {
      // Allow clearing selection before trip
      if (isBeforeTrip) setSelectedDayId(null);
      return;
    }
    const targetId = Number(value);
    setSelectedDayId(targetId);
  };

  const currentItem = useMemo(
    () => itinerary.find(i => i.id === selectedDayId) || null,
    [itinerary, selectedDayId]
  );

  const renderDayCard = item => {
    if (!item) return null;
    const noteKey = String(item.id);
    const text =
      editingNote[noteKey] ?? userNotesMap[noteKey] ?? '';

    return (
      <div key={item.id} className="day-card day-card--single">
        <div className="day-card-header">
          <span className="day-chip">Day {item.dayNumber}</span>
          <span className="day-date">
            {item.weekday} – {item.date} ({item.hijriDate})
          </span>
        </div>
        <div className="day-card-body">
          <div className="day-location">{item.location}</div>
          <div className="day-activity">{item.activity}</div>
          <div className="day-accommodation">
            {item.accommodation}
          </div>

          {userId && (
            <div className="day-note-block">
              <label className="day-note-label">
                Your note for this day
              </label>
              <textarea
                className="day-note-textarea"
                value={text}
                placeholder="Write a short reflection, reminder, or packing note for yourself."
                onChange={e =>
                  handleNoteChange(noteKey, e.target.value)
                }
                onBlur={() => handleNoteBlur(noteKey)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tab">
      <header className="tab-header">
        <h2>Your journey</h2>
        <p>13–31 May 2026 – Toronto, Madinah, Makkah, Aziziyah, Mina.</p>
      </header>

      {/* Jump to day dropdown always visible */}
      <div className="itinerary-controls">
        <label className="itinerary-jump-label">
          Jump to day:
          <select
            className="itinerary-jump-select"
            value={selectedDayId || ''}
            onChange={handleJumpChange}
          >
            <option value="">Select</option>
            {itinerary.map(item => (
              <option key={item.id} value={item.id}>
                Day {item.dayNumber} – {item.weekday} {item.date}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loadingNotes && (
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Loading your personal notes…
        </p>
      )}

      {/* Pre-trip hero */}
      {isBeforeTrip && tripStart && (
        <div className="pretrip-hero">
          <div className="pretrip-badge">Hajj 1447 / 2026</div>
          <h3 className="pretrip-title">
            {displayName}&apos;s Hajj journey is loading…
          </h3>
          <p className="pretrip-subtitle">
            All the days, details, and checklists will unlock when your trip
            begins. For now, this space is just for intention and preparation.
          </p>
          <div className="pretrip-countdown">
            <div className="pretrip-countdown-number">
              {Math.ceil(
                (tripStart.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </div>
            <div className="pretrip-countdown-label">
              days until departure
            </div>
          </div>
          <div className="pretrip-list">
            <p className="pretrip-list-title">
              Before you go, {displayName.split(' ')[0]} can:
            </p>
            <ul>
              <li>
                Write a short personal intention for this Hajj in your
                notes.
              </li>
              <li>
                Start collecting duas you want to make in Madinah, Arafat,
                and at the Kaaba.
              </li>
              <li>
                Discuss simple roles in the family (who keeps passports,
                meds, snacks).
              </li>
            </ul>
          </div>
          <p className="pretrip-footer">
            You can preview any future day using the menu above. If you
            don&apos;t pick a day, this screen stays simple.
          </p>
        </div>
      )}

      {/* Post-trip hero */}
      {isAfterTrip && (
        <div className="pretrip-hero">
          <div className="pretrip-badge">Alhamdulillah</div>
          <h3 className="pretrip-title">
            {displayName}&apos;s Hajj journey is complete
          </h3>
          <p className="pretrip-subtitle">
            This space can now be your memory lane — revisit notes, add
            reflections, and keep your duas alive long after you return
            home.
          </p>
          <p className="pretrip-footer">
            Use the menu above to open any day from the trip and capture
            what you experienced and felt.
          </p>
        </div>
      )}

      {/* Only show the day card if a day has been selected (or auto selected during/after trip) */}
      <div className="itinerary-timeline">
        {renderDayCard(currentItem)}
      </div>
    </div>
  );
}