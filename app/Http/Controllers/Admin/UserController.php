<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    private const ROLE_LABELS = [
        'admin' => 'Администратор',
        'document_manager' => 'Менеджер документов',
        'user' => 'Пользователь',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $users = User::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'role_label' => self::ROLE_LABELS[$user->role] ?? $user->role,
                    'has_admin_access' => in_array($user->role, ['admin', 'document_manager'], true),
                    'created_at' => $user->created_at?->format('d.m.Y H:i'),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
            'availableRoles' => self::ROLE_LABELS,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Edit', [
            'availableRoles' => self::ROLE_LABELS,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', Rule::in(array_keys(self::ROLE_LABELS))],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.admin.users')->with('success', 'Пользователь успешно создан');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'availableRoles' => self::ROLE_LABELS,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => ['required', Rule::in(array_keys(self::ROLE_LABELS))],
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['nullable', 'confirmed', Rules\Password::defaults()];
        }

        $validated = $request->validate($rules);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->route('admin.admin.users')->with('success', 'Пользователь успешно обновлен');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Нельзя удалить собственную учетную запись.');
        }

        $user->delete();

        return redirect()->route('admin.admin.users')->with('success', 'Пользователь успешно удален');
    }

    /**
     * Update only role for specified user.
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(array_keys(self::ROLE_LABELS))],
        ]);

        if ($request->user()->id === $user->id && $validated['role'] !== 'admin') {
            return redirect()->back()->with('error', 'Нельзя снять администраторский доступ у самого себя.');
        }

        $user->role = $validated['role'];
        $user->save();

        $message = $validated['role'] === 'admin'
            ? 'Пользователь получил доступ к админке.'
            : 'Роль пользователя успешно обновлена.';

        return redirect()->back()->with('success', $message);
    }
}
