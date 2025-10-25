/**
 * 作品分类配置文件
 * 包含音乐类别和语言分类
 */

// 音乐类别
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
  'Original'
];

// 语言分类
export const LANGUAGE_CATEGORIES = [
  "None",
  'English',
  'Chinese',
  'Spanish',
  'French',
  'Japanese',
  'Korean',
  'German',
  'Italian',
  'Portuguese',
  'Cantonese'
];

// 获取所有分类
export const getAllCategories = () => {
  return MUSIC_CATEGORIES;
};

// 获取所有语言
export const getAllLanguages = () => {
  return LANGUAGE_CATEGORIES;
};

// 验证分类是否有效
export const isValidCategory = (category) => {
  return MUSIC_CATEGORIES.includes(category);
};

// 验证语言是否有效
export const isValidLanguage = (language) => {
  return LANGUAGE_CATEGORIES.includes(language);
};

export default {
  MUSIC_CATEGORIES,
  LANGUAGE_CATEGORIES,
  getAllCategories,
  getAllLanguages,
  isValidCategory,
  isValidLanguage
};