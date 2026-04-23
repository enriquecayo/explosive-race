<template>
  <div class="home-page">
    <v-container class="py-10 py-md-16">
      <section class="hero-grid">
        <v-sheet class="hero-panel" rounded="xl">
          <p class="eyebrow">Arena multijugador d'acció pura</p>
          <h1 class="hero-title">Domina la pista a Explosive Race i puja al podi.</h1>
          <p class="hero-copy">
            Benvingut al Game Hub oficial. Gestiona el teu progrés, consulta el rànquing 
            en temps real i descarrega l'última versió per començar a competir.
          </p>

          <div class="hero-actions">
            <v-btn
              class="cta-primary"
              color="white"
              rounded="xl"
              size="large"
              to="/downloads"
              variant="flat"
            >
              Descarrega el Joc
            </v-btn>
            <v-btn
              class="cta-secondary"
              rounded="xl"
              size="large"
              to="/login"
              variant="outlined"
            >
              Accedeix al Perfil
            </v-btn>
          </div>
        </v-sheet>

        <v-card class="hero-stats" rounded="xl" variant="tonal">
          <v-card-text>
            <p class="stats-label">Top 10 Victòries del Mes</p>
            <v-progress-linear
              v-if="rankingStore.loading"
              color="#f1b36b"
              indeterminate
            />
            <v-alert
              v-else-if="rankingStore.error"
              density="comfortable"
              type="warning"
              variant="tonal"
            >
              {{ rankingStore.error }}
            </v-alert>
            <div v-else class="leaderboard-list">
              <div
                v-for="player in topPlayers"
                :key="player.id"
                class="leaderboard-item"
              >
                <div>
                  <p class="player-name">{{ player.name }}</p>
                  <p class="player-rank">Posició #{{ player.position }}</p>
                </div>
                <span class="player-score">{{ player.gamesWon }} W</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </section>

      <section class="info-grid mt-8 mt-md-12">
        <v-card class="info-card" rounded="xl">
          <v-card-title>Què t'espera?</v-card-title>
          <v-card-text>
            <div class="feature-list">
              <div class="feature-item">
                <v-icon icon="mdi-sword-cross" />
                <span>Competició intensa a Unity amb rànquings mundials.</span>
              </div>
              <div class="feature-item">
                <v-icon icon="mdi-cloud-download" />
                <span>Actualitzacions automàtiques i accés directe a la build.</span>
              </div>
              <div class="feature-item">
                <v-icon icon="mdi-account-badge" />
                <span>Perfil personalitzat connectat amb la teva activitat.</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="info-card accent-card" rounded="xl">
          <v-card-title>Sincronització en Temps Real</v-card-title>
          <v-card-text>
            La teva puntuació es guarda automàticament a MongoDB Atlas. 
            Cada victòria compta per al rànquing mensual, on només els millors 
            aconsegueixen aparèixer al Top 10 oficial de la temporada.
          </v-card-text>
        </v-card>
      </section>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'

  import { useRankingStore } from '@/stores/ranking'

  const rankingStore = useRankingStore()

  const topPlayers = computed(() => rankingStore.topPlayers)

  onMounted(() => {
    if (!rankingStore.entries.length) {
      rankingStore.fetchLeaderboard()
    }
  })
</script>

<style scoped>
  .home-page {
    --gh-bg: #0d1421;
    --gh-panel: rgba(20, 31, 49, 0.86);
    --gh-line: rgba(255, 255, 255, 0.08);
    --gh-text: #f6efe4;
    --gh-muted: #a9bccb;
    --gh-accent: #f1b36b;
    --gh-warm: #d77a61;
    background:
      radial-gradient(circle at top left, rgba(241, 179, 107, 0.18), transparent 32%),
      radial-gradient(circle at 85% 10%, rgba(119, 153, 181, 0.16), transparent 24%),
      linear-gradient(180deg, #08111d 0%, var(--gh-bg) 100%);
    min-height: 100%;
  }

  .hero-grid,
  .info-grid {
    display: grid;
    gap: 1.5rem;
  }

  .hero-grid {
    grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
  }

  .hero-panel,
  .hero-stats,
  .info-card {
    background: var(--gh-panel);
    border: 1px solid var(--gh-line);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
  }

  .hero-panel {
    overflow: hidden;
    padding: 2.5rem;
    position: relative;
  }

  .hero-panel::after {
    background: linear-gradient(135deg, rgba(241, 179, 107, 0.2), rgba(215, 122, 97, 0.05));
    content: "";
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  .eyebrow,
  .stats-label {
    color: var(--gh-accent);
    font-family: "Space Grotesk", sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  .hero-title {
    color: var(--gh-text);
    font-family: "Bebas Neue", "Oswald", sans-serif;
    font-size: clamp(3.4rem, 8vw, 5.8rem);
    font-weight: 400;
    line-height: 0.92;
    margin-bottom: 1rem;
    max-width: 12ch;
    position: relative;
    z-index: 1;
  }

  .hero-copy {
    color: var(--gh-muted);
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.05rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    max-width: 58ch;
    position: relative;
    z-index: 1;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    position: relative;
    z-index: 1;
  }

  .cta-primary,
  .cta-secondary {
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: none;
  }

  .cta-primary {
    color: #0f1828;
  }

  .cta-secondary {
    border-color: rgba(255, 255, 255, 0.16);
    color: var(--gh-text);
  }

  .hero-stats {
    color: var(--gh-text);
    padding: 1rem;
  }

  .leaderboard-list {
    display: grid;
    gap: 0.85rem;
    margin-top: 1.25rem;
  }

  .leaderboard-item {
    align-items: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 18px;
    display: flex;
    justify-content: space-between;
    padding: 0.95rem 1rem;
  }

  .player-name {
    color: var(--gh-text);
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    margin: 0;
  }

  .player-rank {
    color: var(--gh-muted);
    font-size: 0.9rem;
    margin: 0.2rem 0 0;
  }

  .player-score {
    color: var(--gh-accent);
    font-family: "Bebas Neue", "Oswald", sans-serif;
    font-size: 2rem;
    line-height: 1;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .info-card {
    color: var(--gh-text);
    padding: 1rem;
  }

  .accent-card {
    background: linear-gradient(135deg, rgba(215, 122, 97, 0.18), rgba(15, 24, 40, 0.9));
  }

  .feature-list {
    display: grid;
    gap: 1rem;
    margin-top: 0.75rem;
  }

  .feature-item {
    align-items: center;
    color: var(--gh-muted);
    display: flex;
    gap: 0.75rem;
    line-height: 1.7;
  }

  @media (max-width: 960px) {
    .hero-grid,
    .info-grid {
      grid-template-columns: 1fr;
    }

    .hero-panel {
      padding: 1.5rem;
    }
  }
</style>
