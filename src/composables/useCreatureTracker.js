import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'

const CREATURE_OPTIONS = [
  { id: 'tiger', icon: '🐯', name: 'Auntie Tigress' },
  { id: 'wolf', icon: '🐺', name: 'Big Bad Wolf' },
  { id: 'puppy', icon: '🐶', name: 'Lost Puppy' },
  { id: 'kitten', icon: '🐱', name: 'Sneaky Kitten' },
  { id: 'mummy', icon: '🧟', name: 'Sleepy Mummy' },
  { id: 'ghost', icon: '👻', name: 'Friendly Ghost' },
]

export function useCreatureTracker(homePosition) {
  const creature = reactive({
    lat: 0,
    lng: 0,
    icon: '🐯',
    name: 'Auntie Tigress',
  })

  let interval = null
  let angle = Math.random() * Math.PI * 2
  let radius = 0.008 + Math.random() * 0.004

  function updatePosition(home) {
    angle += 0.03 + Math.random() * 0.02
    radius = Math.max(0.001, radius - 0.00003)
    const wobble = (Math.random() - 0.5) * 0.001

    creature.lat = home.lat + Math.sin(angle) * radius + wobble
    creature.lng = home.lng + Math.cos(angle) * radius + wobble
  }

  watch(homePosition, (home) => {
    radius = 0.008 + Math.random() * 0.004
    updatePosition(home)
  }, { immediate: true })

  onMounted(() => {
    interval = setInterval(() => updatePosition(homePosition.value), 1500)
  })

  onUnmounted(() => clearInterval(interval))

  function selectCreature(id) {
    const opt = CREATURE_OPTIONS.find((o) => o.id === id)
    if (opt) {
      creature.icon = opt.icon
      creature.name = opt.name
    }
  }

  return {
    creature,
    creatureOptions: CREATURE_OPTIONS,
    selectCreature,
  }
}
