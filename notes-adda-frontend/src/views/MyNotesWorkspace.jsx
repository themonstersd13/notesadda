import React, { useState, useEffect } from 'react';
import { Folder, FileText, Plus, GripVertical, Trash2, ArrowLeft, Upload, X, UploadCloud } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../services/api'; // Import API for real uploads

export const MyNotesWorkspace = () => {
  // --- STATE ---
  const [items, setItems] = useState([]); 
  const [currentFolderId, setCurrentFolderId] = useState(null); 
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Personal Upload State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState(null); // New: Store the actual file
  const [isUploading, setIsUploading] = useState(false); // New: Loading state

  // --- PERSISTENCE ---
  useEffect(() => {
    const saved = localStorage.getItem('myDeskItems');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([
        { id: '1', title: 'My Projects', type: 'folder', parentId: null, color: 'emerald' },
        { id: '2', title: 'Calculus Notes', type: 'file', parentId: null, color: 'blue' }
      ]);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
        localStorage.setItem('myDeskItems', JSON.stringify(items));
    }
  }, [items]);

  // --- FILTERS ---
  const visibleItems = items.filter(item => item.parentId === currentFolderId);
  const currentFolder = items.find(i => i.id === currentFolderId);

  // --- DRAG & DROP LOGIC (Reordering) ---
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;
    if (draggedItem.parentId !== currentFolderId) return; 

    const currentIndex = visibleItems.findIndex(i => i.id === draggedItem.id);
    const targetIndex = visibleItems.findIndex(i => i.id === targetItem.id);

    if (currentIndex === -1 || targetIndex === -1) return;

    const newVisible = [...visibleItems];
    newVisible.splice(currentIndex, 1);
    newVisible.splice(targetIndex, 0, draggedItem);

    const otherItems = items.filter(i => i.parentId !== currentFolderId);
    setItems([...otherItems, ...newVisible]);
  };

  const handleDropOnFolder = (e, targetFolder) => {
      e.preventDefault();
      e.stopPropagation();
      if (!draggedItem || draggedItem.id === targetFolder.id) return;
      
      const updatedItems = items.map(i => 
          i.id === draggedItem.id ? { ...i, parentId: targetFolder.id } : i
      );
      setItems(updatedItems);
      setDraggedItem(null);
  };

  // --- REAL FILE UPLOAD LOGIC ---
  const handleFileDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          setUploadFile(e.dataTransfer.files[0]);
      }
  };

  const handlePersonalUpload = async () => {
      if (!uploadFile) return;
      
      setIsUploading(true);
      
      try {
          // 1. Prepare FormData
          const formData = new FormData();
          formData.append('file', uploadFile);
          // We use dummy data for required backend fields so it passes validation
          formData.append('title', uploadName || uploadFile.name);
          formData.append('branch', 'Personal'); 
          formData.append('semester', 'Personal');
          formData.append('subject', 'My Desk Uploads');
          formData.append('isNewSubject', 'true'); // Automatically create this subject bucket

          // 2. Upload to Cloudinary via Backend
          const res = await api.post('/notes', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });

          // 3. Add Link to Desk
          const newItem = {
              id: Date.now().toString(),
              title: uploadName || uploadFile.name,
              type: 'file',
              fileUrl: res.data.fileUrl, // The real Cloudinary URL
              parentId: currentFolderId,
              color: 'blue',
              isPersonal: true
          };
          setItems([...items, newItem]);
          
          // 4. Reset
          setUploadFile(null);
          setUploadName("");
          setIsUploadOpen(false);
          alert("File uploaded and saved to your desk!");

      } catch (err) {
          console.error(err);
          alert("Upload failed. Make sure you are logged in!");
      } finally {
          setIsUploading(false);
      }
  };

  // --- ACTIONS ---
  const addFolder = () => {
      const name = prompt("Folder Name:");
      if (!name) return;
      const newFolder = {
          id: Date.now().toString(),
          title: name,
          type: 'folder',
          parentId: currentFolderId,
          color: 'amber'
      };
      setItems([...items, newFolder]);
  };

  const removeItem = (e, id) => {
    e.stopPropagation();
    if(window.confirm("Delete this item?")) {
        setItems(items.filter(i => i.id !== id && i.parentId !== id));
    }
  };

  const openItem = (item) => {
      if (item.type === 'folder') {
          setCurrentFolderId(item.id);
      } else {
          if (item.fileUrl) {
              window.open(item.fileUrl, '_blank');
          } else {
              alert(`Opening "${item.title}"`);
          }
      }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <div className="flex items-center gap-2">
                {currentFolderId && (
                    <button onClick={() => setCurrentFolderId(currentFolder?.parentId || null)} className="p-1 hover:bg-slate-800 rounded-full mr-2">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    {currentFolder ? currentFolder.title : "My Desk"}
                </h2>
            </div>
            <p className="text-slate-400 text-sm mt-1">
                {currentFolderId ? "Organize files in this folder." : "Your personal workspace."}
            </p>
        </div>
        
        <div className="flex gap-2">
            <Button variant="secondary" onClick={addFolder} icon={Plus}>Folder</Button>
            <Button variant="primary" onClick={() => setIsUploadOpen(true)} icon={Upload}>Upload File</Button>
        </div>
      </div>

      {/* Upload Modal (Enhanced with Drag & Drop) */}
      {isUploadOpen && (
          <div className="mb-8 p-6 bg-slate-800/80 border border-indigo-500/30 rounded-2xl animate-in slide-in-from-top-2 relative">
              <button onClick={() => setIsUploadOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20}/></button>
              
              <h3 className="text-lg font-bold mb-4">Upload to Personal Desk</h3>
              
              <div className="flex flex-col gap-4">
                  <Input 
                     placeholder="Enter custom file name (Optional)" 
                     value={uploadName} 
                     onChange={(e) => setUploadName(e.target.value)}
                  />
                  
                  {/* DROPZONE */}
                  <div 
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center gap-2
                        ${uploadFile ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-600 hover:border-indigo-400 bg-slate-900/50'}`}
                  >
                        {!uploadFile ? (
                            <>
                                <UploadCloud size={32} className="text-slate-400" />
                                <div className="text-sm text-slate-300">
                                    Drag & drop your file here, or <label htmlFor="desk-upload" className="text-indigo-400 cursor-pointer hover:underline">browse</label>
                                </div>
                                <input id="desk-upload" type="file" className="hidden" onChange={(e) => setUploadFile(e.target.files[0])} />
                            </>
                        ) : (
                            <>
                                <FileText size={32} className="text-emerald-400" />
                                <span className="font-bold text-emerald-200">{uploadFile.name}</span>
                                <button onClick={() => setUploadFile(null)} className="text-xs text-red-400 hover:underline">Remove</button>
                            </>
                        )}
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                      <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                      <Button onClick={handlePersonalUpload} disabled={!uploadFile || isUploading}>
                          {isUploading ? "Uploading..." : "Save to Desk"}
                      </Button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Grid Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[300px] content-start">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => {
                if (item.type === 'folder' && draggedItem?.id !== item.id) {
                    e.preventDefault(); 
                    e.currentTarget.style.borderColor = '#6366f1'; 
                } else {
                   handleDragOver(e, item);
                }
            }}
            onDragLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
            onDrop={(e) => {
                if (item.type === 'folder' && draggedItem?.id !== item.id) {
                    handleDropOnFolder(e, item);
                }
            }}
            onClick={() => openItem(item)}
            className="group relative bg-slate-800/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer flex flex-col items-center gap-4"
          >
            {item.isPersonal && <span className="absolute top-2 left-2 text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded">Me</span>}
            
            <button onClick={(e) => removeItem(e, item.id)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
            </button>

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-105
                ${item.type === 'folder' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
              {item.type === 'folder' ? <Folder size={32} /> : <FileText size={32} />}
            </div>
            
            <span className="font-medium text-slate-300 text-center text-sm group-hover:text-white truncate w-full">
                {item.title}
            </span>
          </div>
        ))}
        
        {visibleItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl h-48">
                <p>Empty folder.</p>
                <button onClick={() => setIsUploadOpen(true)} className="text-indigo-400 hover:underline mt-2">Upload a file here</button>
            </div>
        )}
      </div>
    </div>
  );
};