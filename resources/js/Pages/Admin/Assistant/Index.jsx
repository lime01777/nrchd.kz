import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function AssistantIndex({ technologies = [] }) {
    const [selectedTech, setSelectedTech] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State unique to each technology
    const [chats, setChats] = useState({});
    const [docs, setDocs] = useState({});

    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize data when selectedTech changes
    useEffect(() => {
        if (selectedTech) {
            // Find the full tech object from technologies list to get latest docs
            const techData = technologies.find(t => t.id === selectedTech.id);

            if (techData && !chats[selectedTech.id]) {
                setChats(prev => ({
                    ...prev,
                    [selectedTech.id]: [
                        { id: 1, type: 'bot', text: `Здравствуйте! Я ваш AI-ассистент по проекту "${selectedTech.name}". Загрузите документы или задайте вопрос.` }
                    ]
                }));
            }

            if (techData) {
                const initialDocs = Array.isArray(techData.documents)
                    ? techData.documents.map((d, i) => ({ id: i, name: d.name || 'Документ', date: d.date || new Date().toLocaleDateString(), url: d.url }))
                    : [];
                setDocs(prev => ({
                    ...prev,
                    [selectedTech.id]: initialDocs
                }));
            }
        }
    }, [selectedTech, technologies]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedTech || isProcessing) return;

        const techId = selectedTech.id;
        const userMsg = { id: Date.now(), type: 'user', text: input };
        const history = chats[techId] || [];

        setChats(prev => ({
            ...prev,
            [techId]: [...history, userMsg]
        }));

        setInput('');
        setIsProcessing(true);

        try {
            const response = await fetch('/admin/assistant/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    message: input,
                    tech_id: techId,
                    history: history.slice(-10)
                })
            });

            const data = await response.json();

            setChats(prev => ({
                ...prev,
                [techId]: [...(prev[techId] || []), {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: data.reply
                }]
            }));
        } catch (error) {
            console.error('Chat error:', error);
            setChats(prev => ({
                ...prev,
                [techId]: [...(prev[techId] || []), {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: 'Произошла ошибка при связи с AI.'
                }]
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file && selectedTech) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                setIsProcessing(true);
                const response = await fetch(`/admin/assistant/upload-doc/${selectedTech.id}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    },
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    setDocs(prev => ({
                        ...prev,
                        [selectedTech.id]: [...(prev[selectedTech.id] || []), data.document]
                    }));
                    router.reload();
                } else {
                    alert('Ошибка при загрузке: ' + (data.message || 'неизвестная ошибка'));
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Произошла ошибка при загрузке файла');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleDeleteDoc = async (docName) => {
        if (!selectedTech || !confirm(`Удалить документ "${docName}" из базы знаний?`)) return;

        try {
            const response = await fetch(`/admin/assistant/delete-doc/${selectedTech.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ doc_name: docName })
            });

            if (response.ok) {
                // Update local state and trigger reload
                setDocs(prev => ({
                    ...prev,
                    [selectedTech.id]: prev[selectedTech.id].filter(d => d.name !== docName)
                }));
                router.reload();
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Ошибка при удалении документа');
        }
    };

    const filteredTechnologies = technologies.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.registry_code && t.registry_code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const activeChat = selectedTech ? (chats[selectedTech.id] || []) : [];
    const activeDocs = selectedTech ? (docs[selectedTech.id] || []) : [];

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 p-2">
            <Head title="AI Аналитик — База знаний" />

            {/* Sidebar: Technology List */}
            <div className="w-80 flex-shrink-0 flex flex-col bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                    <h2 className="font-bold text-gray-800 text-xs uppercase tracking-widest mb-3">Технологии Здравоохранения</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск по названию или коду..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {filteredTechnologies.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {filteredTechnologies.map(tech => (
                                <div
                                    key={tech.id}
                                    onClick={() => setSelectedTech(tech)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${selectedTech?.id === tech.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'hover:bg-blue-50 text-gray-700'}`}
                                >
                                    <div className={`text-sm font-bold truncate ${selectedTech?.id === tech.id ? 'text-white' : 'text-gray-900'}`}>
                                        {tech.name}
                                    </div>
                                    <div className={`text-[10px] mt-1 font-mono uppercase tracking-tighter ${selectedTech?.id === tech.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {tech.registry_code || 'БЕЗ КОДА'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-sm text-gray-400 text-center italic">Ничего не найдено</div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {selectedTech ? (
                <>
                    {/* Center: Chat */}
                    <div className="flex-grow flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center bg-gradient-to-r from-white to-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-gray-900 text-lg leading-tight truncate max-w-md">{selectedTech.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Аналитик Онлайн</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
                            {activeChat.map(msg => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                    <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 shadow-sm text-sm ${msg.type === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none font-medium'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none leading-relaxed'
                                        }`}>
                                        {msg.text.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-none px-6 py-4 shadow-sm">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder={`Запитайте про "${selectedTech.name.substring(0, 30)}..."`}
                                    className="w-full pl-6 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all shadow-inner outline-none text-sm placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isProcessing}
                                    className="absolute right-2.5 top-2.5 bottom-2.5 aspect-square bg-blue-600 text-white flex items-center justify-center rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                </button>
                            </form>
                            <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-widest font-bold">
                                ИИ может ошибаться. Всегда проверяйте важные медицинские данные.
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Documents */}
                    <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 animate-in slide-in-from-right-4 duration-500 delay-150">
                        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h3 className="font-extrabold text-gray-900 text-xs uppercase tracking-widest">База знаний</h3>
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold">
                                {activeDocs.length} ФАЙЛОВ
                            </span>
                        </div>

                        {/* Upload Zone */}
                        <div className="p-4">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all group overflow-hidden relative">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Загрузить документ</p>
                                    <p className="text-[9px] text-gray-400 mt-1">PDF, DOCX, TXT</p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
                            </label>
                        </div>

                        {/* File List */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {activeDocs.length > 0 ? (
                                <div className="space-y-2">
                                    {activeDocs.map(doc => (
                                        <div key={doc.id} className="group flex flex-col p-3.5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all relative">
                                            <div className="flex items-start gap-3 mb-2">
                                                <div className="bg-red-50 text-red-500 p-2 rounded-2xl shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div className="min-w-0 flex-grow">
                                                    <p className="text-xs font-bold text-gray-800 break-words group-hover:text-blue-700">{doc.name}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase italic">{doc.date}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline uppercase tracking-widest"
                                                >
                                                    Просмотр
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteDoc(doc.name)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                                    title="Удалить из базы знаний"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-40">
                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Пусто</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white p-20 text-center animate-in zoom-in-95 duration-500">
                    <div className="max-w-md">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">Интеллектуальный Анализ <br /><span className="text-blue-600">HealthTech</span></h2>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Выберите технологию из списка слева для глубокого анализа <br /> с использованием ИИ на основе ваших документов.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <div className="p-4 bg-white/50 border border-gray-100 rounded-2xl shadow-sm">
                                <div className="text-blue-600 font-black text-xl mb-1">RAG</div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Анализ файлов</div>
                            </div>
                            <div className="p-4 bg-white/50 border border-gray-100 rounded-2xl shadow-sm">
                                <div className="text-indigo-600 font-black text-xl mb-1">Gemini</div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Flash 1.5</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

AssistantIndex.layout = page => <AdminLayout title="AI Аналитик">{page}</AdminLayout>;
