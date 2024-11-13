import React, { useEffect, useState } from 'react';
import { getQuestionsByMeetingId, getReportsByMeetingId, getReportsByQuestionId } from '../utils/api';
import WordCloud from '../components/WordCloud';
import TopicAnalysis from '../components/TopicAnalysis';
import SentimentAnalysis from '../components/SentimentAnalysis';
import EmbeddingVisualization from '../components/EmbeddingVisualization';
import PreferenceChart from '../components/PreferenceChart';
import '../css/ResultsPage.css';

const ResultsPage = ({ meetingId = 1 }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Overall');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [reports, setReports] = useState([]);
  const [questionType, setQuestionType] = useState(null);

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
          setQuestionType(null);
          setSelectedQuestionId(null);
        } else {
          const selectedQuestion = questions.find(q => q.content === selectedTab);
          if (selectedQuestion) {
            setQuestionType(selectedQuestion.type);
            setSelectedQuestionId(selectedQuestion.questionId);
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
        <h2 className="meeting-title">몽투와 함께하는 일상을 체험해보세요!</h2>
      </header>
      <nav>
        <button onClick={() => setSelectedTab('Overall')}>전체</button>
        {questions.map((question) => (
          <button key={question.questionId} onClick={() => setSelectedTab(question.content)}>
            {question.content || "Untitled"}
          </button>
        ))}
      </nav>

      <div>
        {selectedTab === 'Overall' ? (
          <OverallAnalysis reports={reports} />
        ) : (
          <QuestionAnalysis reports={reports} questionType={questionType} questionId={selectedQuestionId} />
        )}
      </div>
    </div>
  );
};

const OverallAnalysis = ({ reports }) => {
  const wordcloudData = reports.find(report => report.analysisType === 'wordcloud');
  const topicData = reports.find(report => report.analysisType === 'topicAnalysis');
  const sentimentData = reports.find(report => report.analysisType === 'sentimentAnalysis');

  return (
    <div>
      {wordcloudData && <WordCloud imageSrc={wordcloudData.analysisResult} />}
      {topicData && <TopicAnalysis topicData={JSON.parse(topicData.analysisResult)} />}
      {sentimentData && <SentimentAnalysis sentimentData={JSON.parse(sentimentData.analysisResult)} />}
    </div>
  );
};

const QuestionAnalysis = ({ reports, questionType, questionId }) => {
  const wordcloudData = reports.find(report => report.analysisType === 'wordcloud');
  const topicData = reports.find(report => report.analysisType === 'topicAnalysis');
  const sentimentData = reports.find(report => report.analysisType === 'sentimentAnalysis');
  const embeddingData = reports.find(report => report.analysisType === 'embeddingAnalysis');

  const preferenceResponses = reports.filter(report => report.analysisType === 'preferenceAnswer');
  const preferenceCounts = preferenceResponses.reduce((acc, { content }) => {
    acc[content] = (acc[content] || 0) + 1;
    return acc;
  }, {});

  const preferenceChartData = {
    labels: Object.keys(preferenceCounts),
    datasets: [
      {
        label: '선택한 인원 수',
        data: Object.values(preferenceCounts),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div>
      {wordcloudData && <WordCloud imageSrc={wordcloudData.analysisResult} />}
      {topicData && <TopicAnalysis topicData={JSON.parse(topicData.analysisResult)} />}
      {sentimentData && <SentimentAnalysis sentimentData={JSON.parse(sentimentData.analysisResult)} />}
      {embeddingData && <EmbeddingVisualization tensorBoardUrl={embeddingData.analysisResult} />}
      
      {questionType === 'PREFERENCE' && questionId && (
        <PreferenceChart preferenceData={preferenceChartData} questionId={questionId} />
      )}
    </div>
  );
};

export default ResultsPage;
