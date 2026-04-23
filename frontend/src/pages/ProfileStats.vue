<template>
  <div class="stats-page">
    <v-container class="py-10 py-md-16">
      <section class="stats-header mb-8">
        <p class="stats-kicker">Àrea de Jugador</p>
        <h1 class="stats-title">Estadístiques del jugador</h1>
        <p class="stats-copy">
          Consulta el teu progrés a Explosive Race. Les dades es sincronitzen en temps real amb el rànquing global.
        </p>
      </section>

      <v-card class="stats-shell" rounded="xl">
        <v-card-title class="d-flex align-center justify-space-between ga-3 flex-wrap">
          <span>{{ username }}</span>
          <v-chip color="#f1b36b" text-color="#101826" variant="flat">
            {{ monthLabel }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <v-progress-linear
            v-if="authStore.loading"
            color="#f1b36b"
            indeterminate
          />

          <v-alert
            v-else-if="authStore.error"
            class="mb-4"
            density="comfortable"
            type="error"
            variant="tonal"
          >
            {{ authStore.error }}
          </v-alert>

          <div v-else class="stats-grid">
            <article class="stat-card warm">
              <span>Victòries (Mes)</span>
              <strong>{{ valueOrZero(stats.monthlyGamesWon) }}</strong>
            </article>
            <article class="stat-card">
              <span>Victòries (Total)</span>
              <strong>{{ valueOrZero(stats.gamesWon) }}</strong>
            </article>
            <article class="stat-card">
              <span>Partides Jugades</span>
              <strong>{{ valueOrZero(stats.gamesPlayed) }}</strong>
            </article>
            <article class="stat-card">
              <span>Ítems Utilitzats</span>
              <strong>{{ valueOrZero(stats.itemsUsed) }}</strong>
            </article>
            <article class="stat-card">
              <span>Monedes</span>
              <strong>{{ valueOrZero(stats.coinsCollected) }}</strong>
            </article>
            <article class="stat-card">
              <span>Mortes</span>
              <strong>{{ valueOrZero(stats.deaths) }}</strong>
            </article>
          </div>

          <div class="mt-6 d-flex ga-3 flex-wrap">
            <v-btn
              :loading="authStore.loading"
              class="refresh-btn"
              rounded="xl"
              variant="flat"
              @click="refreshStats"
            >
              Actualitzar dades
            </v-btn>
            <v-btn
              rounded="xl"
              variant="outlined"
              @click="authStore.logout()"
            >
              Sortir
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'

  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()

  const stats = computed(() => authStore.user || {})

  const username = computed(() => stats.value.username || 'Player')

  const monthLabel = computed(() => {
    const month = stats.value.month
    if (!month || typeof month !== 'string') {
      return 'Mes actual'
    }

    const date = new Date(`${month}-01T00:00:00Z`)
    if (Number.isNaN(date.getTime())) {
      return month
    }

    return new Intl.DateTimeFormat('ca-ES', {
      month: 'long',
      year: 'numeric',
    }).format(date)
  })

  function valueOrZero(value: unknown) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  async function refreshStats () {
    await authStore.fetchProfile()
  }

  onMounted(async () => {
    if (!authStore.user) {
      await authStore.fetchProfile()
    }
  })
</script>

<style scoped>
  .stats-page {
    background:
      radial-gradient(circle at 18% 15%, rgba(241, 179, 107, 0.16), transparent 24%),
      radial-gradient(circle at 82% 5%, rgba(143, 184, 216, 0.16), transparent 22%),
      linear-gradient(180deg, #0b1220 0%, #131d30 100%);
    min-height: 100%;
  }

  .stats-kicker {
    color: #f1b36b;
    font-family: "Space Grotesk", sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 0.8rem;
    text-transform: uppercase;
  }

  .stats-title {
    color: #f6efe4;
    font-family: "Bebas Neue", "Oswald", sans-serif;
    font-size: clamp(2.6rem, 5vw, 4.2rem);
    font-weight: 400;
    line-height: 0.95;
    margin: 0;
  }

  .stats-copy {
    color: #a9bccb;
    font-family: "Space Grotesk", sans-serif;
    line-height: 1.8;
    margin: 1rem 0 0;
    max-width: 64ch;
  }

  .stats-shell {
    background: rgba(17, 27, 43, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.24);
    color: #f6efe4;
    padding: 0.4rem;
  }

  .stats-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1.2rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 18px;
    padding: 1rem;
  }

  .stat-card.warm {
    background: linear-gradient(140deg, rgba(241, 179, 107, 0.2), rgba(215, 122, 97, 0.1));
    border-color: rgba(241, 179, 107, 0.36);
  }

  .stat-card span {
    color: #a9bccb;
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
    text-transform: uppercase;
  }

  .stat-card strong {
    color: #f6efe4;
    display: block;
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(1.4rem, 3.5vw, 2.2rem);
    font-weight: 700;
    line-height: 1.1;
  }

  .refresh-btn {
    background: linear-gradient(135deg, #f1b36b, #d77a61);
    color: #101826;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    text-transform: none;
  }

  @media (max-width: 980px) {
    .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 700px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
