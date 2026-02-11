<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AiServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = require base_path('database/seeders/services_data.php');

        foreach ($services as $slug => $data) {
            // Ensure ID is preserved or let auto-increment handle it if not needed.
            // Since we might want to keep existing references (if any), we can keep ID.
            // But usually ID is auto-increment.
            // The array has 'id' field, but it might conflict if we truncate and re-seed.
            // Let's use updateOrCreate by slug.
            
            \App\Models\AiService::updateOrCreate(
                ['slug' => $slug], // Search by slug (since it's unique)
                [
                    'name' => $data['name'] ?? '',
                    'pathology' => $data['pathology'] ?? null,
                    'modality' => $data['modality'] ?? null,
                    'area' => $data['area'] ?? null,
                    'status' => $data['status'] ?? 'inactive',
                    'company' => $data['company'] ?? null,
                    'image' => $data['image'] ?? null,
                    'videoUrl' => $data['videoUrl'] ?? null,
                    'description' => $data['description'] ?? null,
                    'briefInfo' => $data['briefInfo'] ?? null,
                    'advantages' => $data['advantages'] ?? null,
                    'purpose' => $data['purpose'] ?? null,
                    'effectiveness' => $data['effectiveness'] ?? null,
                    'targetPopulation' => $data['targetPopulation'] ?? null,
                    'calibrationRequired' => $data['calibrationRequired'] ?? null,
                    'decisionSupport' => $data['decisionSupport'] ?? null,
                    'validationTable' => $data['validationTable'] ?? null,
                    'risks' => $data['risks'] ?? null,
                    'limitations' => $data['limitations'] ?? null,
                    'discontinuationReasons' => $data['discontinuationReasons'] ?? null,
                ]
            );
        }
    }
}
