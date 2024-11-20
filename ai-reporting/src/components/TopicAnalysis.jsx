import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const TopicAnalysis = ({ data }) => {
  const [selectedTopic, setSelectedTopic] = useState(0); // 기본 선택 토픽
  const [lambda, setLambda] = useState(1); // 관련성 조정 슬라이더 값
  const svgRef = useRef();
  const barChartRef = useRef();

  // 사용자 정의 폰트 적용
  useEffect(() => {
    const fontStyle = document.createElement("style");
    fontStyle.innerHTML = `
      @font-face {
        font-family: 'Paperlogy';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
      }
      body {
        font-family: 'Paperlogy', sans-serif;
      }
    `;
    document.head.appendChild(fontStyle);
  }, []);

  const getTopicSummary = (topicIndex) => {
    const terms = data.tinfo.Term.filter((_, i) => data.tinfo.Category[i] === `Topic${topicIndex + 1}`);
    const frequencies = terms.map((term, i) => ({
      term,
      freq: data.tinfo.Freq[i],
    }));

    const sortedTerms = frequencies.sort((a, b) => b.freq - a.freq).slice(0, 5); // 상위 5개 단어
    return sortedTerms.map((t) => t.term).join(", "); // 단어를 ","로 연결
  };

  useEffect(() => {
  if (!data.mdsDat || !data.tinfo) {
    console.error("유효하지 않은 데이터입니다.");
    return;
  }

  const { mdsDat } = data;
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove(); // 기존 내용 초기화

  const width = 400;
  const height = 400;
  const margin = 20;

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(mdsDat.x) - 0.2, d3.max(mdsDat.x) + 0.2])
    .range([margin, width - margin]);
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(mdsDat.y) - 0.2, d3.max(mdsDat.y) + 0.2])
    .range([height - margin, margin]);

  const colorScale = d3.scaleLinear()
    .domain([0, d3.max(mdsDat.Freq)])
    .range(["#A5D8FF", "#B2F2BB"]);

  const rScale = d3.scaleLinear()
    .domain([0, d3.max(mdsDat.Freq)])
    .range([15, 52.5]);

  // 툴팁 생성 (중복 생성 방지)
  let tooltip = d3.select(".tooltip");
  if (tooltip.empty()) {
    tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)")
      .style("pointer-events", "none")
      .style("opacity", 0);
  }

  svg
    .selectAll("circle")
    .data(mdsDat.topics)
    .enter()
    .append("circle")
    .attr("cx", (_, i) => xScale(mdsDat.x[i]))
    .attr("cy", (_, i) => yScale(mdsDat.y[i]))
    .attr("r", (_, i) => rScale(mdsDat.Freq[i]))
    .attr("fill", (_, i) => (i === selectedTopic ? "#4CAF50" : colorScale(mdsDat.Freq[i])))
    .attr("opacity", (_, i) => (i === selectedTopic ? 1 : 0.7))
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .on("mouseover", function (event, d) {
      const topicIndex = mdsDat.topics.indexOf(d);
      tooltip
        .style("opacity", 1)
        .html(`토픽 ${topicIndex + 1}<br>빈도: ${mdsDat.Freq[topicIndex].toFixed(2)}%`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
      d3.select(this).attr("stroke", "orange").attr("stroke-width", 2); // 강조 효과
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`);
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0).style("left", `-9999px`).style("top", `-9999px`);
      d3.select(this).attr("stroke", "black").attr("stroke-width", 1); // 원래 상태로 복구
    })
    .on("click", function (event, d) {
      const topicIndex = mdsDat.topics.indexOf(d); // 클릭된 데이터의 인덱스
      setSelectedTopic(topicIndex); // 선택된 토픽 업데이트
    });

  svg
    .selectAll("text")
    .data(mdsDat.topics)
    .enter()
    .append("text")
    .attr("x", (_, i) => xScale(mdsDat.x[i]))
    .attr("y", (_, i) => yScale(mdsDat.y[i]) - rScale(mdsDat.Freq[i]) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-family", "Paperlogy")
    .text((_, i) => `토픽 ${mdsDat.topics[i]} (${mdsDat.Freq[i].toFixed(1)}%)`);
}, [data, selectedTopic]);


  useEffect(() => {
    if (!data.tinfo) {
      console.error("유효하지 않은 데이터입니다.");
      return;
    }

    const terms = data.tinfo.Term.filter((_, i) => data.tinfo.Category[i] === `Topic${selectedTopic + 1}`);
    const frequencies = terms.map((term, i) => ({
      term,
      freq: data.tinfo.Freq[i] * lambda,
    }));

    frequencies.sort((a, b) => b.freq - a.freq);
    const topTerms = frequencies.slice(0, 10);

    const barChart = d3.select(barChartRef.current);
    barChart.selectAll("*").remove();

    const width = 400;
    const height = 360;
    const margin = { top: 20, right: 20, bottom: 40, left: 120 };

    const xScale = d3.scaleLinear().domain([0, d3.max(topTerms, (d) => d.freq)]).range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleBand().domain(topTerms.map((d) => d.term)).range([0, height - margin.top - margin.bottom]).padding(0.1);

    const g = barChart.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
      .data(topTerms)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.term))
      .attr("width", (d) => xScale(d.freq))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#A5D8FF");

    g.selectAll("text")
      .data(topTerms)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.freq) + 5)
      .attr("y", (d) => yScale(d.term) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("font-family", "Paperlogy")
      .text((d) => d.freq.toFixed(2));

    g.append("g").call(d3.axisLeft(yScale).tickSize(0).tickPadding(10).tickSizeOuter(0));
    g.append("g").attr("transform", `translate(0,${height - margin.top - margin.bottom})`).call(d3.axisBottom(xScale).ticks(5));
  }, [data, selectedTopic, lambda]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px" }}>
      <h2 style={{ fontFamily: "Paperlogy", marginBottom: "5px" }}>토픽 분석</h2> {/* 간격 조정 */}
      <p style={{ fontFamily: "Paperlogy", marginTop: "0px" }}> {/* 간격 조정 */}
        토픽 분석은 데이터에서 주요 주제를 추출하고 이를 시각적으로 표현하는 과정입니다.
        아래 차트는 토픽 간의 관계와 각 토픽 내 주요 단어를 보여줍니다.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        <div style={{ textAlign: "center" }}>
          <svg ref={svgRef} width={400} height={360}></svg>
          <p style={{ fontFamily: "Paperlogy", fontSize: "14px", marginTop: "10px" }}>
            이 차트는 토픽 간의 거리와 크기를 시각적으로 표현한 것입니다.<br/>
            각 원의 크기는 빈도를 나타냅니다.
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <svg ref={barChartRef} width={450} height={360}></svg>
          <p style={{ fontFamily: "Paperlogy", fontSize: "14px", marginTop: "10px" }}>
            이 차트는 선택된 토픽에서 가장 많이 언급된 단어와 빈도를 나타냅니다.
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
          />
          <span> 관련성 척도 = {lambda.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ marginTop: "40px", textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <p style={{ fontFamily: "Paperlogy", fontSize: "14px", fontWeight: "bold", margin: "0" }}>
          토픽별 가장 많이 언급된 단어 |
        </p>
        <p style={{ fontFamily: "Paperlogy", fontSize: "18px", color: "#333", margin: "0" }}>
          토픽 {selectedTopic + 1}: {getTopicSummary(selectedTopic)}
        </p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
        <label style={{ fontFamily: "Paperlogy", fontSize: "18px", color: "#555" }}>
          선택된 토픽: {selectedTopic + 1}
        </label>
        <button
          onClick={() => setSelectedTopic((prev) => Math.max(prev - 1, 0))}
          style={{
            padding: "8px 12px",
            fontFamily: "Paperlogy",
            fontSize: "14px",
            backgroundColor: "#A5D8FF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          이전 토픽
        </button>
        <button
          onClick={() => setSelectedTopic((prev) => Math.min(prev + 1, data.mdsDat.topics.length - 1))}
          style={{
            padding: "8px 12px",
            fontFamily: "Paperlogy",
            fontSize: "14px",
            backgroundColor: "#A5D8FF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          다음 토픽
        </button>
      </div>
    </div>
    </div>
  );
};

export default TopicAnalysis;
