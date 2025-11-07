<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = News::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'excerpt' => $this->faker->sentence(12),
            'body' => $this->faker->paragraphs(3, true),
            'content' => $this->faker->paragraphs(3, true),
            'cover_image_path' => null,
            'cover_image_thumb_path' => null,
            'cover_image_alt' => null,
            'seo_title' => null,
            'seo_description' => null,
            'status' => 'draft',
            'published_at' => null,
            'created_by' => null,
        ];
    }

    /**
     * Состояние опубликованной новости.
     */
    public function published(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'published',
                'published_at' => now(),
            ];
        });
    }
}
