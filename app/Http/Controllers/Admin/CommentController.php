<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with('news:id,title')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
        ]);
    }

    public function approve(Comment $comment)
    {
        $comment->update(['is_approved' => true]);
        return back()->with('success', 'Комментарий одобрен');
    }

    public function unapprove(Comment $comment)
    {
        $comment->update(['is_approved' => false]);
        return back()->with('success', 'Комментарий снят с публикации');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return back()->with('success', 'Комментарий удален');
    }
}
