import router from '../router';
/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

// Plugins
import { createPinia } from 'pinia'
import vuetify from './vuetify'

export function registerPlugins (app: App) {
 const pinia = createPinia()

 app.use(vuetify)
 app.use(pinia)
 app.use(router)
}
