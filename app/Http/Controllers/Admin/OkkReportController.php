<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OkkProject;
use App\Models\OkkVote;
use Illuminate\Http\Request;

class OkkReportController extends Controller
{
    public function downloadProjectReport(OkkProject $project)
    {
        if (!auth()->user()->hasPermission('documents')) {
            abort(403);
        }

        $project->load(['questions' => function($q) {
            $q->orderBy('sort_order');
        }]);

        $votes = OkkVote::with('user')->where('project_id', $project->id)->get();
        $usersVoted = $votes->groupBy('user_id');

        $csvData = [];
        
        // Заголовки
        $headers = ['ФИО Голосующего'];
        foreach ($project->questions as $q) {
            $headers[] = $q->text;
        }
        $csvData[] = $headers;

        // Данные
        foreach ($usersVoted as $userId => $userVotes) {
            $userName = $userVotes->first()->user->name ?? 'Неизвестный пользователь';
            $row = [$userName];
            
            foreach ($project->questions as $q) {
                $vote = $userVotes->firstWhere('question_id', $q->id);
                $row[] = $vote ? $vote->answer : 'Нет ответа';
            }
            $csvData[] = $row;
        }

        $filename = "Отчет_ОКК_" . str_replace(' ', '_', $project->name) . "_" . date('Y-m-d') . ".csv";
        $headersInfo = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        // Добавляем BOM для правильного отображения кириллицы в Excel
        $callback = function() use($csvData) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // UTF-8 BOM
            foreach ($csvData as $row) {
                fputcsv($file, $row, ';');
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headersInfo);
    }
}
