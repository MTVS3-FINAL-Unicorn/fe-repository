import React, { useEffect, useState } from 'react';
import { getQuestionsByMeetingId, getReportsByMeetingId, getReportsByQuestionId } from '../utils/api';
import WordCloud from '../components/WordCloud';
import TopicAnalysis from '../components/TopicAnalysis';
import SentimentAnalysis from '../components/SentimentAnalysis';
import DetailedContent from '../components/DetailedContent';
import '../css/ResultsPage.css';

const ResultsPage = ({ meetingId = 1 }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Overall');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await getQuestionsByMeetingId(meetingId);
      setQuestions(data);
    };

    fetchQuestions();
  }, [meetingId]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (selectedTab === 'Overall') {
          const data = await getReportsByMeetingId(meetingId);
          setReports(data);
        } else {
          const selectedQuestion = questions.find((q) => q.content === selectedTab);
          if (selectedQuestion) {
            const data = await getReportsByQuestionId(selectedQuestion.questionId);
            setReports(data);
          }
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [selectedTab, meetingId, questions]);

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="company-name">Burden</h1>
        <nav className="nav-bar">
          <div
            className={`nav-item ${selectedTab === 'Overall' ? 'active' : ''}`}
            onClick={() => setSelectedTab('Overall')}
          >
            전체 분석
          </div>
          <div
            className={`nav-item ${selectedTab === 'Detailed' ? 'active' : ''}`}
            onClick={() => setSelectedTab('Detailed')}
          >
            스크립트 분석
          </div>
        </nav>
      </header>
      <div className="content">
        {selectedTab === 'Overall' ? (
          <OverallAnalysis reports={reports} />
        ) : (
          <DetailedContent />
        )}
      </div>
    </div>
  );
};

const OverallAnalysis = ({ reports }) => {
  const wordcloudData = reports.find((report) => report.analysisType === 'wordcloud');
  const topicData = reports.find((report) => report.analysisType === 'topicAnalysis');
  const sentimentData = reports.find((report) => report.analysisType === 'sentimentAnalysis');

  return (
    <div>
      {wordcloudData && <WordCloud imageSrc={wordcloudData.analysisResult} />}
      {topicData && (
        <TopicAnalysis data={JSON.parse(topicData.analysisResult)} />
      )}
      {sentimentData && (
        <SentimentAnalysis sentimentData={JSON.parse(sentimentData.analysisResult)} />
      )}
    </div>
  );
};

export default ResultsPage;
