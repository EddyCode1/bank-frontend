import { useState, useRef, useEffect } from 'react'
import './ProfileButton.css'
import defaultProfile from '/src/assets/default-profile.png'

const ProfileButton = ({ imageUrl, email, onEditProfile, onLogout, onChangePhoto }) => {
  const [open, setOpen] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(imageUrl?.trim() ? imageUrl : defaultProfile)
  const ref = useRef()

  useEffect(() => {
    setAvatarSrc(imageUrl?.trim() ? imageUrl : defaultProfile)
  }, [imageUrl])

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
        <img
          src={avatarSrc}
          alt=""
          className="profile-img"
          onError={() => setAvatarSrc(defaultProfile)}
        />
      </button>
      {open && (
        <div className="profile-dropdown profile-dropdown-wide">
          {/* Correo arriba */}
          {email && <div className="profile-dropdown-email">{email}</div>}
          {/* Foto de perfil */}
          <img
            src={avatarSrc}
            alt=""
            className="profile-dropdown-img"
            onError={() => setAvatarSrc(defaultProfile)}
          />
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
