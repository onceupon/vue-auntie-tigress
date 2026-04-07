<script setup>
import { ref, onMounted } from 'vue'

const stars = ref([])

onMounted(() => {
  stars.value = Array.from({ length: 30 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
  }))
})
</script>

<template>
  <header class="header">
    <div class="stars">
      <span
        v-for="(star, i) in stars"
        :key="i"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          animationDelay: star.delay + 's',
        }"
      />
    </div>
    <h1 class="title">🐯 虎姑婆</h1>
    <p class="subtitle">Auntie Tigress Tracker</p>
    <p class="description">
      A classic Taiwanese folk tale — a tiger spirit from the mountains
      disguises herself as an old auntie, sneaking into homes at night
      to snatch children who won't fall asleep.
      Track where she is tonight! 🌙
    </p>
  </header>
</template>

<style scoped>
.header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  position: relative;
  overflow: hidden;
}

.stars { position: absolute; inset: 0; pointer-events: none; }

.star {
  position: absolute;
  background: #fffbe6;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

.title {
  font-family: 'Gaegu', cursive;
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 165, 0, 0.5);
  margin-bottom: 0.1rem;
}

.subtitle {
  font-family: 'Gaegu', cursive;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd580;
  margin-bottom: 0.8rem;
}

.description {
  font-size: 0.95rem;
  line-height: 1.5;
  max-width: 440px;
  margin: 0 auto;
  opacity: 0.85;
}
</style>
