<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CommentController extends Controller
{
    public function getCaptcha()
    {
        $num1 = rand(1, 9);
        $num2 = rand(1, 9);
        $result = $num1 + $num2;
        
        Session::put('comment_captcha', $result);
        
        return response()->json([
            'question' => "{$num1} + {$num2} = ?",
        ]);
    }

    public function store(Request $request, News $news)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'content' => 'required|string|max:1000',
            'captcha' => 'required|numeric',
        ]);

        $savedCaptcha = Session::get('comment_captcha');
        
        if ($request->captcha != $savedCaptcha) {
            return back()->withErrors(['captcha' => 'Неверный ответ на каптчу'])->withInput();
        }

        Comment::create([
            'news_id' => $news->id,
            'name' => $request->name,
            'email' => $request->email,
            'content' => $request->content,
            'is_approved' => true, // Публикуем сразу
        ]);

        Session::forget('comment_captcha');

        return back()->with('success', 'Ваш комментарий отправлен и появится после модерации.');
    }
}
