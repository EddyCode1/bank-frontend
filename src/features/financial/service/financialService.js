/**
 * Servicio simulado de datos financieros para tarjetas y préstamos
 */

import {
  CREDIT_CARDS,
  LOANS,
  FINANCIAL_HISTORY,
} from '../constants/financialData';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const filterHistory = (history, filters) => {
  const { startDate, endDate, type, currency, status, search } = filters || {};

  return history.filter((item) => {
    const date = new Date(item.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    const matchesType = type && type !== 'Todos' ? item.type === type : true;
    const matchesCurrency = currency && currency !== 'Todos' ? item.currency === currency : true;
    const matchesStatus = status && status !== 'Todos' ? item.status === status : true;
    const matchesSearch = search
      ? item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      : true;

    return afterStart && beforeEnd && matchesType && matchesCurrency && matchesStatus && matchesSearch;
  });
};

export const financialService = {
  getCreditCards: async () => {
    await delay(200);
    return { success: true, data: CREDIT_CARDS };
  },
  getLoans: async () => {
    await delay(200);
    return { success: true, data: LOANS };
  },
  getFinancialHistory: async (filters = {}) => {
    await delay(200);
    return {
      success: true,
      data: filterHistory(FINANCIAL_HISTORY, filters),
    };
  },
};
