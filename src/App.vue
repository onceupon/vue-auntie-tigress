<script setup>
import StoryHeader from './components/StoryHeader.vue'
import CreatureMap from './components/CreatureMap.vue'
import IconPicker from './components/IconPicker.vue'
import { useCreatureTracker } from './composables/useCreatureTracker'
import { useGeolocation } from './composables/useGeolocation'

const { position: homePosition } = useGeolocation()
const { creature, selectCreature, creatureOptions } = useCreatureTracker(homePosition)
</script>

<template>
  <div class="app">
    <StoryHeader />
    <IconPicker
      :options="creatureOptions"
      :selected="creature.icon"
      @select="selectCreature"
    />
    <CreatureMap
      :home="homePosition"
      :creature="creature"
    />
    <footer class="footer">
      <p>🌙 Better go to sleep before {{ creature.name }} gets closer… 🌙</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&family=Gaegu:wght@400;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Baloo 2', cursive;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #f0e6d3;
  min-height: 100vh;
}

.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.footer {
  text-align: center;
  font-family: 'Gaegu', cursive;
  font-size: 1.2rem;
  opacity: 0.8;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>
