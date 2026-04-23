<template>
  <v-app-bar
    class="navbar-shell"
    elevation="0"
    scroll-behavior="elevate"
  >
    <v-container class="d-flex align-center justify-space-between py-0">
      <RouterLink class="brand-link" to="/">
        <span class="brand-kicker">Game Hub</span>
        <span class="brand-name">TR3 Enrique</span>
      </RouterLink>

      <div class="nav-links d-none d-md-flex align-center ga-2">
        <v-btn
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-btn"
          rounded="xl"
          variant="text"
        >
          {{ item.label }}
        </v-btn>

        <v-btn
          v-if="authStore.isAuthenticated"
          class="logout-btn ml-2"
          rounded="xl"
          variant="flat"
          @click="authStore.logout()"
        >
          Logout
        </v-btn>
      </div>

      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn
            class="d-md-none"
            icon="mdi-menu"
            variant="text"
            v-bind="props"
          />
        </template>

        <v-list class="mobile-menu">
          <v-list-item
            v-for="item in navItems"
            :key="item.to"
            :title="item.label"
            :to="item.to"
          />
          <v-list-item
            v-if="authStore.isAuthenticated"
            title="Logout"
            @click="authStore.logout()"
          />
        </v-list>
      </v-menu>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'

  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()

  const navItems = computed(() => [
    { label: 'Home', to: '/' },
    { label: 'Downloads', to: '/downloads' },
    {
      label: authStore.isAuthenticated ? 'Estadístiques' : 'Login',
      to: authStore.isAuthenticated ? '/profile/estadistiques' : '/login',
    },
  ])
</script>

<style scoped>
  .navbar-shell {
    backdrop-filter: blur(16px);
    background:
      linear-gradient(135deg, rgba(13, 20, 33, 0.88), rgba(31, 47, 68, 0.72));
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .brand-link {
    color: inherit;
    display: grid;
    gap: 0.1rem;
    letter-spacing: 0.04em;
    text-decoration: none;
  }

  .brand-kicker {
    color: #9db4c8;
    font-family: "Space Grotesk", sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .brand-name {
    color: #f6efe4;
    font-family: "Bebas Neue", "Oswald", sans-serif;
    font-size: 1.8rem;
    line-height: 1;
    text-transform: uppercase;
  }

  .nav-btn {
    color: #d9e4ec;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: none;
  }

  .logout-btn {
    background: linear-gradient(135deg, #d77a61, #f1b36b);
    color: #101826;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    text-transform: none;
  }

  .mobile-menu {
    background: #162132;
    color: #f5efe6;
  }
</style>
