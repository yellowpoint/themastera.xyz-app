/**
 * Work categories configuration file
 * Contains music categories and language classifications
 */

// Music categories
export const MUSIC_CATEGORIES = [
  'Pop',
  'Hip-Hop/Rap',
  'Rock',
  'Latin',
  'R&B/Soul',
  'Electronic/Dance',
  'Country',
  'K-Pop',
  'Afrobeats',
  'Metal',
  'Indie/Alternative',
  'Jazz',
  'Classical',
  'Folk&Singer-Songwriter',
  'Blues',
  'Original',
]

// Language classifications
export const LANGUAGE_CATEGORIES = [
  'None',
  'English',
  'Chinese',
  'Spanish',
  'French',
  'Japanese',
  'Korean',
  'German',
  'Italian',
  'Portuguese',
  'Cantonese',
]

// Get all categories
export const getAllCategories = () => {
  return MUSIC_CATEGORIES
}

// Get all languages
export const getAllLanguages = () => {
  return LANGUAGE_CATEGORIES
}

// Validate if category is valid
export const isValidCategory = (category: string) => {
  return MUSIC_CATEGORIES.includes(category)
}

// Validate if language is valid
export const isValidLanguage = (language: string) => {
  return LANGUAGE_CATEGORIES.includes(language)
}

export default {
  MUSIC_CATEGORIES,
  LANGUAGE_CATEGORIES,
  getAllCategories,
  getAllLanguages,
  isValidCategory,
  isValidLanguage,
}
