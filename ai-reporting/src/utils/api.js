import axios from 'axios';

const API_BASE_URL = 'http://125.132.216.190:319/api/v1/report';

export const getQuestionsByMeetingId = async (meetingId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-questions/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const getReportsByMeetingId = async (meetingId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching overall reports:', error);
    throw error;
  }
};

export const getReportsByQuestionId = async (questionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/question/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question-specific reports:', error);
    throw error;
  }
};

export const getPreferenceAnswers = async (questionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/answer/preference/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching preference answers:', error);
    throw error;
  }
};