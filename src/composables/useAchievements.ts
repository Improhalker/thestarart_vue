import { ref } from 'vue'

export interface Achievement {
  id: string
  title: string
  description: string
  icon?: string
}

const unlockedIds = ref<Set<string>>(new Set())
const currentAchievement = ref<Achievement | null>(null)
const isShowing = ref(false)

export const useAchievements = () => {
  
  const playSound = () => {
    const audio = new Audio('/sounds/coin.mp3')
    audio.volume = 0.3
    audio.play().catch(e => console.log('Audio play blocked:', e))
  }

  const unlock = (achievement: Achievement) => {
    if (unlockedIds.value.has(achievement.id)) return

    unlockedIds.value.add(achievement.id)

    playSound()

    if (isShowing.value) {
      return 
    }

    currentAchievement.value = achievement
    isShowing.value = true

    setTimeout(() => {
      isShowing.value = false
      setTimeout(() => currentAchievement.value = null, 500) 
    }, 4500)
  }

  return {
    unlock,
    currentAchievement,
    isShowing
  }
}