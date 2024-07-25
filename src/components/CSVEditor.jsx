import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Download } from 'lucide-react';

const CSVEditor = ({ csvData, setCsvData }) => {
  const [headers, setHeaders] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });

      setHeaders(headers);
      setCsvData(data);
    };

    reader.readAsText(file);
  }, [setCsvData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleEdit = (index, field, value) => {
    const newData = [...csvData];
    newData[index][field] = value;
    setCsvData(newData);
  };

  const handleAdd = () => {
    const newRow = headers.reduce((obj, header) => {
      obj[header] = '';
      return obj;
    }, {});
    setCsvData([...csvData, newRow]);
  };

  const handleDelete = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <p>Drag 'n' drop a CSV file here, or click to select a file</p>
        )}
      </div>

      {csvData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Input
                          value={row[header]}
                          onChange={(e) => handleEdit(rowIndex, header, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(rowIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CSVEditor;
