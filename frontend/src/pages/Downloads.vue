<template>
  <div class="downloads-page">
    <v-container class="py-10 py-md-16">
      <div class="downloads-hero">
        <div>
          <p class="section-label">Distribució del Joc</p>
          <h1 class="downloads-title">Descarrega l'última versió d'Explosive Race.</h1>
          <p class="downloads-copy">
            Accedeix a la build oficial per a escriptori. Inclou les darreres actualitzacions, 
            correcció d'errors i sincronització amb el rànquing global.
          </p>
        </div>
        <v-chip class="status-chip" size="large">
          Canal actual: Estable
        </v-chip>
      </div>

      <v-row class="mt-2" dense>
        <v-col cols="12" md="8">
          <v-card class="download-card fill-height" rounded="xl">
            <v-card-title class="text-h5">Build per a Windows</v-card-title>
            <v-card-subtitle>Versió 0.6.0 • Actualitzat recentment</v-card-subtitle>
            <v-card-text class="pt-6">
              <p class="download-copy">
                Utilitza aquest botó per descarregar l'instal·lador d'Explosive Race. 
                Recorda que cal estar registrat per sincronitzar les teves victòries.
              </p>

              <div class="release-meta">
                <div>
                  <span class="meta-label">Paquet</span>
                  <strong>Explosive-Race-Setup.exe</strong>
                </div>
                <div>
                  <span class="meta-label">Mida estimada</span>
                  <strong>1.2 GB</strong>
                </div>
                <div>
                  <span class="meta-label">Compatibilitat</span>
                  <strong>Windows 10 / 11</strong>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="px-6 pb-6">
              <v-btn
                class="download-btn"
                href="#"
                prepend-icon="mdi-download"
                rounded="xl"
                size="large"
                target="_blank"
                variant="flat"
              >
                Descarregar executable
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="download-card fill-height" rounded="xl">
            <v-card-title>Requisits del sistema</v-card-title>
            <v-card-text class="requirements-list">
              <div class="requirement-item">
                <span>CPU</span>
                <strong>Intel i5 / Ryzen 5 o millor</strong>
              </div>
              <div class="requirement-item">
                <span>RAM</span>
                <strong>8 GB mínim</strong>
              </div>
              <div class="requirement-item">
                <span>GPU</span>
                <strong>Compatible amb DirectX 11</strong>
              </div>
              <div class="requirement-item">
                <span>Espai</span>
                <strong>2 GB lliures</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="download-card mt-6" rounded="xl">
        <v-card-title>Notes d'instal·lació</v-card-title>
        <v-card-text>
          <v-timeline align="start" density="compact" side="end">
            <v-timeline-item dot-color="#f1b36b" fill-dot size="small">
              Descarrega l'executable i permet que Windows verifiqui el fitxer.
            </v-timeline-item>
            <v-timeline-item dot-color="#d77a61" fill-dot size="small">
              Executa l'instal·lador i tria el directori de destinació.
            </v-timeline-item>
            <v-timeline-item dot-color="#8fb8d8" fill-dot size="small">
              Inicia el joc i identifica't a la pàgina de Login per sincronitzar el teu perfil.
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  // Cap lògica addicional necessària per ara
</script>

<style scoped>
  .downloads-page {
    background:
      radial-gradient(circle at 10% 10%, rgba(143, 184, 216, 0.18), transparent 24%),
      radial-gradient(circle at 90% 0%, rgba(241, 179, 107, 0.16), transparent 18%),
      linear-gradient(180deg, #09111e 0%, #101a2b 100%);
    min-height: 100%;
  }

  .downloads-hero {
    align-items: end;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .section-label {
    color: #f1b36b;
    font-family: "Space Grotesk", sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    margin-bottom: 0.85rem;
    text-transform: uppercase;
  }

  .downloads-title {
    color: #f6efe4;
    font-family: "Bebas Neue", "Oswald", sans-serif;
    font-size: clamp(3rem, 7vw, 5rem);
    font-weight: 400;
    line-height: 0.94;
    margin-bottom: 1rem;
    max-width: 10ch;
  }

  .downloads-copy {
    color: #abc0cf;
    font-family: "Space Grotesk", sans-serif;
    line-height: 1.8;
    margin: 0;
    max-width: 58ch;
  }

  .status-chip {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f6efe4;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
  }

  .download-card {
    background: rgba(17, 27, 43, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.2);
    color: #f6efe4;
  }

  .release-meta {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1.5rem;
  }

  .meta-label,
  .requirement-item span {
    color: #8fa9bd;
    display: block;
    font-size: 0.85rem;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
  }

  .download-btn {
    background: linear-gradient(135deg, #f1b36b, #d77a61);
    color: #101826;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    text-transform: none;
  }

  .requirements-list {
    display: grid;
    gap: 1rem;
    padding-top: 1.25rem;
  }

  .requirement-item {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 18px;
    padding: 1rem;
  }

  @media (max-width: 960px) {
    .downloads-hero {
      align-items: start;
      flex-direction: column;
    }

    .release-meta {
      grid-template-columns: 1fr;
    }
  }
</style>
