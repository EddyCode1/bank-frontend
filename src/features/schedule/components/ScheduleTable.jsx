/**
 * Componente de tabla de horarios de servicios
 */

import React from 'react';
import './ScheduleTable.css';

const ScheduleTable = ({ schedules = [] }) => {
  if (schedules.length === 0) {
    return (
      <div className="schedule-empty-state">
        <p>No hay horarios disponibles en este momento</p>
      </div>
    );
  }

  return (
    <div className="schedule-table-container">
      <table className="schedule-table">
        <thead>
          <tr>
            <th className="schedule-col-service">Servicios</th>
            <th className="schedule-col-hours">Horarios</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <React.Fragment key={schedule.id}>
              <tr className="schedule-row schedule-category-row">
                <td className="schedule-category" colSpan="2">
                  {schedule.category}
                </td>
              </tr>
              {schedule.services.length > 0 ? (
                schedule.services.map((service, serviceIndex) => (
                  <tr key={`${schedule.id}-${serviceIndex}`} className="schedule-row schedule-service-row">
                    <td className="schedule-service">{service}</td>
                    <td className="schedule-hours">
                      {serviceIndex === 0 ? schedule.schedule : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="schedule-row schedule-service-row">
                  <td className="schedule-service">-</td>
                  <td className="schedule-hours">{schedule.schedule}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
