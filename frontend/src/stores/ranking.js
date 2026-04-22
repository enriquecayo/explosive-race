import { defineStore } from 'pinia'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function normalizeEntry(entry, index) {
  return {
    id: entry._id || entry.id || `${entry.username || entry.name || 'player'}-${index}`,
    name: entry.username || entry.name || `Player ${index + 1}`,
    position: entry.position || entry.rank || index + 1,
    score: entry.score || entry.points || 0,
  }
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to fetch leaderboard.')
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
    topPlayers: state => state.entries.slice(0, 5),
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
