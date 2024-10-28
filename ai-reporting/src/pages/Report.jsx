import React, { useEffect, useState } from 'react';
import { fetchReportData } from '../utils/api';

const Report = () => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchReportData();
      setReportData(data);
    };
    loadData();
  }, []);

  return (
    <>
      <h1>Detailed Report</h1>
      {reportData ? (
        <pre>{JSON.stringify(reportData, null, 2)}</pre>
      ) : (
        <p>Loading report data...</p>
      )}
    </>
  );
};

export default Report;
