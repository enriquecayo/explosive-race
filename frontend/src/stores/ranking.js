import { defineStore } from 'pinia'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function normalizeEntry(entry, index) {
  const gamesWon = Number(entry.gamesWon ?? entry.monthlyGamesWon ?? 0)

  return {
    id: entry._id || entry.id || `${entry.username || entry.name || 'player'}-${index}`,
    name: entry.username || entry.name || `Player ${index + 1}`,
    position: entry.position || entry.rank || index + 1,
    gamesWon: Number.isFinite(gamesWon) ? gamesWon : 0,
  }
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Unable to fetch leaderboard.')
  }

  return data
}

export const useRankingStore = defineStore('ranking', {
  state: () => ({
    entries: [],
    loading: false,
    error: '',
  }),
  getters: {
    topPlayers: state => state.entries.slice(0, 10),
  },
  actions: {
    async fetchLeaderboard() {
      this.loading = true
      this.error = ''

      try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`)
        const data = await parseResponse(response)
        const rawEntries = data.leaderboard || data.rankings || data.data || data

        this.entries = Array.isArray(rawEntries)
          ? rawEntries.map((entry, index) => normalizeEntry(entry, index))
          : []
      } catch (error) {
        this.error = error.message || 'Unable to load rankings.'
      } finally {
        this.loading = false
      }
    },
  },
})
