import React from 'react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

const SignalTable = ({ data, onDelete, onUpdate, loading }) => {

    const renderDelta = (delta) => {
        try {
            const parsed = typeof delta === "string" ? JSON.parse(delta) : delta;
            const converter = new QuillDeltaToHtmlConverter(parsed.ops, {});
            return converter.convert();
        } catch {
            return "";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No messages available
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 px-4">
            {data.map((item) => (
                <div key={item.id} className="flex flex-col group">

                    {/* Message Row */}
                    <div className="flex items-start gap-3">

                        {/* Bubble */}
                        <div className="bg-gray-100 rounded-2xl px-4 py-2 max-w-3xl relative">

                            {/* Message Content */}
                            <div
                                className="prose max-w-none text-sm text-gray-800"
                                dangerouslySetInnerHTML={{ __html: renderDelta(item.message_delta) }}
                            />

                            {/* Media */}
                            {item.image_url && (
                                <img
                                    src={`${item.image_url}`}
                                    alt="message"
                                    className="mt-2 rounded-lg max-h-80"
                                />
                            )}

                            {item.video_url && (
                                <video
                                    src={`${import.meta.env.VITE_BASE_URL}${item.video_url}`}
                                    controls
                                    className="mt-2 rounded-lg max-h-80"
                                />
                            )}

                            {/* Timestamp */}
                            <div className="text-[11px] text-gray-400 mt-1 text-right">
                                {new Date(item.created_at).toLocaleString()}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button
                                onClick={() => onUpdate(item)}
                                className="p-1 rounded hover:bg-blue-100 text-blue-600"
                                title="Edit"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                disabled={loading} // Prevent double clicks
                                className={`p-1 rounded hover:bg-red-100 text-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default SignalTable;
