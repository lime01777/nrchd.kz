import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function VoteForm({ project, hasVoted }) {
    const { data, setData, post, processing, errors } = useForm({
        votes: project.questions.map(q => ({
            question_id: q.id,
            answer: '' // 'Рекомендовать', 'С учетом замечаний', 'На доработку'
        }))
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleAnswerChange = (idx, value) => {
        const newVotes = [...data.votes];
        newVotes[idx].answer = value;
        setData('votes', newVotes);
    };

    const isAllAnswered = data.votes.every(v => v.answer !== '');

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.okk-projects.vote.store', project.id), {
            onSuccess: () => setSubmitSuccess(true),
            preserveScroll: true
        });
    };

    if (hasVoted || submitSuccess) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Head title={`Голосование: ${project.name}`} />
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Голос учтен</h2>
                    <p className="text-slate-600 mb-6">Спасибо. Ваше решение по проекту "{project.name}" успешно сохранено.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Вернуться к материалам
                    </button>
                </div>
            </div>
        );
    }

    if (project.questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                    Для данного проекта еще не заданы списки вопросов для голосования.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Head title={`Лист голосования - ${project.name}`} />

            <div className="mb-8">
                <button onClick={() => window.history.back()} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Назад
                </button>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{project.name}</h1>
                            <p className="text-slate-500 font-medium">Лист голосования члена Комитета ОКК</p>
                        </div>
                        <div className="mt-4 md:mt-0 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 whitespace-nowrap self-start md:self-auto">
                            Тип проекта: {project.type}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="py-4 px-4 font-bold text-slate-500 text-sm uppercase tracking-wide w-1/2">Вопрос / Критерий</th>
                                        <th className="py-4 px-2 font-bold text-slate-500 text-sm text-center">Рекомендовать</th>
                                        <th className="py-4 px-2 font-bold text-slate-500 text-sm text-center">С учетом замечаний</th>
                                        <th className="py-4 px-2 font-bold text-slate-500 text-sm text-center">На доработку</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {project.questions.map((q, idx) => (
                                        <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-5 px-4 text-slate-800 font-medium">
                                                <div className="flex items-start">
                                                    <span className="text-slate-400 mr-3 mt-0.5">{idx + 1}.</span>
                                                    <span>{q.text}</span>
                                                </div>
                                            </td>
                                            {['Рекомендовать', 'С учетом замечаний', 'На доработку'].map(opt => (
                                                <td key={opt} className="py-5 px-2 text-center align-middle">
                                                    <label className="inline-flex items-center justify-center p-3 rounded-full hover:bg-slate-100 cursor-pointer transition-colors group">
                                                        <input
                                                            type="radio"
                                                            name={`question_${q.id}`}
                                                            value={opt}
                                                            checked={data.votes[idx].answer === opt}
                                                            onChange={() => handleAnswerChange(idx, opt)}
                                                            className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                                                        />
                                                    </label>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                Пожалуйста, ответьте на все вопросы перед отправкой.
                            </div>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6">
                            <p className="text-sm text-slate-500 mb-4 sm:mb-0">
                                После отправки вы не сможете изменить свой голос.
                            </p>
                            <button
                                type="submit"
                                disabled={processing || !isAllAnswered}
                                className={`px-8 py-3 rounded-xl font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto
                                    ${isAllAnswered && !processing
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                                {processing ? 'Отправка...' : 'Отправить голос'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

VoteForm.layout = undefined; // страница открывается без тяжелого AdminLayout, для удобства на мобильных
