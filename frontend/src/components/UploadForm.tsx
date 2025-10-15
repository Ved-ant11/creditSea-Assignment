import type { ChangeEvent } from "react";
import React from "react";
interface UploadFormProps {
  onUpload: (file: File) => void;
  uploading: boolean;
}

const UploadForm = ({ onUpload, uploading }: UploadFormProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    event.target.value = "";
  };

  return (
    <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-sky-400">
      <span className="text-lg font-semibold text-slate-900">
        Upload Experian XML
      </span>
      <span className="mt-2 text-sm text-slate-500">
        {uploading
          ? "Processing..."
          : "Drop a file here or click to browse (.xml)"}
      </span>
      <input
        type="file"
        accept=".xml,application/xml,text/xml"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
    </label>
  );
};

export default UploadForm;
