'use client';
import React, { useState } from 'react';
import { useAuth } from '@/app/authProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoaderIcon, Upload } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DataIngestion() {
  const { axiosInstance } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post(
        '/api/admin/upload_data',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadResult(`File uploaded successfully. ${response.data.message}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadResult('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Ingestion</CardTitle>
        <CardDescription>Manage data ingestion processes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
          {file && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={uploadFile}
                disabled={isUploading}
                variant="default"
                className="flex items-center w-full"
              >
                {isUploading ? (
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isUploading ? 'Uploading and Ingesting...' : 'Ingest File'}
              </Button>
            </div>
          )}
          {uploadResult && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {uploadResult}
            </div>
          )}
          <div>
            <Label htmlFor="ingestionStrategy">
              Ingestion Strategy (Coming Soon)
            </Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Size Chunking</SelectItem>
                <SelectItem value="semantic">Semantic Chunking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="parser">Parser (Coming Soon)</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a parser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama">Llama Parse</SelectItem>
                <SelectItem value="omni">Omniparse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
