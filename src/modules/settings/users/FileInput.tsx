import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components';
import { FileUp } from 'lucide-react';

export const FileInput = () => {
  const [fileName, setFileName] = useState('');
  const [csvData, setCsvData] = useState([]);
  const fileInput = useRef(null);

  const handleButtonClick = (e) => {
    fileInput.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 grid-rows-1">
        <Button
          variant="secondary"
          size="full"
          font="large"
          icon="withIcon"
          weight="semibold"
          className="col-span-2 rounded-r-none border-r-0 lowercase"
          style={{ fontVariant: 'small-caps' }}
          onClick={handleButtonClick}
        >
          <FileUp />
          {fileName ? `${fileName}` : 'Use a CSV'}
        </Button>
        <Button
          variant="primaryDark"
          size="full"
          font="large"
          weight="semibold"
          className="col-start-3 rounded-l-none lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Confirm
        </Button>
      </div>
      <small className="text-xs">
        You need to have a column named 'Email' in the selected CSV file.
      </small>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        ref={fileInput}
        className="hidden"
      />
    </div>
  );
};
