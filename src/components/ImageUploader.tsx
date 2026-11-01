import React, { useRef, useState } from 'react';
import { PictureItem } from '../types';
import { Upload, Link as LinkIcon, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  pictures: [PictureItem, PictureItem];
  onChange: (pictures: [PictureItem, PictureItem]) => void;
  errorCounts?: [number, number]; // [errors in pic 1 caption, errors in pic 2 caption]
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  pictures,
  onChange,
  errorCounts = [0, 0],
}) => {
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState<{ [key: number]: boolean }>({ 0: false, 1: false });
  const [urlDraft, setUrlDraft] = useState<{ [key: number]: string }>({ 0: '', 1: '' });

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read image as base64 Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const updated: [PictureItem, PictureItem] = [
        { ...pictures[0] },
        { ...pictures[1] },
      ];
      updated[index].url = result;
      onChange(updated);
    };
    reader.readAsDataURL(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleApplyUrl = (index: number) => {
    const url = urlDraft[index]?.trim();
    if (!url) return;
    const updated: [PictureItem, PictureItem] = [
      { ...pictures[0] },
      { ...pictures[1] },
    ];
    updated[index].url = url;
    onChange(updated);
    setShowUrlInput((prev) => ({ ...prev, [index]: false }));
    setUrlDraft((prev) => ({ ...prev, [index]: '' }));
  };

  const handleRemoveImage = (index: number) => {
    const updated: [PictureItem, PictureItem] = [
      { ...pictures[0] },
      { ...pictures[1] },
    ];
    updated[index].url = '';
    onChange(updated);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated: [PictureItem, PictureItem] = [
      { ...pictures[0] },
      { ...pictures[1] },
    ];
    updated[index].caption = caption;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((idx) => {
          const pic = pictures[idx];
          const hasError = errorCounts[idx] > 0;
          const fileRef = idx === 0 ? fileInputRef1 : fileInputRef2;

          return (
            <div
              key={idx}
              className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    Picture {idx + 1}
                  </span>
                  {pic.url && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Picture Preview or Upload Area */}
                {pic.url ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white mb-3 group">
                    <img
                      src={pic.url}
                      alt={pic.caption || `Picture ${idx + 1}`}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="bg-white text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded shadow-sm hover:bg-slate-100"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center mb-3 bg-white hover:border-blue-400 transition-colors">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-700 mb-0.5">
                      Upload Picture {idx + 1}
                    </p>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Supports JPG, PNG, GIF, WebP
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-xs transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        Choose File
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setShowUrlInput((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }))
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors"
                      >
                        <LinkIcon className="w-3 h-3" />
                        URL
                      </button>
                    </div>

                    {showUrlInput[idx] && (
                      <div className="mt-3 flex gap-1.5">
                        <input
                          type="url"
                          placeholder="Paste image web link (https://...)"
                          value={urlDraft[idx] || ''}
                          onChange={(e) =>
                            setUrlDraft((prev) => ({
                              ...prev,
                              [idx]: e.target.value,
                            }))
                          }
                          className="flex-1 text-xs border border-slate-300 rounded px-2 py-1 focus:outline-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyUrl(idx)}
                          className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded font-medium"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(idx, e)}
                />
              </div>

              {/* Caption Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Picture {idx + 1} Caption
                  </label>
                  {hasError && (
                    <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errorCounts[idx]} issue{errorCounts[idx] > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder={`Write descriptive caption for picture ${idx + 1}...`}
                  value={pic.caption}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  className={`w-full text-xs bg-white border ${
                    hasError ? 'border-amber-300 focus:border-amber-500' : 'border-slate-300 focus:border-blue-500'
                  } rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500/20`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
