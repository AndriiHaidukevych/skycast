export const API_ERRORS = {
  CITY_REQUIRED: "city param is required",
  CITY_NOT_FOUND: (city: string) => `City "${city}" not found`,
  WEATHER_FETCH_FAILED: "Failed to fetch weather data",
  FORECAST_FETCH_FAILED: "Failed to fetch forecast",
  UNAUTHORIZED: "Unauthorized",
  INVALID_BODY: "Invalid body",
  NOT_FOUND: "Not found",
  INTERNAL_ERROR: "Internal server error",
} as const;

export const RECOMMENDATION_MESSAGES = {
  outfit: {
    HEAVY_COAT: {
      title: "Heavy Winter Coat",
      description: "It's freezing outside. Bundle up with a heavy coat, scarf, and gloves.",
    },
    WARM_COAT: {
      title: "Warm Coat",
      description: "Cold conditions — a warm wool coat and layers will keep you comfortable.",
    },
    LAYER_UP: {
      title: "Layer Up",
      description:
        "The morning breeze is crisp. A light trench coat or denim jacket over a sweater works well.",
    },
    LIGHT_LAYERS: {
      title: "Light Layers",
      description: "Comfortable temps — a light jacket or cardigan is all you need.",
    },
    LIGHT_CLOTHING: {
      title: "Light Clothing",
      description: "Warm and pleasant. Light, breathable clothing is the way to go.",
    },
    SUFFIX_UMBRELLA: " Don't forget an umbrella.",
    SUFFIX_WIND: " It's windy — opt for a windproof outer layer.",
  },
  activity: {
    STAY_INDOORS: {
      title: "Stay Indoors",
      description: "Stormy conditions — a perfect day to stay in and relax or catch up on work.",
      icon: "home",
    },
    INDOOR_ACTIVITIES: {
      title: "Indoor Activities",
      description: "Rain is falling — great time for a gym session, yoga, or a café visit.",
      icon: "fitness_center",
    },
    LIGHT_INDOOR: {
      title: "Light Indoor Exercise",
      description:
        "Too cold for outdoor activities. Consider an indoor workout or a brisk short walk.",
      icon: "self_improvement",
    },
    MORNING_EVENING: {
      title: "Morning or Evening Workout",
      description: "Avoid outdoor activity in peak heat. Morning runs before 10am are ideal.",
      icon: "wb_twilight",
    },
    OUTDOOR_JOGGING: {
      title: "Outdoor Jogging",
      description:
        "Perfect conditions for a run. The temperature and humidity make for an enjoyable workout.",
      icon: "directions_run",
    },
    CASUAL_WALK: {
      title: "Casual Outdoor Walk",
      description:
        "Conditions are fair. A relaxed walk or light outdoor activity suits the weather.",
      icon: "directions_walk",
    },
  },
  health: {
    HIGH_UV: {
      title: "High UV Alert",
      description:
        "UV index is very high. Apply SPF 50+ sunscreen, wear a hat, and limit midday sun exposure.",
      icon: "wb_sunny",
    },
    APPLY_SUNSCREEN: {
      title: "Apply Sunscreen",
      description: "Moderate-high UV levels. Apply sunscreen before heading out.",
      icon: "health_and_safety",
    },
    STAY_HYDRATED: {
      title: "Stay Hydrated",
      description: "High humidity can be draining. Drink plenty of water throughout the day.",
      icon: "water_drop",
    },
    POLLEN_ALERT: {
      title: "Pollen Alert",
      description:
        "Tree pollen counts are elevated. Keep windows closed and stay hydrated if you're sensitive.",
      icon: "local_florist",
    },
    AIR_QUALITY_GOOD: {
      title: "Air Quality Good",
      description: "No significant health concerns today. Enjoy the fresh air.",
      icon: "air",
    },
  },
} as const;
