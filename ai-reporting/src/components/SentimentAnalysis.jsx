import React from 'react';
import { Pie } from 'react-chartjs-2';
import { dummyData } from '../data/dummydata';
import image1 from '../assets/1.png'
import image2 from '../assets/2.png'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const SentimentAnalysis = () => {
  const data = {
    labels: dummyData.sentimentData.map(item => item.label),
    datasets: [
      {
        data: dummyData.sentimentData.map(item => item.value),
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
      },
    ],
  };

  return (
    <>
      <h2>Sentiment Analysis</h2>
      {/* <Pie data={data} /> */}
      <img src={image1} alt="인터뷰분석 기술 정리" />
      <img src={image2} alt="인터뷰분석 기술 정리" />
    </>
  );
};

export default SentimentAnalysis;
