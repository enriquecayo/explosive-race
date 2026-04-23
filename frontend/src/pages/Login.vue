<template>
  <div class="login-page">
    <v-container class="py-10 py-md-16">
      <v-row align="stretch" justify="center">
        <v-col cols="12" md="5">
          <v-card class="auth-card fill-height" rounded="xl">
            <v-card-title class="text-h4">Player Access</v-card-title>
            <v-card-subtitle>Authenticate with your Game Hub account</v-card-subtitle>
            <v-card-text class="pt-6">
              <v-alert
                v-if="authStore.error"
                class="mb-4"
                density="comfortable"
                type="error"
                variant="tonal"
              >
                {{ authStore.error }}
              </v-alert>

              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="credentials.username"
                  autocomplete="username"
                  class="mb-3"
                  label="Username"
                  prepend-inner-icon="mdi-account-outline"
                  type="text"
                  variant="outlined"
                />
                <v-text-field
                  v-model="credentials.password"
                  autocomplete="current-password"
                  class="mb-2"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  type="password"
                  variant="outlined"
                />

                <v-btn
                  :loading="authStore.loading"
                  block
                  class="login-btn mt-4"
                  rounded="xl"
                  size="large"
                  type="submit"
                  variant="flat"
                >
                  Sign In
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="7">
          <v-card class="profile-card fill-height" rounded="xl">
            <v-card-title class="text-h4">
              {{ authStore.isAuthenticated ? 'Profile Overview' : 'Profile Preview' }}
            </v-card-title>
            <v-card-subtitle>
              {{ authStore.isAuthenticated ? 'Live data from the backend API' : 'Sign in to load player data.' }}
            </v-card-subtitle>
            <v-card-text class="pt-6">
              <template v-if="authStore.isAuthenticated && authStore.user">
                <div class="profile-grid">
                  <div class="profile-item">
                    <span>Username</span>
                    <strong>{{ authStore.user.username || authStore.user.name || 'Unknown player' }}</strong>
                  </div>
                  <div class="profile-item">
                    <span>Estadistiques</span>
                    <strong>Consulta la vista completa al perfil</strong>
                  </div>
                </div>

                <div class="d-flex ga-3 mt-6 flex-wrap">
                  <v-btn
                    class="login-btn"
                    rounded="xl"
                    variant="flat"
                    to="/profile/estadistiques"
                  >
                    Obrir Estadistiques
                  </v-btn>
                  <v-btn
                    class="logout-outline"
                    rounded="xl"
                    variant="outlined"
                    @click="authStore.logout()"
                  >
                    Logout
                  </v-btn>
                </div>
              </template>

              <v-sheet
                v-else
                class="profile-placeholder d-flex align-center justify-center"
                rounded="xl"
              >
                <div class="text-center">
                  <v-icon class="mb-4" icon="mdi-account-circle-outline" size="72" />
                  <p class="placeholder-title">Your account data appears here after login.</p>
                  <p class="placeholder-copy">
                    Inicia sessió i després podràs veure totes les estadístiques a Profile/Estadistiques.
                  </p>
                </div>
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { useRouter } from 'vue-router'

  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const router = useRouter()

  const credentials = reactive({
    username: '',
    password: '',
  })

  async function handleLogin () {
    await authStore.login({ ...credentials })
    credentials.username = ''
    credentials.password = ''
    await router.push('/profile/estadistiques')
  }

  onMounted(() => {
    if (authStore.token && !authStore.user) {
      authStore.fetchProfile()
    }
  })
</script>

<style scoped>
  .login-page {
    background:
      radial-gradient(circle at 15% 15%, rgba(215, 122, 97, 0.18), transparent 22%),
      radial-gradient(circle at 85% 5%, rgba(143, 184, 216, 0.2), transparent 20%),
      linear-gradient(180deg, #0b1220 0%, #131d30 100%);
    min-height: 100%;
  }

  .auth-card,
  .profile-card {
    background: rgba(17, 27, 43, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.2);
    color: #f6efe4;
  }

  .login-btn {
    background: linear-gradient(135deg, #f1b36b, #d77a61);
    color: #101826;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    text-transform: none;
  }

  .profile-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .profile-item {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 18px;
    padding: 1rem;
  }

  .profile-item span {
    color: #8fa9bd;
    display: block;
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
  }

  .profile-placeholder {
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(143, 184, 216, 0.08));
    border: 1px dashed rgba(255, 255, 255, 0.1);
    min-height: 320px;
    padding: 2rem;
  }

  .placeholder-title {
    color: #f6efe4;
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .placeholder-copy {
    color: #abc0cf;
    line-height: 1.7;
    margin: 0 auto;
    max-width: 34ch;
  }

  .logout-outline {
    border-color: rgba(255, 255, 255, 0.12);
    color: #f6efe4;
    text-transform: none;
  }

  @media (max-width: 960px) {
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
