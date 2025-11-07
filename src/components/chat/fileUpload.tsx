"use client";
import { Check, Paperclip, ShieldAlert, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function FileUpload({
  setIsFileSelected,
  setFileHash
}: {
  setIsFileSelected: React.Dispatch<React.SetStateAction<boolean>>,
  setFileHash: React.Dispatch<React.SetStateAction<string>>
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<
    undefined | boolean | "loading"
  >(undefined);

  useEffect(() => {
    setUploadStatus(undefined);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsFileSelected(true);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setIsFileSelected(false);
    }
  };

  const handleUpload = async () => {
    setUploadStatus("loading");
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await fetch("/api/doc-chat/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((body: { message: string; error: null | string, fileHash:string }) => {
          if (!body.error) {
            setFileHash(body.fileHash)
            setUploadStatus(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setUploadStatus(false);
          toast.error('Failed to upload the file')
        });
    }
  };
  return (
    <div className='p-2 border'>
      <div className='flex justify-between items-center'>
        {/* Select file */}
        <div>
          <input
            type='file'
            id='fileUpload'
            ref={fileInputRef}
            className='hidden'
            onChange={handleFileChange}
          />
          <label
            htmlFor='fileUpload'
            className='cursor-pointer flex items-center gap-1'
          >
            <Paperclip />
            <small>Attach your file</small>
          </label>
        </div>
        {/* Upload button */}
        <div className='flex items-center gap-1'>
          <button
            onClick={handleUpload}
            className='border p-1 rounded m-1 cursor-pointer disabled:cursor-not-allowed'
            disabled={!selectedFile || uploadStatus === true}
          >
            {uploadStatus === "loading" ? "Uploading..." : "Upload"}
          </button>
          {uploadStatus === true && (
            <span title='File uploaded successfully'>
              <Check className='text-green-400' />
            </span>
          )}
          {uploadStatus === false && (
            <span title='failed to upload the file'>
              <ShieldAlert className='text-red-400' />
            </span>
          )}
        </div>
      </div>

      {/* Show selected file name with remove button */}
      {selectedFile && (
        <div className='flex items-center justify-between mt-1 text-sm text-gray-600 border p-1 rounded'>
          <span className='truncate'>📄 {selectedFile.name}</span>
          <button
            type='button'
            onClick={handleRemoveFile}
            className='ml-2 text-red-500 hover:text-red-700'
            title='Remove file'
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
