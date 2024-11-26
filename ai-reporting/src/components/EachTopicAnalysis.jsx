import React, { useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js 자동 등록

const TopicAnalysisApp = ({ data }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Extract topics and frequencies
  const { topics, Freq: frequencies } = data.mdsDat;

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Sidebar: List of Topics */}
      <TopicList
        topics={topics}
        frequencies={frequencies}
        onTopicClick={handleTopicClick}
        selectedTopic={selectedTopic}
      />

      {/* Main Section: Details and Visualization */}
      <div style={{ flex: 1 }}>
        {/* Details */}
        {selectedTopic !== null ? (
          <TopicDetails
            topic={selectedTopic}
            tinfo={data.tinfo}
            tokenTable={data['token.table']}
          />
        ) : (
          <p>토픽을 선택하면 상세 정보를 볼 수 있습니다.</p>
        )}

        {/* Visualization */}
        <Visualization
          coords={data.mdsDat}
          selectedTopic={selectedTopic}
        />
      </div>
    </div>
  );
};

const TopicList = ({ topics, frequencies, onTopicClick, selectedTopic }) => (
  <div style={{ width: '200px', border: '1px solid #ddd', padding: '10px' }}>
    <h3>토픽 목록</h3>
    <p>아래 버튼을 눌러 토픽을 선택하세요.</p>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {topics.map((topic, index) => (
        <li key={topic} style={{ marginBottom: '10px' }}>
          <button
            style={{
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: topic === selectedTopic ? '#007bff' : '#f8f9fa',
              color: topic === selectedTopic ? 'white' : 'black',
              border: '1px solid #ddd',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={() => onTopicClick(topic)}
          >
            토픽 {topic} (빈도: {frequencies[index].toFixed(2)})
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const TopicDetails = ({ topic, tinfo }) => {
    // 데이터 유효성 검사
    if (!tinfo || !Array.isArray(tinfo.Term) || !Array.isArray(tinfo.Topic) || !Array.isArray(tinfo.Freq)) {
        return <p>유효한 데이터가 없습니다. 토픽 정보를 다시 확인하세요.</p>;
    }

    // 선택된 토픽의 데이터 필터링
    const filteredTerms = tinfo.Term.filter((_, idx) => tinfo.Topic[idx] === topic);
    const filteredFreq = tinfo.Freq.filter((_, idx) => tinfo.Topic[idx] === topic);
    const filteredLogProb = tinfo.logprob?.filter((_, idx) => tinfo.Topic[idx] === topic) || [];
    const filteredLogLift = tinfo.loglift?.filter((_, idx) => tinfo.Topic[idx] === topic) || [];

    if (filteredTerms.length === 0) {
        return <p>선택한 토픽에 대한 데이터가 없습니다.</p>;
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <h3>토픽 {topic} 상세 정보</h3>
            <p>이 토픽에 포함된 주요 단어와 해당 단어의 중요도 및 로그 확률을 확인하세요.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>단어</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>중요도 (Freq)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>로그 확률 (LogProb)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>로그 리프트 (LogLift)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTerms.map((term, idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{term}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                {filteredFreq[idx]?.toFixed(2) || '-'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                {filteredLogProb[idx]?.toFixed(2) || '-'}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                                {filteredLogLift[idx]?.toFixed(2) || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Visualization = ({ coords, selectedTopic }) => {
  const scatterData = {
    datasets: coords.topics.map((topic, index) => ({
      label: `토픽 ${topic}`,
      data: [{ x: coords.x[index], y: coords.y[index] }],
      backgroundColor: topic === selectedTopic ? '#ff6384' : '#36a2eb',
      borderColor: topic === selectedTopic ? '#ff6384' : '#36a2eb',
      borderWidth: topic === selectedTopic ? 3 : 1,
      pointRadius: topic === selectedTopic ? 10 : 6,
      pointHoverRadius: 12,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        title: { display: true, text: 'PC1 (주요 성분 1)' },
        grid: { color: '#eaeaea' },
      },
      y: { 
        title: { display: true, text: 'PC2 (주요 성분 2)' },
        grid: { color: '#eaeaea' },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `토픽 ${context.dataset.label.split(' ')[1]}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    elements: {
      point: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>토픽 시각화</h3>
      <p>
        이 그래프는 각 토픽의 주요 성분(PC1, PC2)을 시각화한 것입니다. 선택된
        토픽은 강조 표시됩니다.
      </p>
      <div style={{ height: '400px' }}>
        <Scatter data={scatterData} options={options} />
      </div>
    </div>
  );
};

export default TopicAnalysisApp;
