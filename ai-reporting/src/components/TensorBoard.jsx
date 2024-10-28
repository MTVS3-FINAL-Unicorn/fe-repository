import React from 'react';
import { dummyData } from '../data/dummydata';
import image from '../assets/인터뷰분석 기술 정리.png';

const TensorBoardView = () => {
  return (
    <>
      <h2>TensorBoard View</h2>
      <img src={image} alt="인터뷰분석 기술 정리" />
      {/* Placeholder for TensorFlow.js integration */}
      
      {/* <pre>{JSON.stringify(dummyData.tensorData, null, 2)}</pre> */}
    </>
  );
};

export default TensorBoardView;
