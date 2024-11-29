import React, { useState, useEffect } from 'react';
import { getQuestionsByMeetingId, getReportsByQuestionId, getPreferenceAnswers } from '../utils/api';
import EachWordCloud from '../components/EachWordCloud';
import EachTopicAnalysis from '../components/EachTopicAnalysis';
import EachEmbeddingVisualization from '../components/EachEmbeddingVisualization';
import EachSentimentAnalysis from '../components/EachSentimentAnalysis';
import PreferenceChart from '../components/PreferenceChart';

const typeMapping = {
  VOICE: '음성형',
  TEXT: '설문형',
  PREFERENCE: '선호도형',
};

const DetailedContent = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [reports, setReports] = useState([]);
  const [preferenceAnswers, setPreferenceAnswers] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const meetingId = 1;

        // 질문 가져오기
        const questionsData = await getQuestionsByMeetingId(meetingId);
        setQuestions(questionsData);

        // 텐서보드 데이터 가져오기
        const embeddingReport = await getReportsByQuestionId(meetingId);
        const embeddingAnalysis = embeddingReport.find(
          (report) => report.analysisType === 'embeddingAnalysis'
        );
        if (embeddingAnalysis) {
          setEmbeddingData(embeddingAnalysis.analysisResult); // 텐서보드 URL 설정
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleQuestionClick = async (id, type) => {
    if (selectedQuestion === id) {
      setSelectedQuestion(null);
      setReports([]);
      setPreferenceAnswers(null);
      return;
    }

    try {
      setSelectedQuestion(id);
      if (type === 'PREFERENCE') {
        // Fetch preference answers for PREFERENCE type questions
        const preferenceData = await getPreferenceAnswers(id);
        setPreferenceAnswers(preferenceData);
        setReports([]); // Clear previous reports since this type only shows answers
      } else {
        // Fetch analysis reports for other question types
        const data = await getReportsByQuestionId(id);
        setReports(data);
        setPreferenceAnswers(null); // Clear previous answers
      }
    } catch (error) {
      console.error('Failed to fetch reports for question:', error);
    }
  };

  // 질문과 답변 데이터
  const answers = {
    1: [
      '버든백은 심플한 디자인 덕분에 어떤 옷에도 잘 어울립니다. 또 가벼우면서도 내구성이 뛰어나 외출할 때 항상 들고 나가요.',
      '학생으로서 많은 짐을 들고 다니는데, 버든백은 크기가 적당하고 튼튼해서 정말 좋아요. 특히, 원단이 업사이클링 소재라는 점이 멋있습니다.',
      '아이들과 공원에 갈 때 물, 간식, 옷가지를 넣어도 공간이 넉넉해서 만족스러웠습니다. 무엇보다도 세탁하기 쉬운 소재라는 점이 정말 편리했어요.',
      '가방 하나로 스타일링을 완성할 수 있어 자주 사용합니다. 또한, 환경을 생각하는 브랜드라는 점에서 구매에 대한 자부심을 느껴요.',
      '버든백은 비 오는 날에도 내용물이 젖지 않아 좋았어요. 원단 자체가 방수 기능이 있어 가방 안의 책과 물건을 안전하게 지켜줍니다.',
      '매일 노트북을 넣고 출퇴근을 하는데, 스트랩이 튼튼하고 어깨에 무리가 가지 않아서 좋습니다.',
      '버든백은 튼튼한 소재 덕분에 짐이 많아도 형태가 잘 유지됩니다. 어떤 자리에서도 과하지 않고 세련돼 보입니다.',
      '마트에서 장 본 물건들을 담아도 무겁지 않게 들고 다닐 수 있었습니다. 튼튼한 손잡이가 특히 마음에 들어요.',
    ],
    2: [
      '색상 옵션이 더 다양해졌으면 좋겠어요. 지금의 미니멀한 디자인은 좋지만, 더 밝고 산뜻한 색상도 있었으면 합니다.',
      '가방 내부에 더 많은 수납 공간이나 작은 포켓이 추가되면 좋을 것 같아요. 노트북 외에 작은 물건을 정리하기가 조금 아쉬웠습니다.',
      '아이들과 함께 사용할 수 있는 더 큰 크기의 버든백이 출시된다면 좋겠습니다.',
      '버든백의 소재에 대한 상세한 설명이 라벨이나 태그에 추가되면 좋겠어요. 업사이클링 과정에 대해 더 알고 싶습니다.',
      '스트랩 길이를 조절할 수 있는 기능이 있다면 더 많은 사람들이 편리하게 사용할 수 있을 것 같아요.',
      '내부에 방수 처리된 포켓이 추가되면 좋겠습니다. 텀블러나 물병을 넣을 때 유용할 것 같아요.',
      '가방 외부에 작은 포켓이 있다면 지갑이나 열쇠 같은 자주 사용하는 물건을 쉽게 꺼낼 수 있을 것 같습니다.',
      '가방 하단에 더 단단한 보강이 있으면 장을 볼 때 더 안정감 있게 사용할 수 있을 것 같아요.',
    ],
    4: [
      '버든백 제작 과정을 소개하는 영상.',
      '내구성 테스트 및 인증 자료.',
      '가족을 위한 활용 팁.',
      '환경 보호와 관련된 캠페인 기록.',
      '재활용 소재 사용 데이터.',
      '실제 사용 사례와 고객 리뷰.',
      '업사이클링 과정과 경제적 효과.',
      '다른 브랜드와의 협업 사례.',
    ],
    6: [
      '지속 가능한 소비를 위한 우리의 작은 실천이 환경에 큰 변화를 줄 수 있다는 메시지를 전달한다고 생각합니다.',
      '업사이클링이라는 개념이 얼마나 세련되고 실용적일 수 있는지를 보여줍니다.',
      '환경을 위한 선택이 일상 속에서도 가능하다는 희망을 줍니다.',
      '스타일과 실용성을 포기하지 않아도 환경을 보호할 수 있다는 강력한 메시지입니다.',
      '나의 소비가 곧 지구를 위한 행동이라는 중요한 가치를 느끼게 해줍니다.',
      '환경 보호는 누구나 쉽게 실천할 수 있다는 것을 알려줍니다.',
      '친환경적인 선택이 특별하지 않고, 당연한 소비의 일환이 될 수 있음을 보여줍니다.',
      '아이들에게도 환경 보호의 중요성을 자연스럽게 알릴 수 있는 기회가 됩니다.',
    ],
  };

  // 분석 데이터
  const analysisData = {
  1: {
    title: "버든백 사용 경험",
    analysis: "버든백은 가벼움, 내구성, 실용성, 환경 의식을 주요 장점으로 인식되고 있습니다.",
    points: [
      "가벼우면서도 튼튼하고 다양한 스타일에 어울립니다.",
      "넉넉한 공간과 세탁 용이성, 방수 기능이 실용적입니다.",
      "업사이클링 소재 사용으로 환경 보호에 기여하는 느낌을 줍니다.",
      "세련되고 트렌디한 디자인으로 긍정적인 소비자 인식을 형성합니다.",
    ],
    keywords: ["가벼움", "내구성", "환경 보호", "디자인"],
  },
  2: {
    title: "개선 방향",
    analysis: "더 다양한 색상, 수납 공간, 기능적 개선, 크기 선택권이 필요합니다.",
    points: [
      "더 다양한 색상 옵션 제공 필요.",
      "수납 공간 부족 문제 해결.",
      "스트랩 조절 및 방수 포켓 추가.",
      "다양한 크기와 디자인적 다양성 제공.",
    ],
    keywords: ["색상", "수납", "기능성", "사이즈"],
  },
  4: {
    title: "브랜드 정보 요구",
    analysis: "브랜드 신뢰성을 높이기 위해 제작 과정, 내구성 정보, 사용자 가이드 제공이 요구됩니다.",
    points: [
      "제작 과정과 내구성 관련 정보 요청.",
      "고객 리뷰와 환경 캠페인 기록 공유 필요.",
      "다양한 활용 방법 및 관리 방법 안내.",
    ],
    keywords: ["제작 과정", "내구성", "활용 방법"],
  },
  6: {
    title: "브랜드 메시지",
    analysis: "브랜드 메시지를 통해 지속 가능성과 소비자의 사회적 책임을 강조할 필요가 있습니다.",
    points: [
      "환경에 긍정적 영향을 미칠 수 있다는 메시지 전달.",
      "친환경 소비가 일상에서도 실현 가능하다는 점 강조.",
      "환경 문제 해결을 위한 소비자의 역할 인식.",
    ],
    keywords: ["지속 가능성", "실용성", "사회적 책임"],
  },
};

  return (
    <div style={selectedQuestion ? styles.containerExpanded : styles.containerCollapsed}>
      <div style={selectedQuestion ? styles.leftPaneExpanded : styles.leftPaneCollapsed} >
        <h2 style={styles.title}>좌담회 스크립트</h2>
        <ul style={styles.questionList}>
          {questions.map((question) => (
            <li key={question.questionId} style={styles.questionItem}>
              <div style={styles.questionContainer}>
              {/* Question */}
                <p
                  style={styles.question}
                  onClick={() => handleQuestionClick(question.questionId, question.type)}
                >
                  <span>Q. {question.content}</span>
                  <br />
                  <span>({typeMapping[question.type]})</span>
                  <span style={styles.questionAfter}></span>
                </p>
                {/* Note */}
                <span style={styles.note}>
                  *질문을 클릭하면 자세한 분석 내용을 볼 수 있어요!
                </span>
              </div>
              {/* Answers */}
              <ul style={styles.answerList}>
                {answers[question.questionId]?.map((answer, index) => (
                  <li key={index} style={styles.answer}>
                    <div style={styles.answerBubble}>A. {answer}</div>
                    <span style={styles.answerAfter}></span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Analysis Pane */}
      {selectedQuestion && (
        <div style={styles.rightPane}>
          {/* Analysis Data Section */}
          <h2 style={styles.analysisHeader}>분석 내용</h2>
          <div style={styles.analysisContainer}>
            <h3 style={styles.analysisTitle}>
              주제: {analysisData[selectedQuestion]?.title}
            </h3>
            <p style={styles.analysisText}>
              한줄 요약: {analysisData[selectedQuestion]?.analysis}
            </p>
            <div style={styles.section}>
              <h4 style={styles.pointTitle}>주요 내용</h4>
              <ul style={styles.pointList}>
                {analysisData[selectedQuestion]?.points.map((point, index) => (
                  <li key={index} style={styles.pointItem}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.section}>
              <h4 style={styles.pointTitle}>키워드</h4>
              <p style={styles.keywordText}>
                {analysisData[selectedQuestion]?.keywords.join(', ')}
              </p>
            </div>
          </div>
          {/* Chart or Reports */}
          <div style={styles.analysisContent}>
            {preferenceAnswers ? (
              <div>
                <div style={styles.chart}>
                  {/* Pass the selected question ID to PreferenceChart */}
                  <PreferenceChart questionId={selectedQuestion} />
                </div>
              </div>
            ) : (
              reports.map((report) => {
                switch (report.analysisType) {
                  case 'wordcloud':
                    try {
                      const parsedData = JSON.parse(report.analysisResult);
                      return (
                        <EachWordCloud key={report.reportId} data={parsedData} />
                      );
                    } catch (error) {
                      console.error('Failed to parse wordcloud analysis:', error);
                    }
                    break;
                  case 'topicAnalysis':
                    try {
                      const parsedData = JSON.parse(report.analysisResult);
                      return <EachTopicAnalysis key={report.reportId} data={parsedData} />;
                    } catch (error) {
                      console.error('Failed to parse topic analysis:', error);
                    }
                    break;
                  case 'sentimentAnalysis':
                    try {
                      const parsedData = JSON.parse(report.analysisResult);
                      return (
                        <EachSentimentAnalysis
                          key={report.reportId}
                          sentimentData={parsedData}
                        />
                      );
                    } catch (error) {
                      console.error('Failed to parse sentiment analysis:', error);
                    }
                    break;
                  case 'embeddingAnalysis':
                      return (
                        <EachEmbeddingVisualization
                          key={report.reportId}
                          embeddingData={report.analysisResult}
                        />
                      );
                  default:
                    return null;
                }
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 스타일 정의
const styles = {
  container: {
    display: "flex",
    backgroundColor: "#f9f9f9",
  },
  containerCollapsed: {
    display: 'flex',
  },
  containerExpanded: {
    display: 'flex',
  },
  leftPaneCollapsed: {
    width: "97%",
    padding: "20px",
    backgroundColor: "#ffffff",
    overflowY: "auto",
  },
  leftPaneExpanded: {
    width: "30%",
    padding: "10px 20px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #ddd",
    overflowY: "auto",
  },
  rightPane: {
    width: "70%",
    margin: "0 20px",
    padding: "0px 40px",
    backgroundColor: "#ffffff",
    height: "80vh", // 뷰포트 높이에 맞춤
    overflowY: "auto", // 스크롤 가능
    alignSelf: "flex-start",
    position: "sticky", // 플로팅 효과를 위해 sticky 사용
    top: "0px", // 뷰포트 상단에서의 고정 위치
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  questionList: {
    listStyleType: "none",
    padding: "0",
    width: "fit-content",
    margin: "0 auto",
  },
  questionItem: {
    marginBottom: "20px",
    padding: "15px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  question: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    position: 'relative',
    width: 'fit-content',
    maxWidth: '80%',
    textAlign: 'left',
    marginLeft: '0',
    marginRight: 'auto',
    lineHeight: '1.6', // 줄 간격 설정
    whiteSpace: 'normal', // 텍스트 줄바꿈 허용
  },
  questionAfter: {
    content: "''",
    position: "absolute",
    top: "10px",
    left: "-10px",
    width: "0",
    height: "0",
    border: "10px solid transparent",
    borderRightColor: "#000",
    borderLeft: "0",
    marginTop: "-5px",
  },
  note: {
    fontSize: '14px',
    color: '#888',
    marginLeft: '10px',
  },
  answerList: {
    marginTop: "10px",
    paddingLeft: "0",
    listStyleType: "none", // 불릿 제거
  },
  answer: {
    backgroundColor: "#f0f0f0", // 밝은 배경
    color: "#333",             // 어두운 글자색
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    position: "relative",
    width: "fit-content",
    maxWidth: "80%",
    textAlign: "left",
    marginLeft: "auto", // 우측 정렬
    marginRight: "0",
  },
  answerAfter: {
    content: "''",
    position: "absolute",
    top: "10px",
    right: "-10px",
    width: "0",
    height: "0",
    border: "10px solid transparent",
    borderLeftColor: "#f0f0f0", // 말풍선 꼬리 색상
    borderRight: "0",
    marginTop: "-5px",
  },
  analysisContainer: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    margin: "20px auto",
    width: "60%",
  },
  analysisHeader: { 
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    fontSize: "28px",
    paddingBottom: "20px",
  },
  analysisTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
    paddingBottom: "5px",
  },
  analysisText: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.8",
    marginBottom: "20px",
    marginTop: "5px",
  },
  section: {
    marginBottom: "20px",
  },
  pointTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  pointList: {
    listStyleType: "disc",
    marginLeft: "20px",
    padding: "0",
  },
  pointItem: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "10px",
    lineHeight: "1.6",
  },
  keywordText: {
    fontSize: "16px",
    color: "#333",
    lineHeight: "1.8",
    marginTop: "10px",
  },
};

export default DetailedContent;
