// src/store/appStore.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialUsers } from '../data/users';
import { itinerary } from '../data/itinerary';
import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [duas, setDuas] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDuas, setLoadingDuas] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [umrahSteps] = useState([
    {
      id: 'prep-ihram',
      order: 1,
      title: 'Prepare and wear Ihram',
      where: 'At hotel before leaving for Masjid al-Haram',
      description:
        'Take a shower if possible, wear Ihram (for men: two white cloths; for women: modest clothing) and ensure you are in wudu.',
      tips: [
        'Use a comfortable Ihram belt.',
        'Keep your phone, hotel card, and water in a small bag.',
      ],
    },
    {
      id: 'niyyah',
      order: 2,
      title: 'Make intention (Niyyah) and start Talbiyah',
      where: 'On the way to Masjid al-Haram',
      description:
        'Make intention for Umrah in your heart and begin reciting Talbiyah as you approach the Haram.',
      tips: ['Keep Talbiyah soft but constant until Tawaf starts.'],
    },
    {
      id: 'enter-haram',
      order: 3,
      title: 'Enter Masjid al-Haram',
      where: 'Gate of the Haram',
      description:
        'Enter with your right foot, recite the dua of entering the masjid, and keep your heart focused.',
      tips: [
        'Move with the crowd calmly.',
        'Avoid blocking entrances for pictures.',
      ],
    },
    {
      id: 'tawaf',
      order: 4,
      title: 'Perform Tawaf (7 rounds)',
      where: 'Around the Kaaba',
      description:
        'Perform seven anti-clockwise circuits around the Kaaba, starting from the Black Stone line.',
      tips: [
        'Do not push to touch the Black Stone; point from afar if crowded.',
        'Stay with your group or family and choose a calmer ring further out.',
      ],
    },
    {
      id: 'two-rakaat',
      order: 5,
      title: 'Pray two rakaat',
      where: 'Masjid al-Haram',
      description:
        'Pray two rakaat, ideally behind Maqam Ibrahim if possible or anywhere convenient in the masjid.',
      tips: ['Do not block walking routes; move to a clear area.'],
    },
    {
      id: 'sai',
      order: 6,
      title: 'Perform Sa’i (Safa–Marwa)',
      where: 'Between Safa and Marwa',
      description:
        'Walk seven times between Safa and Marwa, starting at Safa and ending at Marwa.',
      tips: [
        'Use escalators and lifts if needed.',
        'Walk at a comfortable pace; do not rush.',
      ],
    },
    {
      id: 'haircut',
      order: 7,
      title: 'Cut or shave hair',
      where: 'After Sa’i',
      description:
        'Men shave or trim hair, women cut a small portion of hair, and then you exit Ihram.',
      tips: ['Ensure the barber uses clean equipment; avoid crowded shops.'],
    },
  ]);

  const [hajjDays] = useState([
    {
      id: 'day8',
      dhulHijjahDay: 8,
      gregorianDate: '2026-05-25',
      title: 'Day 8 – Mina tents (Maktab A)',
      summary:
        'Move from Aziziyah to Mina and settle into the tents for the start of core Hajj rituals.',
      locationFlow: ['Aziziyah', 'Mina (Maktab A)'],
      checklists: [
        {
          title: 'What to pack today',
          items: [
            'Ihram on, small bag with prayer mat and refillable bottle.',
            'Basic medications and blister plasters.',
            'Simple snacks in case of delays.',
          ],
        },
        {
          title: 'Family coordination',
          items: [
            'Agree on a meeting point near your tent sign.',
            'Keep hotel card and ID in your pocket.',
          ],
        },
      ],
      rituals: [
        'Travel from Aziziyah to Mina by bus as arranged.',
        'Stay in air-conditioned tents (Maktab A) with shared facilities.',
      ],
    },
    {
      id: 'day9',
      dhulHijjahDay: 9,
      gregorianDate: '2026-05-26',
      title: 'Day 9 – Arafat then Muzdalifah',
      summary:
        'Stand in Arafat for dua, then move to Muzdalifah to spend the night under the open sky.',
      locationFlow: ['Mina', 'Arafat', 'Muzdalifah'],
      checklists: [
        {
          title: 'What to pack today',
          items: [
            'Small mat or light blanket for Muzdalifah.',
            'Extra water and snacks (no meals provided in Muzdalifah).',
            'Torch or phone light and power bank.',
          ],
        },
        {
          title: 'Spiritual focus',
          items: [
            'Prepare a written list of duas beforehand.',
            'Stay patient and focused during long waiting times.',
          ],
        },
      ],
      rituals: [
        'Move from Mina to Arafat by bus or on foot.',
        'Spend the afternoon in Arafat in dua and worship.',
        'After Maghrib, travel to Muzdalifah; pray Maghrib and Isha together there.',
        'Spend the night in Muzdalifah under the open sky.',
      ],
    },
    {
      id: 'day10',
      dhulHijjahDay: 10,
      gregorianDate: '2026-05-27',
      title: 'Day 10 – Jamarat, Qurbani, Tawaf',
      summary:
        'Return from Muzdalifah to Mina, perform Rami, Qurbani, haircut, and Tawaf as planned.',
      locationFlow: ['Muzdalifah', 'Mina', 'Masjid al-Haram', 'Aziziyah'],
      checklists: [
        {
          title: 'What to pack today',
          items: [
            'Stones collected in Muzdalifah for Rami.',
            'Comfortable sandals for walking and stoning.',
            'Basic first aid (plasters, pain relief).',
          ],
        },
        {
          title: 'Health and safety',
          items: [
            'Stay hydrated and take short rests when possible.',
            'Follow crowd flow at Jamarat and avoid pushing.',
          ],
        },
      ],
      rituals: [
        'Travel from Muzdalifah back to Mina after Fajr.',
        'Perform Rami (stoning) at Jamarat.',
        'Qurbani (sacrifice) is arranged with the official Hajj services.',
        'Cut/shave hair and exit Ihram.',
        'Perform Tawaf (Ifadah) at Masjid al-Haram according to your group plan.',
      ],
    },
    {
      id: 'day11',
      dhulHijjahDay: 11,
      gregorianDate: '2026-05-28',
      title: 'Day 11 – Jamarat',
      summary:
        'Stay in Mina/Aziziyah area and perform Rami at Jamarat again.',
      locationFlow: ['Mina', 'Aziziyah'],
      checklists: [
        {
          title: 'Daily essentials',
          items: [
            'Enough water for high heat and walking.',
            'Comfortable footwear and light clothing.',
          ],
        },
      ],
      rituals: [
        'Remain in Mina area and perform Rami (stoning) at Jamarat on the designated day.',
        'Return to tents or Aziziyah accommodation to rest.',
      ],
    },
    {
      id: 'day12',
      dhulHijjahDay: 12,
      gregorianDate: '2026-05-29',
      title: 'Day 12 – Jamarat and Jumma',
      summary:
        'Another day of Rami at Jamarat, with Jumma prayers in this schedule.',
      locationFlow: ['Mina', 'Aziziyah'],
      checklists: [
        {
          title: 'Prepare for crowds',
          items: [
            'Plan Jamarat time with your group to avoid peak crowds.',
            'Carry small snacks and water.',
          ],
        },
      ],
      rituals: [
        'Perform Rami at Jamarat.',
        'Pray Jumma as possible according to schedule.',
        'Return to accommodation and rest.',
      ],
    },
    {
      id: 'day13',
      dhulHijjahDay: 13,
      gregorianDate: '2026-05-30',
      title: 'Day 13 – Final Jamarat and Tawaf al-Wida',
      summary:
        'Conclude Jamarat and perform farewell Tawaf (Tawaf al-Wida).',
      locationFlow: ['Mina', 'Masjid al-Haram', 'Aziziyah'],
      checklists: [
        {
          title: 'Farewell day prep',
          items: [
            'Pack lightly for your final visit to Haram.',
            'Keep a written list of final duas.',
          ],
        },
      ],
      rituals: [
        'Final Rami (stoning) at Jamarat on this day.',
        'Perform Tawaf al-Wida at Masjid al-Haram individually.',
        'Return to Aziziyah to prepare for departure.',
      ],
    },
  ]);

  // Users: seed + subscribe
  useEffect(() => {
    const usersRef = collection(db, 'users');

    const setup = async () => {
      try {
        const snap = await getDocs(usersRef);
        if (snap.empty) {
          await Promise.all(
            initialUsers.map(u =>
              setDoc(doc(usersRef, u.id), {
                name: u.name,
                avatarUrl: u.avatarUrl || null,
              })
            )
          );
        }
      } catch (e) {
        console.error('Error seeding users', e);
      }

      const unsub = onSnapshot(usersRef, snapshot => {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
        const orderMap = initialUsers.reduce((acc, u, i) => {
          acc[u.id] = i;
          return acc;
        }, {});
        list.sort((a, b) => (orderMap[a.id] ?? 0) - (orderMap[b.id] ?? 0));
        setUsers(list);
        setLoadingUsers(false);
      });

      return () => unsub();
    };

    setup();
  }, []);

  // Duas: subscribe
  useEffect(() => {
    const duasRef = collection(db, 'duas');
    const unsub = onSnapshot(duasRef, snapshot => {
      const list = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const ta = a.createdAt?.seconds || 0;
          const tb = b.createdAt?.seconds || 0;
          return tb - ta;
        });
      setDuas(list);
      setLoadingDuas(false);
    });
    return () => unsub();
  }, []);

  // Favorites: subscribe
  useEffect(() => {
    const favRef = collection(db, 'favorites');
    const unsub = onSnapshot(favRef, snapshot => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFavorites(list);
      setLoadingFavorites(false);
    });
    return () => unsub();
  }, []);

  // Notes: subscribe
  useEffect(() => {
    const notesRef = collection(db, 'notes');
    const unsub = onSnapshot(notesRef, snapshot => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotes(list);
      setLoadingNotes(false);
    });
    return () => unsub();
  }, []);

  const updateUser = async updated => {
    try {
      const ref = doc(db, 'users', updated.id);
      await setDoc(
        ref,
        {
          name: updated.name,
          avatarUrl: updated.avatarUrl || null,
        },
        { merge: true }
      );
    } catch (e) {
      console.error('Error updating user', e);
    }
  };

  const addDua = async dua => {
    try {
      const duasRef = collection(db, 'duas');
      await addDoc(duasRef, {
        imageUrl: dua.imageUrl,
        uploadedBy: dua.uploadedBy,
        caption: dua.caption || '',
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('Error adding dua', e);
    }
  };

  const toggleFavorite = async (userId, duaId, currentlyFavored) => {
    const favId = `${userId}_${duaId}`;
    const favDocRef = doc(db, 'favorites', favId);
    try {
      if (currentlyFavored) {
        await deleteDoc(favDocRef);
      } else {
        await setDoc(favDocRef, {
          userId,
          duaId,
        });
      }
    } catch (e) {
      console.error('Error toggling favorite', e);
    }
  };

  const saveNote = async (userId, itineraryId, text) => {
    const noteId = `${userId}_${itineraryId}`;
    const noteRef = doc(db, 'notes', noteId);
    try {
      await setDoc(
        noteRef,
        {
          userId,
          itineraryId,
          text,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error('Error saving note', e);
    }
  };

  // Delete dua; we only call this from UI when user is uploader
  const deleteDua = async duaId => {
    try {
      const duaRef = doc(db, 'duas', duaId);
      await deleteDoc(duaRef);
      // We are not automatically deleting favorites/notes referencing it here;
      // you can add cleanup logic if you want.
    } catch (e) {
      console.error('Error deleting dua', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        users,
        itinerary,
        duas,
        favorites,
        notes,
        umrahSteps,
        hajjDays,
        loadingUsers,
        loadingDuas,
        loadingFavorites,
        loadingNotes,
        updateUser,
        addDua,
        toggleFavorite,
        saveNote,
        deleteDua,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}