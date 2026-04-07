<script setup>
const props = defineProps({
  options: { type: Array, required: true },
  selected: { type: String, required: true },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div class="picker">
    <p class="label">Too scary? Pick a friendlier visitor:</p>
    <div class="options">
      <button
        v-for="opt in options"
        :key="opt.id"
        class="option"
        :class="{ active: selected === opt.icon }"
        :title="opt.name"
        @click="emit('select', opt.id)"
      >
        <span class="icon">{{ opt.icon }}</span>
        <span class="name">{{ opt.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.picker {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
}

.label {
  font-family: 'Gaegu', cursive;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: #ffd580;
}

.options { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }

.option {
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
  color: #f0e6d3;
  font-family: 'Baloo 2', cursive;
}

.option:hover { background: rgba(255, 255, 255, 0.15); }
.option.active { border-color: #ffd580; background: rgba(255, 213, 128, 0.15); }

.icon { font-size: 1.4rem; }
.name { font-size: 0.8rem; }
</style>
