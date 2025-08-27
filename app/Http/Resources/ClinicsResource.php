<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicsResource extends JsonResource
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
            'city' => $this->city,
            'logo_url' => $this->logo_url,
            'hero_url' => $this->hero_url,
            'specialties' => $this->specialties ? array_slice($this->specialties, 0, 3) : [],
            'specialties_count' => $this->specialties ? count($this->specialties) : 0,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'map_lat' => $this->map_lat,
            'map_lng' => $this->map_lng,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
