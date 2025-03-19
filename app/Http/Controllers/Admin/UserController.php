<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Здесь будет логика получения списка пользователей
        // Пока возвращаем тестовые данные
        $users = [
            [
                'id' => 1,
                'name' => 'Администратор',
                'email' => 'admin@nrchd.kz',
                'role' => 'Администратор',
                'status' => 'Активен',
                'created_at' => '2024-01-01'
            ],
            [
                'id' => 2,
                'name' => 'Модератор',
                'email' => 'moderator@nrchd.kz',
                'role' => 'Модератор',
                'status' => 'Активен',
                'created_at' => '2024-02-01'
            ],
            [
                'id' => 3,
                'name' => 'Редактор',
                'email' => 'editor@nrchd.kz',
                'role' => 'Редактор',
                'status' => 'Неактивен',
                'created_at' => '2024-03-01'
            ],
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Edit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Валидация данных
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string',
            'status' => 'required|string',
        ]);

        // Здесь будет логика создания пользователя
        // Пример:
        // User::create([
        //     'name' => $request->name,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        //     'role' => $request->role,
        //     'status' => $request->status,
        // ]);

        return redirect()->route('admin.users')->with('success', 'Пользователь успешно создан');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Здесь будет логика получения пользователя по ID
        // Пока возвращаем тестовые данные
        $user = [
            'id' => $id,
            'name' => 'Тестовый пользователь',
            'email' => 'test@nrchd.kz',
            'role' => 'Редактор',
            'status' => 'Активен'
        ];

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Валидация данных
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string',
            'status' => 'required|string',
        ];

        // Если пароль не пустой, добавляем правила валидации для пароля
        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        // Здесь будет логика обновления пользователя
        // Пример:
        // $user = User::findOrFail($id);
        // $user->name = $request->name;
        // $user->email = $request->email;
        // $user->role = $request->role;
        // $user->status = $request->status;
        // 
        // if ($request->filled('password')) {
        //     $user->password = Hash::make($request->password);
        // }
        // 
        // $user->save();

        return redirect()->route('admin.users')->with('success', 'Пользователь успешно обновлен');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Здесь будет логика удаления пользователя
        // Пример:
        // User::destroy($id);

        return redirect()->route('admin.users')->with('success', 'Пользователь успешно удален');
    }
}
