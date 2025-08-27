<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'short_desc' => $this->short_desc,
            'full_desc' => $this->full_desc,
            'city' => $this->city,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'working_hours' => $this->working_hours,
            'specialties' => $this->specialties,
            'services' => $this->services,
            'accreditations' => $this->accreditations,
            'equipment' => $this->equipment,
            'map_lat' => $this->map_lat,
            'map_lng' => $this->map_lng,
            'logo_url' => $this->logo_url,
            'hero_url' => $this->hero_url,
            'gallery_urls' => $this->gallery_urls,
            'seo_title' => $this->seo_title,
            'seo_desc' => $this->seo_desc,
            'doctors' => $this->whenLoaded('doctors', function () {
                return $this->doctors->map(function ($doctor) {
                    return [
                        'id' => $doctor->id,
                        'name' => $doctor->name,
                        'position' => $doctor->position,
                        'photo_url' => $doctor->photo_url,
                        'contacts' => $doctor->contacts,
                        'is_featured' => $doctor->is_featured,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
