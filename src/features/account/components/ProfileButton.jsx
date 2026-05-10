
import { useState, useRef, useEffect } from 'react'
import './ProfileButton.css'
import defaultProfile from '/src/assets/default-profile.png';

const ProfileButton = ({ imageUrl, email, onEditProfile, onLogout, onChangePhoto }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-btn-wrapper" ref={ref}>
      <button
        className="profile-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Perfil de usuario"
        type="button"
      >
        {imageUrl && imageUrl.trim() !== '' ? (
          <img src={imageUrl} alt="Perfil" className="profile-img" />
        ) : (
          <img src={defaultProfile} alt="Perfil por defecto" className="profile-img" />
        )}
      </button>
      {open && (
        <div className="profile-dropdown profile-dropdown-wide">
          {/* Correo arriba */}
          {email && <div className="profile-dropdown-email">{email}</div>}
          {/* Foto de perfil */}
          {imageUrl && imageUrl.trim() !== '' ? (
            <img src={imageUrl} alt="Perfil" className="profile-dropdown-img" />
          ) : (
            <img src={defaultProfile} alt="Perfil por defecto" className="profile-dropdown-img" />
          )}
          {/* Cambiar foto */}
          <button className="profile-dropdown-link" onClick={onChangePhoto}>
            Cambiar foto
          </button>
          {/* Gestionar perfil */}
          <button className="profile-dropdown-action" onClick={onEditProfile}>
            Gestionar perfil
          </button>
          {/* Cerrar sesión */}
          <button className="profile-dropdown-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
