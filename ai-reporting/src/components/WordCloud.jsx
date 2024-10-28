import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { dummyData } from '../data/dummydata';
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


const WordCloud = () => {
  const words = dummyData.wordCloudData.map(word => ({ text: word, value: Math.random() * 100 }));
  
  return (
    <>
      <h2>Word Cloud</h2>
      <ReactWordcloud words={words} />
    </>
  );
};

export default WordCloud;
