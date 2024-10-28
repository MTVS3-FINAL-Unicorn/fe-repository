import React from 'react';
import WordCloud from '../components/WordCloud';
import TopicAnalysis from '../components/TopicAnalysis';
import SentimentAnalysis from '../components/SentimentAnalysis';
import TensorBoardView from '../components/TensorBoard';
import '../css/Dashboard.css';

const Dashboard = () => (
  <div className="dashboard">
    <h1>좌담회 결과 분석</h1>
    <div className="dashboard-content">
      <div className="dashboard-card">
        <WordCloud />
      </div>
      <div className="dashboard-card">
        <TopicAnalysis />
      </div>
      <div className="dashboard-card">
        <SentimentAnalysis />
      </div>
      <div className="dashboard-card">
        <TensorBoardView />
      </div>
    </div>
  </div>
);

export default Dashboard;
