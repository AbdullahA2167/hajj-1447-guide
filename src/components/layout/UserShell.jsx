// src/components/layout/UserShell.jsx
import React from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/appStore';

export function UserShell() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, loadingUsers } = useAppState();
  const user = users.find(u => u.id === id);

  if (loadingUsers && !user) {
    return (
      <div className="screen screen--center">
        <p>Loading user…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="screen screen--center">
        <p>User not found.</p>
        <button onClick={() => navigate('/')}>Back to pilgrims</button>
      </div>
    );
  }

  const goToProfile = () => {
    navigate(`/user/${user.id}/profile`);
  };

  return (
    <div className="shell">
      <header className="shell-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>

        <div className="shell-user">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="avatar avatar-img-inner"
            />
          ) : (
            <div className="avatar avatar--placeholder">
              {user.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="shell-user-name">{user.name}</div>
            <div className="shell-user-subtitle">Hajj 1447 / 2026</div>
          </div>
        </div>

        <button
          className="profile-icon-button"
          onClick={goToProfile}
          aria-label="Open profile"
        >
          <span className="profile-icon-generic">
            {/* simple generic person glyph */}
            <span className="profile-icon-head" />
            <span className="profile-icon-body" />
          </span>
        </button>
      </header>

      <nav className="shell-tabs">
        <NavLink to="itinerary" className="tab-link">
          Itinerary
        </NavLink>
        <NavLink to="umrah" className="tab-link">
          Umrah
        </NavLink>
        <NavLink to="hajj" className="tab-link">
          Hajj
        </NavLink>
        <NavLink to="duas" className="tab-link">
          Duas
        </NavLink>
        {/* Profile removed from tabs; use icon instead */}
      </nav>

      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}