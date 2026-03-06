<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OkkProject;
use App\Models\OkkVote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OkkVoteController extends Controller
{
    public function showForm(OkkProject $project)
    {
        // Проверка прав (должен быть okk_committee или admin)
        if (!auth()->user()->hasPermission('okk_committee') && !auth()->user()->hasPermission('documents')) {
            abort(403);
        }

        // Проверка статуса (только Заседание) (опционально, но лучше проверять)
        if ($project->status !== 'Заседание') {
            return redirect()->back()->with('error', 'Голосование недоступно. Статус проекта: ' . $project->status);
        }

        // Проверка времени 2 часа (если включена)
        if ($project->meeting_time && now()->diffInHours($project->meeting_time) > 2 && now() > $project->meeting_time) {
            return redirect()->back()->with('error', 'Время на голосование истекло.');
        }

        $project->load(['questions' => function ($q) {
            $q->where('is_active', true)->orderBy('sort_order');
        }]);

        // Проверка, голосовал ли уже этот пользователь
        $hasVoted = OkkVote::where('project_id', $project->id)
            ->where('user_id', auth()->id())
            ->exists();

        return Inertia::render('Admin/OKK/VoteForm', [
            'project' => $project,
            'hasVoted' => $hasVoted,
        ]);
    }

    public function store(Request $request, OkkProject $project)
    {
        if (!auth()->user()->hasPermission('okk_committee') && !auth()->user()->hasPermission('documents')) {
            abort(403);
        }

        if ($project->status !== 'Заседание') {
            return response()->json(['error' => 'Голосование закрыто'], 403);
        }

        $validated = $request->validate([
            'votes' => 'required|array',
            'votes.*.question_id' => 'required|exists:okk_questions,id',
            'votes.*.answer' => 'required|string|in:Рекомендовать,С учетом замечаний,На доработку',
        ]);

        $userId = auth()->id();

        // Проверка на повторное голосование
        if (OkkVote::where('project_id', $project->id)->where('user_id', $userId)->exists()) {
            return response()->json(['error' => 'Вы уже проголосовали за этот проект.'], 400);
        }

        foreach ($validated['votes'] as $voteData) {
            OkkVote::create([
                'project_id' => $project->id,
                'user_id' => $userId,
                'question_id' => $voteData['question_id'],
                'answer' => $voteData['answer'],
            ]);
        }

        return response()->json(['success' => true]);
    }
}
