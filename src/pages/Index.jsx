import { useState } from 'react';
import CSVEditor from '../components/CSVEditor';

const Index = () => {
  const [csvData, setCsvData] = useState([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CSV Editor Tool</h1>
      <CSVEditor csvData={csvData} setCsvData={setCsvData} />
    </div>
  );
};

export default Index;
