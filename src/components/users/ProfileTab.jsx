// src/components/users/ProfileTab.jsx
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppState } from '../../store/appStore';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // [web:18][web:24]

export function ProfileTab() {
  const { id } = useParams();
  const { users, updateUser } = useAppState();
  const user = users.find(u => u.id === id);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  if (!user) return <div className="tab">User not found.</div>;

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({
        ...user,
        name: name.trim() || user.name,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fileRef = ref(
        storage,
        `avatars/${user.id}-${Date.now()}-${file.name}`
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await updateUser({
        ...user,
        avatarUrl: url,
      });
    } catch (e) {
      console.error('Error uploading avatar', e);
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleClearAvatar = async () => {
    await updateUser({ ...user, avatarUrl: null });
  };

  return (
    <div className="tab">
      <header className="tab-header">
        <h2>Profile</h2>
        <p>Update your display name and picture.</p>
      </header>

      <form onSubmit={handleSave} className="profile-form">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper" onClick={handleAvatarClick}>
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="avatar-large"
              />
            ) : (
              <div className="avatar-large avatar--placeholder">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? 'Uploading…' : 'Change picture'}
          </button>
          {user.avatarUrl && (
            <button
              type="button"
              className="link-button"
              onClick={handleClearAvatar}
            >
              Remove picture
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="profile-field">
          <label htmlFor="name">Display name</label>
          <input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="primary-button"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}