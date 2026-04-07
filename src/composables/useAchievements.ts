import { ref } from 'vue'

export interface Achievement {
  id: string
  title: string
  description: string
  icon?: string
}

const unlockedIds = ref<Set<string>>(new Set())
const activeAchievements = ref<Achievement[]>([])

export const useAchievements = () => {
  
  const playSound = () => {
    const audio = new Audio('/sounds/coin.mp3')
    audio.volume = 0.2
    audio.play().catch(e => console.log('Audio play blocked:', e))
  }

  const unlock = (achievement: Achievement) => {
    if (unlockedIds.value.has(achievement.id)) return

    unlockedIds.value.add(achievement.id)
    playSound()

    activeAchievements.value.push(achievement)

    setTimeout(() => {
      activeAchievements.value = activeAchievements.value.filter(a => a.id !== achievement.id)
    }, 5000)
  }

  return {
    unlock,
    activeAchievements
  }
}