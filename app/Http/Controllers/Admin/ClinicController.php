<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use App\Models\ClinicDoctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Http\Requests\StoreClinicRequest;
use App\Http\Requests\UpdateClinicRequest;

class ClinicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clinics = Clinic::with('doctors')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Clinics/Index', [
            'clinics' => $clinics,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Clinics/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClinicRequest $request)
    {
        $validated = $request->validated();

        // Обработка JSON полей
        $validated = $this->processJsonFields($validated);

        // Обработка изображений
        $validated = $this->processImages($validated, null);

        $clinic = Clinic::create($validated);

        return redirect()->route('admin.clinics.index')
            ->with('success', 'Клиника успешно создана');
    }

    /**
     * Display the specified resource.
     */
    public function show(Clinic $clinic)
    {
        $clinic->load('doctors');

        return Inertia::render('Admin/Clinics/Show', [
            'clinic' => $clinic,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Clinic $clinic)
    {
        $clinic->load('doctors');

        return Inertia::render('Admin/Clinics/Edit', [
            'clinic' => $clinic,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClinicRequest $request, Clinic $clinic)
    {
        $validated = $request->validated();

        // Обработка JSON полей
        $validated = $this->processJsonFields($validated);

        // Обработка изображений
        $validated = $this->processImages($validated, $clinic);

        $clinic->update($validated);

        return redirect()->route('admin.clinics.index')
            ->with('success', 'Клиника успешно обновлена');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Clinic $clinic)
    {
        // Удаляем папку с изображениями
        $this->deleteClinicImages($clinic);

        $clinic->delete();

        return redirect()->route('admin.clinics.index')
            ->with('success', 'Клиника успешно удалена');
    }

    /**
     * Загрузка изображений для клиники
     */
    public function uploadImages(Request $request, Clinic $clinic)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
        ]);

        $uploadedImages = [];
        $clinicPath = "public/img/clinics/{$clinic->slug}";

        foreach ($request->file('images') as $image) {
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs($clinicPath, $filename);

            $uploadedImages[] = $filename;
        }

        // Добавляем новые изображения к существующей галерее
        $currentGallery = $clinic->gallery ?: [];
        $newGallery = array_merge($currentGallery, $uploadedImages);
        $clinic->update(['gallery' => $newGallery]);

        return response()->json([
            'success' => true,
            'images' => $uploadedImages,
            'gallery' => $newGallery
        ]);
    }

    /**
     * Удаление изображения из галереи
     */
    public function deleteImage(Request $request, Clinic $clinic)
    {
        $request->validate([
            'image' => 'required|string'
        ]);

        $imageToDelete = $request->input('image');
        $currentGallery = $clinic->gallery ?: [];

        // Удаляем изображение из массива
        $newGallery = array_filter($currentGallery, function($image) use ($imageToDelete) {
            return $image !== $imageToDelete;
        });

        // Удаляем файл с сервера
        $imagePath = "public/img/clinics/{$clinic->slug}/{$imageToDelete}";
        if (Storage::exists($imagePath)) {
            Storage::delete($imagePath);
        }

        $clinic->update(['gallery' => array_values($newGallery)]);

        return response()->json([
            'success' => true,
            'gallery' => array_values($newGallery)
        ]);
    }

    /**
     * Изменение порядка изображений в галерее
     */
    public function reorderGallery(Request $request, Clinic $clinic)
    {
        $request->validate([
            'gallery' => 'required|array',
            'gallery.*' => 'string'
        ]);

        $clinic->update(['gallery' => $request->input('gallery')]);

        return response()->json([
            'success' => true,
            'gallery' => $clinic->gallery
        ]);
    }

    /**
     * Обработка JSON полей
     */
    private function processJsonFields($data)
    {
        $jsonFields = [
            'working_hours_ru', 'working_hours_kk', 'working_hours_en',
            'specialties_ru', 'specialties_kk', 'specialties_en',
            'services_ru', 'services_kk', 'services_en',
            'accreditations_ru', 'accreditations_kk', 'accreditations_en',
            'equipment_ru', 'equipment_kk', 'equipment_en',
        ];

        foreach ($jsonFields as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = json_decode($data[$field], true);
            }
        }

        return $data;
    }

    /**
     * Обработка изображений
     */
    private function processImages($data, $clinic = null)
    {
        $clinicPath = $clinic ? "public/img/clinics/{$clinic->slug}" : null;

        // Обработка логотипа
        if (isset($data['logo']) && $data['logo'] instanceof \Illuminate\Http\UploadedFile) {
            $logoFilename = 'logo_' . time() . '.' . $data['logo']->getClientOriginalExtension();
            $data['logo']->storeAs($clinicPath, $logoFilename);
            $data['logo_path'] = $logoFilename;
            unset($data['logo']);
        }

        // Обработка главного изображения
        if (isset($data['hero']) && $data['hero'] instanceof \Illuminate\Http\UploadedFile) {
            $heroFilename = 'hero_' . time() . '.' . $data['hero']->getClientOriginalExtension();
            $data['hero']->storeAs($clinicPath, $heroFilename);
            $data['hero_path'] = $heroFilename;
            unset($data['hero']);
        }

        // Обработка галереи
        if (isset($data['gallery_files']) && is_array($data['gallery_files'])) {
            $uploadedImages = [];
            foreach ($data['gallery_files'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $filename = 'gallery_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->storeAs($clinicPath, $filename);
                    $uploadedImages[] = $filename;
                }
            }

            // Объединяем с существующей галереей
            $currentGallery = $clinic ? ($clinic->gallery ?: []) : [];
            $data['gallery'] = array_merge($currentGallery, $uploadedImages);
            unset($data['gallery_files']);
        }

        return $data;
    }

    /**
     * Удаление изображений клиники
     */
    private function deleteClinicImages($clinic)
    {
        $clinicPath = "public/img/clinics/{$clinic->slug}";
        if (Storage::exists($clinicPath)) {
            Storage::deleteDirectory($clinicPath);
        }
    }
}
