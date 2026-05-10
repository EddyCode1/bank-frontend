import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuthStore from '../../auth/store/useAuthStore'
import { authService } from '../../auth/service/authService'
import defaultProfile from '/src/assets/default-profile.png'
import { resizeImageToDataUrl } from '../../../shared/utils/resizeProfileImage'

/**
 * Perfil del usuario: datos de sesión y foto persistida en este dispositivo (localStorage).
 */
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const patchUser = useAuthStore((s) => s.patchUser)
  const [searchParams] = useSearchParams()
  const photoSectionRef = useRef(null)

  useEffect(() => {
    if (searchParams.get('editPhoto') === '1' && photoSectionRef.current) {
      photoSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [searchParams])

  const [photoSrc, setPhotoSrc] = useState(user?.profilePicture?.trim() ? user.profilePicture : defaultProfile)

  useEffect(() => {
    setPhotoSrc(user?.profilePicture?.trim() ? user.profilePicture : defaultProfile)
  }, [user?.profilePicture])

  useEffect(() => {
    let mounted = true

    // Sincroniza perfil completo desde backend para evitar campos vacios tras hidratar sesión vieja.
    const syncProfileFromBackend = async () => {
      const result = await authService.getCurrentUser()
      if (!mounted || !result.success || !result.user) return
      patchUser(result.user)
    }

    void syncProfileFromBackend()
    return () => {
      mounted = false
    }
  }, [patchUser])

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona un archivo de imagen')
      return
    }

    try {
      const dataUrl = await resizeImageToDataUrl(file, 512, 0.82)
      patchUser({ profilePicture: dataUrl })
      setPhotoSrc(dataUrl)
      toast.success('Foto guardada en este dispositivo')
    } catch (err) {
      toast.error(err?.message || 'No se pudo procesar la imagen')
    }

    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Cuenta
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text)] sm:text-3xl">Mi perfil</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Consulta tus datos y cambia tu foto. La imagen se guarda en este navegador y se recupera al
          volver a iniciar sesión con la misma cuenta.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div
          id="profile-photo"
          ref={photoSectionRef}
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            Foto de perfil
          </h2>
          <div className="mt-4 flex justify-center">
            <img
              src={photoSrc}
              alt=""
              className="h-36 w-36 rounded-2xl border border-[var(--border)] object-cover shadow-sm"
              onError={() => setPhotoSrc(defaultProfile)}
            />
          </div>
          <label className="mt-6 flex cursor-pointer justify-center">
            <span className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              Cambiar foto
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
          <p className="mt-3 text-center text-xs text-[var(--muted)]">
            Se guarda localmente (JPEG optimizado).
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-[var(--text)]">Datos personales</h2>
          <dl className="mt-6 space-y-4">
            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-[var(--muted)]">Nombre</dt>
              <dd className="text-sm font-semibold text-[var(--text)]">{user?.nombre || '—'}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-[var(--muted)]">Usuario</dt>
              <dd className="text-sm font-semibold text-[var(--text)]">{user?.username || '—'}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-[var(--muted)]">Correo</dt>
              <dd className="break-all text-sm font-semibold text-[var(--text)]">
                {user?.email || '—'}
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-[var(--muted)]">Teléfono</dt>
              <dd className="text-sm font-semibold text-[var(--text)]">{user?.telefono || '—'}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-[var(--muted)]">Rol</dt>
              <dd className="text-sm font-semibold text-[var(--text)]">{user?.rol || '—'}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}
