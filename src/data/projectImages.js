/** Curated project photos in `public/assets/images/projects/`. Single source for Portfolio + Home. */
export const PROJECT_IMAGE_COUNT = 37

export const projectImages = Array.from({ length: PROJECT_IMAGE_COUNT }, (_, i) => ({
  src: `/assets/images/projects/project-${i + 1}.png`,
}))
