
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../auth/store/useAuthStore';
import { authService } from '../../auth/service/authService';
import defaultProfile from '../../../assets/default-profile.png';
import { resizeImageToDataUrl } from '../../../shared/utils/resizeProfileImage';
import { useForm } from 'react-hook-form';
import { publicClient } from '../../../shared/api/adminClient';

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

  const [photoSrc, setPhotoSrc] = useState(user?.profilePicture?.trim() ? user.profilePicture : defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPhotoSrc(user?.profilePicture?.trim() ? user.profilePicture : defaultProfile);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user?.profilePicture]);

  // Formulario react-hook-form
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      nombre: user?.nombre || '',
      username: user?.username || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      trabajo: user?.trabajo || '',
      ingresoMensual: user?.ingresoMensual ?? '',
    },
    mode: 'onBlur',
  });

  // Sincroniza valores del usuario al cambiar
  useEffect(() => {
    reset({
      nombre: user?.nombre || '',
      username: user?.username || '',
      email: user?.email || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
      trabajo: user?.trabajo || '',
      ingresoMensual: user?.ingresoMensual ?? '',
    });
  }, [user, reset]);

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

  // Guardar cambios de perfil
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // UserProfileController: PUT /api/v1/users/me
      // UpdateProfileDto permite Name, Surname, Phone, Address, WorkName, MonthlyIncome.
      const nameParts = String(data.nombre || '').trim().split(/\s+/)
      const payload = {
        name: nameParts[0] || undefined,
        surname: nameParts.slice(1).join(' ') || undefined,
        phone: data.telefono || undefined,
        address: String(data.direccion || '').trim() || undefined,
        workName: String(data.trabajo || '').trim() || undefined,
        monthlyIncome:
          data.ingresoMensual !== '' && data.ingresoMensual != null
            ? Number(data.ingresoMensual)
            : undefined,
      }
      const response = await publicClient.put('/users/me', payload);
      if (!response.data?.success) {
        toast.error(response.data?.message || 'No se pudo actualizar el perfil');
        return
      }

      const refreshedProfile = await authService.getCurrentUser()
      if (refreshedProfile.success && refreshedProfile.user) {
        patchUser(refreshedProfile.user)
      } else {
        patchUser({
          ...user,
          nombre: data.nombre,
          telefono: data.telefono,
          direccion: data.direccion,
          trabajo: data.trabajo,
          ingresoMensual:
            data.ingresoMensual !== '' && data.ingresoMensual != null
              ? Number(data.ingresoMensual)
              : null,
        })
      }
      toast.success('Perfil actualizado correctamente');
      setEditMode(false);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al actualizar perfil';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Cuenta</p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--text)] sm:text-3xl">Mi perfil</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Consulta y edita tus datos personales. La foto se guarda en este navegador y se recupera al volver a iniciar sesión con la misma cuenta.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div
          id="profile-photo"
          ref={photoSectionRef}
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Foto de perfil</h2>
          <div className="mt-4 flex justify-center">
            <img
              src={photoSrc}
              alt="Foto de perfil"
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
          <p className="mt-3 text-center text-xs text-[var(--muted)]">Se guarda localmente (JPEG optimizado).</p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            Datos personales
            {!editMode && (
              <button
                className="ml-2 rounded-lg border border-[var(--primary)] px-3 py-1 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
                onClick={() => setEditMode(true)}
                type="button"
              >
                Editar
              </button>
            )}
          </h2>
          {editMode ? (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Nombre</label>
                <input
                  type="text"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.nombre ? 'border-red-500' : 'border-[var(--border)]'} focus:border-[var(--primary)]`}
                  disabled={loading}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Usuario</label>
                <input
                  type="text"
                  value={user?.username || ''}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--gris-claro-fondo)] px-3 py-2 text-sm text-[var(--muted)]"
                />
                <p className="mt-1 text-xs text-[var(--muted)]">Este campo no es editable.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Correo</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--gris-claro-fondo)] px-3 py-2 text-sm text-[var(--muted)]"
                />
                <p className="mt-1 text-xs text-[var(--muted)]">Este campo no es editable.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Teléfono</label>
                <input
                  type="tel"
                  {...register('telefono', {
                    pattern: {
                      value: /^[0-9\-\s+()]{7,20}$/,
                      message: 'Teléfono inválido',
                    },
                  })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.telefono ? 'border-red-500' : 'border-[var(--border)]'} focus:border-[var(--primary)]`}
                  disabled={loading}
                />
                {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Dirección</label>
                <input
                  type="text"
                  {...register('direccion', {
                    maxLength: {
                      value: 180,
                      message: 'La dirección no puede exceder 180 caracteres',
                    },
                  })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.direccion ? 'border-red-500' : 'border-[var(--border)]'} focus:border-[var(--primary)]`}
                  disabled={loading}
                />
                {errors.direccion && <p className="text-xs text-red-500 mt-1">{errors.direccion.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Lugar de trabajo</label>
                <input
                  type="text"
                  {...register('trabajo', {
                    maxLength: {
                      value: 120,
                      message: 'El lugar de trabajo no puede exceder 120 caracteres',
                    },
                  })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.trabajo ? 'border-red-500' : 'border-[var(--border)]'} focus:border-[var(--primary)]`}
                  disabled={loading}
                />
                {errors.trabajo && <p className="text-xs text-red-500 mt-1">{errors.trabajo.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)]">Ingreso mensual</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('ingresoMensual', {
                    min: {
                      value: 0,
                      message: 'El ingreso mensual no puede ser negativo',
                    },
                  })}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.ingresoMensual ? 'border-red-500' : 'border-[var(--border)]'} focus:border-[var(--primary)]`}
                  disabled={loading}
                />
                {errors.ingresoMensual && <p className="text-xs text-red-500 mt-1">{errors.ingresoMensual.message}</p>}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4A4BE0] disabled:opacity-60"
                  disabled={loading || !isDirty}
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-slate-100"
                  onClick={() => { setEditMode(false); reset(); }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
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
                <dd className="break-all text-sm font-semibold text-[var(--text)]">{user?.email || '—'}</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
                <dt className="text-sm font-medium text-[var(--muted)]">Teléfono</dt>
                <dd className="text-sm font-semibold text-[var(--text)]">{user?.telefono || '—'}</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
                <dt className="text-sm font-medium text-[var(--muted)]">Dirección</dt>
                <dd className="text-sm font-semibold text-[var(--text)]">{user?.direccion || '—'}</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
                <dt className="text-sm font-medium text-[var(--muted)]">Lugar de trabajo</dt>
                <dd className="text-sm font-semibold text-[var(--text)]">{user?.trabajo || '—'}</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[var(--border)] pb-4 sm:flex-row sm:justify-between">
                <dt className="text-sm font-medium text-[var(--muted)]">Ingreso mensual</dt>
                <dd className="text-sm font-semibold text-[var(--text)]">
                  {user?.ingresoMensual != null && user?.ingresoMensual !== ''
                    ? Number(user.ingresoMensual).toLocaleString('es-GT', {
                        style: 'currency',
                        currency: 'GTQ',
                        maximumFractionDigits: 2,
                      })
                    : '—'}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <dt className="text-sm font-medium text-[var(--muted)]">Rol</dt>
                <dd className="text-sm font-semibold text-[var(--text)]">{user?.rol || '—'}</dd>
              </div>
            </dl>
          )}
        </div>
      </section>
    </div>
  );
}
