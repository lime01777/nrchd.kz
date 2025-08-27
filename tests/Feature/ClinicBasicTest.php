<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Clinic;
use App\Models\ClinicDoctor;
use App\Http\Controllers\ClinicController;
use App\Http\Controllers\Admin\ClinicController as AdminClinicController;

class ClinicBasicTest extends TestCase
{
    public function test_clinics_index_page_loads()
    {
        $response = $this->get('/clinics');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Clinics/Index')
        );
    }

    public function test_clinics_route_exists()
    {
        $response = $this->get('/clinics');
        $response->assertStatus(200);
    }

    public function test_clinic_model_exists()
    {
        $this->assertTrue(class_exists(Clinic::class));
    }

    public function test_clinic_doctor_model_exists()
    {
        $this->assertTrue(class_exists(ClinicDoctor::class));
    }

    public function test_clinic_controller_exists()
    {
        $this->assertTrue(class_exists(ClinicController::class));
    }

    public function test_admin_clinic_controller_exists()
    {
        $this->assertTrue(class_exists(AdminClinicController::class));
    }
}
