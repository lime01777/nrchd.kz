import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function AssistantIndex({ technologies = [] }) {
    const [selectedTech, setSelectedTech] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State unique to each technology (mock storage)
    const [chats, setChats] = useState({});
    const [docs, setDocs] = useState({});

    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize mock data or load from props if available
    useEffect(() => {
        if (selectedTech) {
            // If no chat history exists for this tech, init one
            if (!chats[selectedTech.id]) {
                setChats(prev => ({
                    ...prev,
                    [selectedTech.id]: [
                        { id: 1, type: 'bot', text: `Здравствуйте! Я ваш AI-ассистент по проекту "${selectedTech.name}". Загрузите документы или задайте вопрос.` }
                    ]
                }));
            }
            // If no docs exist, init from tech data
            if (!docs[selectedTech.id]) {
                const initialDocs = Array.isArray(selectedTech.documents)
                    ? selectedTech.documents.map((d, i) => ({ id: i, name: d.name || 'Документ', date: new Date().toLocaleDateString() }))
                    : [];
                setDocs(prev => ({
                    ...prev,
                    [selectedTech.id]: initialDocs
                }));
            }
        }
    }, [selectedTech]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedTech) return;

        const techId = selectedTech.id;
        const newMsg = { id: Date.now(), type: 'user', text: input };

        setChats(prev => ({
            ...prev,
            [techId]: [...(prev[techId] || []), newMsg]
        }));

        setInput('');
        setIsProcessing(true);

        setTimeout(() => {
            setChats(prev => ({
                ...prev,
                [techId]: [...(prev[techId] || []), {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: `Ответ по контексту "${selectedTech.name}": Это демонстрация. В реальной системе здесь будет ответ RAG-модели на основе загруженных документов.`
                }]
            }));
            setIsProcessing(false);
        }, 1200);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && selectedTech) {
            const techId = selectedTech.id;
            setDocs(prev => ({
                ...prev,
                [techId]: [...(prev[techId] || []), { id: Date.now(), name: file.name, date: new Date().toLocaleDateString() }]
            }));
            alert(`Файл "${file.name}" добавлен в базу знаний проекта "${selectedTech.name}".`);
        }
    };

    const filteredTechnologies = technologies.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.registry_code && t.registry_code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const activeChat = selectedTech ? (chats[selectedTech.id] || []) : [];
    const activeDocs = selectedTech ? (docs[selectedTech.id] || []) : [];

    return (
        <div className="flex h-[calc(100vh-100px)] gap-4">
            <Head title="AI Ассистент / База знаний" />

            {/* Sidebar: Technology List */}
            <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-gray-800 text-sm uppercase">Выберите технологию</h2>
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="mt-2 w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="flex-grow overflow-y-auto">
                    {filteredTechnologies.length > 0 ? (
                        <ul className="divide-y divide-gray-100">
                            {filteredTechnologies.map(tech => (
                                <li
                                    key={tech.id}
                                    onClick={() => setSelectedTech(tech)}
                                    className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${selectedTech?.id === tech.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                >
                                    <div className="text-sm font-medium text-gray-900 truncate">{tech.name}</div>
                                    <div className="text-xs text-gray-500">{tech.registry_code || 'Без кода'}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-sm text-gray-500 text-center">Нет технологий</div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {selectedTech ? (
                <>
                    {/* Center: Chat */}
                    <div className="flex-grow flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800 truncate max-w-xs">{selectedTech.name}</h2>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        Онлайн
                                    </p>
                                </div>
                            </div>

                            <a
                                href="https://notebooklm.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                            >
                                <span>NotebookLM</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                            {activeChat.map(msg => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.type === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-sm'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder={`Вопрос по контексту "${selectedTech.name}"...`}
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isProcessing}
                                    className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Panel: Documents */}
                    <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">База знаний</h3>
                        </div>

                        <div className="p-4 border-b border-gray-100">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-6 h-6 mb-2 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="text-xs text-gray-500 uppercase font-semibold text-center px-1">Загрузить для <br />{selectedTech.name.substring(0, 15)}...</p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
                            </label>
                        </div>

                        <div className="flex-grow overflow-y-auto p-2">
                            {activeDocs.length > 0 ? (
                                <ul className="space-y-1">
                                    {activeDocs.map(doc => (
                                        <li key={doc.id} className="group flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="bg-red-100 text-red-600 p-1.5 rounded shrink-0">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-700">{doc.name}</p>
                                                    <p className="text-xs text-gray-400">{doc.date}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-gray-400 text-xs mt-4">Нет документов</div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                    <div>
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Выберите технологию</h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Выберите проект из списка слева, чтобы начать работу с AI-ассистентом. Вы получите доступ к изолированному чату и базе знаний выбранной технологии.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

AssistantIndex.layout = page => <AdminLayout title="AI Ассистент">{page}</AdminLayout>;
