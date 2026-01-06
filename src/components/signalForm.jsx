import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { signalAPI } from "../api/homeApi";

const SignalForm = () => {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  /* -------------------- Initialize Quill -------------------- */
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Type your message...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  /* -------------------- Media Handlers -------------------- */
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
      alert("Only image or video files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setPreview(null);
  };

  /* ---------------- Drag & Drop Handlers ---------------- */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
      alert("Only image or video files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ----------- Cleanup preview URL (memory safe) ----------- */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* -------------------- Submit Handler -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const quill = quillRef.current;
    if (!quill) return;

    const delta = quill.getContents();
    console.log( "delta" ,delta);

    const rawText = quill.getText().trim();

    if (!rawText) {
      alert("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("message_delta", JSON.stringify(delta));
      formData.append("message_text", rawText);

      if (media) {
        formData.append("media", media);
      }

      await signalAPI.createSignal(formData);

      // Reset
      quill.setContents([]);
      setMedia(null);
      setPreview(null);

      alert("Signal created successfully");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Failed to create signal"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 mb-6 max-w-full"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Create New Signal
      </h2>

      {/* Quill Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <div
          ref={editorRef}
          className="bg-white rounded-lg border border-gray-300"
          style={{ minHeight: "150px" }}
        />
      </div>

      {/* Media Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image / Video
        </label>

        {preview ? (
          <div className="relative inline-block">
            {media?.type.startsWith("image") ? (
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs h-48 object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <video
                src={preview}
                controls
                className="max-w-xs h-48 rounded-lg border border-gray-300"
              />
            )}

            <button
              type="button"
              onClick={handleRemoveMedia}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer
              ${
                isDragging
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400"
              }
            `}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="hidden"
              id="media-input"
            />

            <label htmlFor="media-input" className="cursor-pointer block">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-green-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Images or Videos up to 10MB
              </p>
            </label>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 transition disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          {loading ? "Sending..." : "Send Signal"}
        </button>
      </div>
    </form>
  );
};

export default SignalForm;
