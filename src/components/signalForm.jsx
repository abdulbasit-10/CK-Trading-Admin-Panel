import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { signalAPI } from "../api/homeApi";
import toast from "react-hot-toast";

const SignalForm = ({ editingSignal, onCancelEdit, onSuccess }) => {
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

  /* -------------------- Handle Edit Mode Population -------------------- */
  useEffect(() => {
    if (editingSignal && quillRef.current) {
      // Set Text/Delta
      try {
        const delta = typeof editingSignal.message_delta === "string" 
          ? JSON.parse(editingSignal.message_delta) 
          : editingSignal.message_delta;
        quillRef.current.setContents(delta);
      } catch (e) {
        quillRef.current.setText(editingSignal.message_text || "");
      }

      // Set Preview
      if (editingSignal.image_url) setPreview(editingSignal.image_url);
      else if (editingSignal.video_url) setPreview(editingSignal.video_url);
      else setPreview(null);
      
      setMedia(null); // Reset new file selection
    } else if (!editingSignal && quillRef.current) {
      // Clear form for new signal
      quillRef.current.setContents([]);
      setPreview(null);
      setMedia(null);
    }
  }, [editingSignal]);

  /* -------------------- Media Handlers -------------------- */
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image") && !file.type.startsWith("video")) {
      toast.error("Only image or video files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
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
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleMediaChange({ target: { files: [file] } });
  };

  useEffect(() => {
    return () => { if (preview && !preview.startsWith('http')) URL.revokeObjectURL(preview); };
  }, [preview]);

  /* -------------------- Submit Handler -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const quill = quillRef.current;
    if (!quill) return;

    const delta = quill.getContents();
    const rawText = quill.getText().trim();

    // if (!rawText) {
    //   toast.error("Message cannot be empty");
    //   return;
    // }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("message_delta", JSON.stringify(delta));
      formData.append("message_text", rawText);

      if (media) {
        formData.append("media", media);
      }

      if (editingSignal) {
        // CALL UPDATE API
        console.log("Updating signal", editingSignal.id)
        await signalAPI.updateSignal(editingSignal.id, formData);
        toast.success("Signal updated successfully");
      } else {
        // CALL CREATE API
        await signalAPI.createSignal(formData);
        toast.success("Signal created successfully");
      }

      onSuccess(); // Trigger parent refresh and reset
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {editingSignal ? "Update Signal" : "Create New Signal"}
        </h2>
        {editingSignal && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            className="text-sm text-red-600 hover:underline"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
        <div ref={editorRef} className="bg-white rounded-lg border border-gray-300" style={{ minHeight: "150px" }} />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Image / Video</label>
        {preview ? (
          <div className="relative inline-block">
            {/* Logic to determine if preview is video or image */}
            {(media?.type.startsWith("video") || (editingSignal?.video_url && !media)) ? (
               <video src={preview} controls className="max-w-xs h-48 rounded-lg border border-gray-300" />
            ) : (
               <img src={preview} alt="Preview" className="max-w-xs h-48 object-cover rounded-lg border border-gray-300" />
            )}
            <button type="button" onClick={handleRemoveMedia} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"}`}
          >
            <input type="file" accept="image/*,video/*" onChange={handleMediaChange} className="hidden" id="media-input" />
            <label htmlFor="media-input" className="cursor-pointer block">
              <p className="text-sm text-gray-600"><span className="font-medium text-green-600">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">Images or Videos up to 10MB</p>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          {loading ? "Processing..." : editingSignal ? "Save Changes" : "Send Signal"}
        </button>
      </div>
    </form>
  );
};

export default SignalForm;