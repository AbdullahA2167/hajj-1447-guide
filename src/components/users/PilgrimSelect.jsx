import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/appStore';

export function PilgrimSelect() {
  const { users } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="screen screen--center">
      <h1>Choose pilgrim</h1>
      <p>Tap your name to open your Hajj guide.</p>
      <div className="pilgrim-grid">
        {users.map(user => (
          <button
            key={user.id}
            className="pilgrim-card"
            onClick={() => navigate(`/user/${user.id}`)}
          >
            <div className="avatar-large avatar--placeholder">
              {user.name.charAt(0)}
            </div>
            <div className="pilgrim-name">{user.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
