import { ref, onMounted, onUnmounted } from 'vue'

export function useGeolocation() {
  const position = ref({ lat: 25.033, lng: 121.565 }) // Default: Taipei
  const error = ref(null)
  let watchId = null

  onMounted(() => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }

    // watchPosition works more reliably on iOS than getCurrentPosition
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        position.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      },
      (err) => {
        error.value = err.message
      },
      options
    )
  })

  onUnmounted(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
    }
  })

  return { position, error }
}
