<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Clinic;
use App\Models\ClinicDoctor;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ClinicTest extends TestCase
{
    use RefreshDatabase;

    public function test_clinics_index_page_loads()
    {
        // Создаем тестовую клинику
        $clinic = Clinic::factory()->create([
            'city_ru' => 'OtherCity',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $response = $this->get('/clinics');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Clinics/Index')
            ->has('clinics.data')
        );
    }

    public function test_clinic_show_page_loads()
    {
        $clinic = Clinic::factory()->create([
            'city_ru' => 'OtherCity',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $response = $this->get("/clinics/{$clinic->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Clinics/Show')
            ->has('clinic')
        );
    }

    public function test_unpublished_clinic_returns_404()
    {
        $clinic = Clinic::factory()->create([
            'is_published' => false,
        ]);

        $response = $this->get("/clinics/{$clinic->slug}");

        $response->assertStatus(404);
    }

    public function test_clinic_search_works()
    {
        $clinic1 = Clinic::factory()->create([
            'name_ru' => 'Тестовая клиника',
            'city_ru' => 'OtherCity',
            'city_kk' => 'OtherCity',
            'city_en' => 'OtherCity',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $clinic2 = Clinic::factory()->create([
            'name_ru' => 'Другая клиника',
            'city_ru' => 'OtherCity',
            'city_kk' => 'OtherCity',
            'city_en' => 'OtherCity',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $response = $this->get('/clinics?search=Тестовая');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Clinics/Index')
            ->has('clinics.data', 1)
        );
    }

    public function test_clinic_filter_by_city_works()
    {
        $clinic1 = Clinic::factory()->create([
            'city_ru' => 'Астана',
            'city_kk' => 'Астана',
            'city_en' => 'Astana',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $clinic2 = Clinic::factory()->create([
            'city_ru' => 'Алматы',
            'city_kk' => 'Алматы',
            'city_en' => 'Almaty',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $response = $this->get('/clinics?city=Астана');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Clinics/Index')
            ->has('clinics.data', 1)
        );
    }

    public function test_clinic_doctors_relationship_works()
    {
        $clinic = Clinic::factory()->create([
            'city_ru' => 'OtherCity',
            'is_published' => true,
            'publish_at' => now(),
        ]);

        $doctor = ClinicDoctor::factory()->create([
            'clinic_id' => $clinic->id,
        ]);

        $response = $this->get("/clinics/{$clinic->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Clinics/Show')
            ->has('clinic.doctors', 1)
        );
    }

    public function test_clinic_slug_generation_works()
    {
        $clinic = Clinic::factory()->create([
            'name_ru' => 'Тестовая клиника',
            'slug' => null, // Позволяем автогенерацию
        ]);

        $this->assertEquals('testovaia-klinika', $clinic->slug);
    }

    public function test_clinic_unique_slug_generation_works()
    {
        $clinic1 = Clinic::factory()->create([
            'name_ru' => 'Тестовая клиника',
            'slug' => null,
        ]);

        $clinic2 = Clinic::factory()->create([
            'name_ru' => 'Тестовая клиника',
            'slug' => null,
        ]);

        $this->assertEquals('testovaia-klinika', $clinic1->slug);
        $this->assertEquals('testovaia-klinika-1', $clinic2->slug);
    }
}
