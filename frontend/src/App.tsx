import { useState } from "react";
import "./App.css";
import { uploadFile } from "./services/upload";
import { Toaster, toast } from "sonner";
import { Data } from "./types";
import Hero from "./components/Hero";
import { Search } from "./steps/Search";
import { AiOutlineCloudUpload } from "react-icons/ai";

const APP_STATUS = {
  IDLE: "idle",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Upload",
  [APP_STATUS.UPLOADING]: "Uploading...",
};

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [status, setStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [data, setData] = useState<Data>([]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setNewFile(file);
      setStatus(APP_STATUS.READY_UPLOAD);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status !== APP_STATUS.READY_UPLOAD || !newFile) return;

    setStatus(APP_STATUS.UPLOADING);

    const [err, newData] = await uploadFile(newFile);

    if (err) {
      setStatus(APP_STATUS.ERROR);
      toast.error(err.message);
      return;
    }

    setStatus(APP_STATUS.SUCCESS);
    if (newData) setData(newData);
    toast.success("File uploaded successfully");
  };

  const showButton =
    status === APP_STATUS.READY_UPLOAD || status === APP_STATUS.UPLOADING;
  const showInput = status !== APP_STATUS.SUCCESS;
  return (
    <main>
      <Hero />
      <Toaster />

      {showInput && (
        <form
          className="flex flex-col gap-8 items-center justify-center h-[50vh]"
          onSubmit={handleSubmit}
        >
          <label className="relative border border-gray-300 rounded-md">
            <input
              className="absolute inset-0 opacity-0 z-50 w-full h-full cursor-pointer"
              disabled={status === APP_STATUS.UPLOADING}
              onChange={handleInputChange}
              type="file"
              name="file"
              accept="application/pdf"
            />
            <div className="flex flex-col items-center justify-center p-20">
              <AiOutlineCloudUpload />
              <span>Select file</span>
              {newFile && (
                <div className="flex flex-col gap-1 items-center">
                  <span className="mt-2">{newFile.name}</span>
                  <span className="text-neutral-400">
                    {newFile.size / 1024} KB
                  </span>
                </div>
              )}
            </div>
          </label>
          {showButton && (
            <button
              className="bg-sky-600 py-2 px-4 font-medium w-[200px] rounded hover:bg-sky-700"
              disabled={status === APP_STATUS.UPLOADING}
            >
              {BUTTON_TEXT[status]}
            </button>
          )}
        </form>
      )}

      {status === APP_STATUS.SUCCESS && <Search initialData={data} />}
    </main>
  );
}

export default App;
