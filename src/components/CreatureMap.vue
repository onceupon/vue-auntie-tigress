<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  home: { type: Object, required: true },
  creature: { type: Object, required: true },
})

const mapContainer = ref(null)
let map = null
let homeMarker = null
let creatureMarker = null
let trailLine = null

function emojiIcon(emoji, size = 36) {
  return L.divIcon({
    html: `<span style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">${emoji}</span>`,
    className: 'emoji-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: [props.home.lat, props.home.lng],
    zoom: 15,
    zoomControl: true,
    attributionControl: false,
  })

  L.control.attribution({ prefix: false, position: 'bottomright' })
    .addAttribution('© <a href="https://stamen.com">Stamen</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>')
    .addTo(map)

  // Stamen Watercolor — hand-painted style via Stadia Maps
  L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
    attribution: '',
    maxZoom: 18,
  }).addTo(map)

  // Semi-transparent label overlay so streets are readable
  L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    opacity: 0.5,
    attribution: '',
  }).addTo(map)

  homeMarker = L.marker([props.home.lat, props.home.lng], {
    icon: emojiIcon('🏡', 32),
  }).addTo(map).bindTooltip('Your Home', {
    permanent: true, direction: 'bottom', className: 'cute-tooltip',
    offset: [0, 10],
  })

  creatureMarker = L.marker([props.creature.lat, props.creature.lng], {
    icon: emojiIcon(props.creature.icon, 38),
  }).addTo(map).bindTooltip(props.creature.name, {
    permanent: true, direction: 'bottom', className: 'cute-tooltip creature-tooltip',
    offset: [0, 12],
  })

  trailLine = L.polyline(
    [[props.home.lat, props.home.lng], [props.creature.lat, props.creature.lng]],
    { color: '#ffd580', weight: 2, dashArray: '6 6', opacity: 0.5 }
  ).addTo(map)
})

let initialViewSet = false

// Update markers when home position changes (geolocation resolves)
watch(() => props.home, (h) => {
  if (!map) return
  homeMarker?.setLatLng([h.lat, h.lng])
  if (!initialViewSet) {
    const bounds = L.latLngBounds(
      [h.lat, h.lng],
      [props.creature.lat, props.creature.lng]
    )
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 })
    initialViewSet = true
  }
}, { deep: true })

// Update creature marker position, icon, and trail
watch(() => props.creature, (c) => {
  if (!map) return
  creatureMarker?.setLatLng([c.lat, c.lng])
  creatureMarker?.setIcon(emojiIcon(c.icon, 38))
  creatureMarker?.setTooltipContent(c.name)
  trailLine?.setLatLngs([
    [props.home.lat, props.home.lng],
    [c.lat, c.lng],
  ])
}, { deep: true })

onUnmounted(() => map?.remove())

// Distance + danger (same logic, now for the status bar)
const distanceMeters = computed(() => {
  const R = 6371000
  const dLat = ((props.creature.lat - props.home.lat) * Math.PI) / 180
  const dLng = ((props.creature.lng - props.home.lng) * Math.PI) / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((props.home.lat * Math.PI) / 180) *
    Math.cos((props.creature.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
})

const distanceLabel = computed(() =>
  distanceMeters.value > 1000
    ? (distanceMeters.value / 1000).toFixed(1) + ' km'
    : distanceMeters.value + ' m'
)

const dangerLevel = computed(() => {
  const d = distanceMeters.value
  if (d < 300) return { text: 'GO TO SLEEP NOW! 😱', color: '#ff4444' }
  if (d < 600) return { text: 'Getting close… 😰', color: '#ff8844' }
  if (d < 1000) return { text: 'Nearby… stay alert 😟', color: '#ffaa44' }
  return { text: 'Safe… for now 😌', color: '#88cc66' }
})
</script>

<template>
  <div class="map-container">
    <div class="map-label">📍 Live Tracker</div>
    <div ref="mapContainer" class="map-leaflet" />
    <div class="status">
      <span class="distance">📏 {{ distanceLabel }} away</span>
      <span class="danger" :style="{ color: dangerLevel.color }">
        {{ dangerLevel.text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: relative;
}

.map-label {
  font-family: 'Gaegu', cursive;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffd580;
}

.map-leaflet {
  width: 100%;
  height: 350px;
  border-radius: 12px;
  border: 2px solid rgba(255, 213, 128, 0.2);
  z-index: 0;
}

/* Storybook filter on map tiles */
.map-leaflet :deep(.leaflet-tile-pane) {
  filter: saturate(1.4) brightness(0.85) hue-rotate(-10deg) sepia(0.15);
}

/* Warm vignette overlay */
.map-leaflet::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(15, 12, 41, 0.5) 100%);
  pointer-events: none;
  z-index: 1;
}

.status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.distance { color: #aac4ff; }

.danger {
  font-family: 'Gaegu', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>

<style>
/* Leaflet tooltip overrides (unscoped so they apply to Leaflet DOM) */
.cute-tooltip {
  font-family: 'Gaegu', cursive !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  background: rgba(30, 20, 50, 0.85) !important;
  color: #ffd580 !important;
  border: 1px solid rgba(255, 213, 128, 0.3) !important;
  border-radius: 8px !important;
  padding: 2px 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

.cute-tooltip.creature-tooltip {
  color: #ff8844 !important;
}

.cute-tooltip::before {
  border-bottom-color: rgba(30, 20, 50, 0.85) !important;
}

.emoji-marker {
  background: none !important;
  border: none !important;
}

/* Collapse attribution — expands on hover */
.leaflet-control-attribution {
  font-size: 9px !important;
  background: rgba(30, 20, 50, 0.6) !important;
  color: #aaa !important;
  max-width: 20px;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.3s ease;
  border-radius: 6px 0 0 0 !important;
  padding: 2px 5px !important;
}

.leaflet-control-attribution::before {
  content: 'ℹ️';
}

.leaflet-control-attribution:hover {
  max-width: 300px;
}

.leaflet-control-attribution a {
  color: #ffd580 !important;
}
</style>
