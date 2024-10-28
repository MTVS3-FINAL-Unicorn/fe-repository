import axios from 'axios';

export const fetchReportData = async () => {
  try {
    const response = await axios.get('/api/report-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching report data:', error);
    return null;
  }
};
