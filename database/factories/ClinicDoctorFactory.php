<?php

namespace Database\Factories;

use App\Models\ClinicDoctor;
use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClinicDoctorFactory extends Factory
{
    protected $model = ClinicDoctor::class;

    public function definition()
    {
        return [
            'clinic_id' => Clinic::factory(),
            'name_ru' => $this->faker->name,
            'name_kk' => $this->faker->name,
            'name_en' => $this->faker->name,
            'position_ru' => $this->faker->randomElement([
                'Главный врач', 'Кардиолог', 'Невролог', 'Ортопед', 
                'Гинеколог', 'Педиатр', 'Терапевт', 'Хирург'
            ]),
            'position_kk' => $this->faker->randomElement([
                'Бас дәрігер', 'Кардиолог', 'Невролог', 'Ортопед', 
                'Гинеколог', 'Педиатр', 'Терапевт', 'Хирург'
            ]),
            'position_en' => $this->faker->randomElement([
                'Chief Medical Officer', 'Cardiologist', 'Neurologist', 'Orthopedist', 
                'Gynecologist', 'Pediatrician', 'Therapist', 'Surgeon'
            ]),
            'photo_path' => null,
            'contacts' => [
                'phone' => $this->faker->phoneNumber,
                'email' => $this->faker->email,
            ],
            'is_featured' => $this->faker->boolean(20),
        ];
    }

    public function featured()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_featured' => true,
            ];
        });
    }
}
