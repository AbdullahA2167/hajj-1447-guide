// src/components/duas/DuasTab.jsx
import React, { useRef, useState, useMemo } from 'react';
import { useAppState } from '../../store/appStore';
import { useParams } from 'react-router-dom';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function DuasTab() {
  const {
    duas,
    addDua,
    loadingDuas,
    favorites,
    loadingFavorites,
    toggleFavorite,
    deleteDua,
  } = useAppState();
  const { id: userId } = useParams();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [selectedDua, setSelectedDua] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async event => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    try {
      const fileRef = ref(
        storage,
        `duas/${userId}/${Date.now()}-${file.name}`
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await addDua({
        imageUrl: url,
        uploadedBy: userId,
        caption: uploadCaption.trim(),
      });
      setUploadCaption('');
    } catch (e) {
      console.error('Error uploading dua image', e);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const userFavorites = useMemo(() => {
    if (!userId) return [];
    return favorites.filter(f => f.userId === userId);
  }, [favorites, userId]);

  const isFavorite = duaId =>
    userFavorites.some(f => f.duaId === duaId);

  const [favoriteDuas, otherDuas] = useMemo(() => {
    if (!userId) return [[], duas];
    const favSet = new Set(userFavorites.map(f => f.duaId));
    const fav = [];
    const others = [];
    duas.forEach(d => {
      if (favSet.has(d.id)) fav.push(d);
      else others.push(d);
    });
    return [fav, others];
  }, [duas, userFavorites, userId]);

  const handleToggleFavorite = dua => {
    if (!userId) return;
    const currentlyFav = isFavorite(dua.id);
    toggleFavorite(userId, dua.id, currentlyFav);
  };

  const handleCardClick = dua => {
    setSelectedDua(dua);
  };

  const closeModal = () => {
    setSelectedDua(null);
  };

  const handleDelete = async dua => {
    if (!userId) return;
    if (dua.uploadedBy !== userId) return; // safety at UI level
    const confirmDelete = window.confirm('Delete this dua image?');
    if (!confirmDelete) return;
    setDeletingId(dua.id);
    try {
      await deleteDua(dua.id);
    } catch (e) {
      console.error('Error deleting dua', e);
    } finally {
      setDeletingId(null);
    }
  };

  const renderDuaCard = dua => (
    <div key={dua.id} className="dua-card">
      <div
        className="dua-image-wrapper"
        onClick={() => handleCardClick(dua)}
      >
        <img src={dua.imageUrl} alt="dua" className="dua-image" />
      </div>
      <div className="dua-meta">
        <div className="dua-caption">
          {dua.caption || 'Dua image'}
        </div>
        <div className="dua-meta-bottom">
          <div className="dua-uploader">
            Uploaded by: {dua.uploadedBy}
          </div>
          <div className="dua-actions">
            {userId && (
              <button
                type="button"
                className={
                  'favorite-button' +
                  (isFavorite(dua.id) ? ' favorite-button--active' : '')
                }
                onClick={() => handleToggleFavorite(dua)}
              >
                {isFavorite(dua.id) ? '★' : '☆'}
              </button>
            )}
            {userId && dua.uploadedBy === userId && (
              <button
                type="button"
                className="dua-delete-button"
                onClick={() => handleDelete(dua)}
                disabled={deletingId === dua.id}
              >
                {deletingId === dua.id ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="tab">
      <header className="tab-header">
        <h2>Family duas</h2>
        <p>Upload dua images, favorite your own, and view them full-screen.</p>
      </header>

      <div className="dua-upload-row">
        <input
          type="text"
          className="dua-caption-input"
          placeholder="Optional caption (e.g., Dua for parents)"
          value={uploadCaption}
          onChange={e => setUploadCaption(e.target.value)}
        />
        <button
          className="primary-button"
          onClick={handleAddClick}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload dua'}
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {loadingDuas || loadingFavorites ? (
        <p>Loading duas…</p>
      ) : (
        <>
          {userFavorites.length > 0 && favoriteDuas.length > 0 && (
            <>
              <h3 className="dua-section-title">Your favorites</h3>
              <div className="dua-row">
                {favoriteDuas.map(renderDuaCard)}
              </div>
            </>
          )}

          <h3 className="dua-section-title">All duas</h3>
          <div className="dua-grid">
            {duas.length === 0 && (
              <p className="dua-empty">No duas yet. Add the first one.</p>
            )}
            {otherDuas.map(renderDuaCard)}
          </div>
        </>
      )}

      {selectedDua && (
        <div className="dua-modal" onClick={closeModal}>
          <div
            className="dua-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selectedDua.imageUrl}
              alt="dua full"
              className="dua-modal-image"
            />
            <div className="dua-modal-caption">
              {selectedDua.caption || 'Dua image'}
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}