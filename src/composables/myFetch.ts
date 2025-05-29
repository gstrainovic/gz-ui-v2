import config from './config';

const formatDateWithTime = (date: Date, time: 'start' | 'end'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
  const day = String(date.getDate()).padStart(2, '0');
  const hours = time === 'start' ? '00' : '23';
  const minutes = time === 'start' ? '00' : '59';
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const createQueryString = (queryList: { [key: string]: string }[]): string => {
  if (queryList.length === 0) {
    return '';
  }
  return `?${queryList.map((query) => {
    const key = Object.keys(query)[0];
    const value = query[key];
    return `${key}=${value}`;
  }).join('&')}`;
};

export const useMyFetch = () => {
  const token = useCookie('token'); // Token aus dem Cookie abrufen

  const fetchWithAuth = async (endpoint: string, queryList: {}[] = [], body: {} | null = null) => {
    endpoint += createQueryString(queryList);
    try {
      const response = await $fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token.value}`, // Token im Header verwenden
          'Content-Type': 'application/json'
        },
        method: body ? 'POST' : 'GET',
        body: body ? JSON.stringify(body) : null
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  };

  const getFehler = async (fromDate: Date, toDate: Date, usernames: string[]) => {
    const from = formatDateWithTime(fromDate, 'start');
    const to = formatDateWithTime(toDate, 'end');
    const body = { from, to, usernames };
    const fehlerResult = await fetchWithAuth(`${config.api.url}details`, [], body);
    return fehlerResult;
  };

  const getQuoten = async (fromDate: Date, toDate: Date, usernames: string[]) => {
    const from = formatDateWithTime(fromDate, 'start');
    const to = formatDateWithTime(toDate, 'end');
    const body = { from, to, usernames };
    const getQuotenResult = await fetchWithAuth(`${config.api.url}quoten`, [], body);
    return getQuotenResult;
  };

  const getPerformance = async (fromDate: Date, toDate: Date, usernames: string[], interval: string) => {
    const from = formatDateWithTime(fromDate, 'start');
    const to = formatDateWithTime(toDate, 'end');
    const body = { from, to, usernames, interval };
    return await fetchWithAuth(`${config.api.url}performance`, [], body);
  };

  const getUsersProd = async () => {
    return await fetchWithAuth(`${config.api.strapi}users`);
  };

  return {
    getFehler,
    getQuoten,
    getPerformance,
    getUsersProd
  };
};
