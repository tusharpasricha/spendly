import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Parse bank statement file
 */
export const parseStatement = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_URL}/import/parse`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Detect duplicate transactions
 */
export const detectDuplicates = async (transactions: any[]) => {
  return axios.post(`${API_URL}/import/detect-duplicates`, {
    transactions,
  });
};

/**
 * Bulk save transactions
 */
export const bulkSaveTransactions = async (
  transactions: any[],
  accountId: string
) => {
  return axios.post(`${API_URL}/import/save`, {
    transactions,
    accountId,
  });
};

export const importService = {
  parseStatement,
  detectDuplicates,
  bulkSaveTransactions,
};

