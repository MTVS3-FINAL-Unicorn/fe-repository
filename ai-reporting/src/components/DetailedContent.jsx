import React, { useState, useEffect } from 'react';
import { getQuestionsByMeetingId, getReportsByQuestionId, getPreferenceAnswers } from '../utils/api';
import { Bar } from 'react-chartjs-2';
import EachWordCloud from '../components/EachWordCloud';
import EachTopicAnalysis from '../components/EachTopicAnalysis';
import EmbeddingVisualization from '../components/EmbeddingVisualization';
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
    const fetchQuestions = async () => {
      const meetingId = 1;
      try {
        const data = await getQuestionsByMeetingId(meetingId);
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
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

  const analyzePreferenceAnswers = () => {
    const counts = {};
    preferenceAnswers.forEach((answer) => {
      if (counts[answer.content]) {
        counts[answer.content]++;
      } else {
        counts[answer.content] = 1;
      }
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: '응답 개수',
          data: Object.values(counts),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const preferenceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // 질문과 답변 데이터
  const answers = {
    1: [
      '버든 백은 심플한 디자인 덕분에 어떤 옷에도 잘 어울립니다. 또 가벼우면서도 내구성이 뛰어나 외출할 때 항상 들고 나가요.',
      '학생으로서 많은 짐을 들고 다니는데, 버든 백은 크기가 적당하고 튼튼해서 정말 좋아요. 특히, 원단이 업사이클링 소재라는 점이 멋있습니다.',
      '아이들과 공원에 갈 때 물, 간식, 옷가지를 넣어도 공간이 넉넉해서 만족스러웠습니다. 무엇보다도 세탁하기 쉬운 소재라는 점이 정말 편리했어요.',
      '가방 하나로 스타일링을 완성할 수 있어 자주 사용합니다. 또한, 환경을 생각하는 브랜드라는 점에서 구매에 대한 자부심을 느껴요.',
      '버든 백은 비 오는 날에도 내용물이 젖지 않아 좋았어요. 원단 자체가 방수 기능이 있어 가방 안의 책과 물건을 안전하게 지켜줍니다.',
      '매일 노트북을 넣고 출퇴근을 하는데, 스트랩이 튼튼하고 어깨에 무리가 가지 않아서 좋습니다.',
      '버든 백은 튼튼한 소재 덕분에 짐이 많아도 형태가 잘 유지됩니다. 어떤 자리에서도 과하지 않고 세련돼 보입니다.',
      '마트에서 장 본 물건들을 담아도 무겁지 않게 들고 다닐 수 있었습니다. 튼튼한 손잡이가 특히 마음에 들어요.',
    ],
    2: [
      '색상 옵션이 더 다양해졌으면 좋겠어요. 지금의 미니멀한 디자인은 좋지만, 더 밝고 산뜻한 색상도 있었으면 합니다.',
      '가방 내부에 더 많은 수납 공간이나 작은 포켓이 추가되면 좋을 것 같아요. 노트북 외에 작은 물건을 정리하기가 조금 아쉬웠습니다.',
      '아이들과 함께 사용할 수 있는 더 큰 크기의 버든 백이 출시된다면 좋겠습니다.',
      '버든 백의 소재에 대한 상세한 설명이 라벨이나 태그에 추가되면 좋겠어요. 업사이클링 과정에 대해 더 알고 싶습니다.',
      '스트랩 길이를 조절할 수 있는 기능이 있다면 더 많은 사람들이 편리하게 사용할 수 있을 것 같아요.',
      '내부에 방수 처리된 포켓이 추가되면 좋겠습니다. 텀블러나 물병을 넣을 때 유용할 것 같아요.',
      '가방 외부에 작은 포켓이 있다면 지갑이나 열쇠 같은 자주 사용하는 물건을 쉽게 꺼낼 수 있을 것 같습니다.',
      '가방 하단에 더 단단한 보강이 있으면 장을 볼 때 더 안정감 있게 사용할 수 있을 것 같아요.',
    ],
    4: [
      '버든 백 제작 과정을 소개하는 영상.',
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
      question: '버든 백을 사용하며 느낀 가장 큰 장점은?',
      analysis: '사용자들이 심플한 디자인과 내구성을 선호하는 것으로 분석됩니다.',
          point: ['심플한 디자인과 내구성 덕분에 어떤 옷에도 잘 어울리며, 외출 시 항상 사용하기 좋은 가방입니다.',
              '업사이클링 소재로 제작되어 환경을 생각하는 브랜드 가치와 가벼움, 내구성을 동시에 제공합니다.',
              '수납공간과 방수 기능이 뛰어나 실용적이고 다양한 상황에서 편리하게 사용할 수 있습니다.',
            ],
    },
    2: {
      question: '버든 백의 개선 방향은 무엇일까요?',
      analysis: '수납 공간 부족과 스트랩 길이 조정 문제를 개선해야 한다는 의견이 다수입니다.',
      point: ['수납 공간', '스트랩 길이 조정', '사용 편리성'],
      },
    3: {
      question: '버든 백을 사용하며 느낀 가장 큰 장점은?',
      analysis: '사용자들이 심플한 디자인과 내구성을 선호하는 것으로 분석됩니다.',
      point: ['심플한 디자인', '내구성', '다용도'],
    },
    4: {
      question: '버든 백의 개선 방향은 무엇일까요?',
      analysis: '수납 공간 부족과 스트랩 길이 조정 문제를 개선해야 한다는 의견이 다수입니다.',
      point: ['수납 공간', '스트랩 길이 조정', '사용 편리성'],
      },
    5: {
      question: '버든 백을 사용하며 느낀 가장 큰 장점은?',
      analysis: '사용자들이 심플한 디자인과 내구성을 선호하는 것으로 분석됩니다.',
      point: ['심플한 디자인', '내구성', '다용도'],
    },
    6: {
      question: '버든 백의 개선 방향은 무엇일까요?',
      analysis: '수납 공간 부족과 스트랩 길이 조정 문제를 개선해야 한다는 의견이 다수입니다.',
      point: ['수납 공간', '스트랩 길이 조정', '사용 편리성'],
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
          <h3 style={styles.analysisTitle}>
            {selectedQuestion &&
              `Q. ${
                questions.find((q) => q.questionId === selectedQuestion)?.content
              } (${
                typeMapping[questions.find((q) => q.questionId === selectedQuestion)?.type]
              })`}
          </h3>
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
                        <EmbeddingVisualization
                          key={report.reportId}
                          tensorBoardUrl={report.analysisResult}
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
    backgroundColor: "#ffffff",
    height: "80vh", // 뷰포트 높이에 맞춤
    overflowY: "auto", // 스크롤 가능
    alignSelf: "flex-start",
    position: "sticky", // 플로팅 효과를 위해 sticky 사용
    top: "20px", // 뷰포트 상단에서의 고정 위치
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
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  analysisTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    backgroundColor: "#000", // 검정 배경
    color: "#fff",           // 흰색 글씨
    padding: "20px 10px",         // 패딩 추가
    textAlign: "center",     // 텍스트 중앙 정렬
  },
  analysisText: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  analysisContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  pointTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  pointList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  pointItem: {
    backgroundColor: "#ffffff",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default DetailedContent;
