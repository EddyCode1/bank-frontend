/**
 * Página principal de horarios de servicios
 */

import { useEffect, useState } from 'react';
import { ScheduleTable } from '../components';
import { SERVICE_SCHEDULES, SCHEDULE_DAYS } from '../constants/scheduleData';
import './SchedulePage.css';

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadSchedules = () => {
      try {
        setSchedules(SERVICE_SCHEDULES);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar horarios:', error);
        setLoading(false);
      }
    };

    const timer = setTimeout(loadSchedules, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="schedule-page">
      <div className="page-header">
        <h1>Horarios de Servicios</h1>
        <p>Consulta los horarios disponibles para nuestros servicios en línea</p>
      </div>

      <div className="schedule-info">
        <div className="info-card">
          <div className="info-icon">📅</div>
          <div className="info-content">
            <h3>Disponibilidad</h3>
            <p>{SCHEDULE_DAYS.join(' ')}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="schedule-loading">
          <div className="spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      ) : (
        <ScheduleTable schedules={schedules} />
      )}

      <div className="schedule-footer">
        <div className="footer-note">
          <h4>Nota importante</h4>
          <p>
            Los horarios pueden cambiar según mantenimiento del sistema. Para información
            actualizada, contáctanos a través de BI Chat o nuestras líneas de atención al cliente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
