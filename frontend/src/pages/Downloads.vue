<template>
  <div class="downloads-page">
    <v-container class="py-10 py-md-16">
      <div class="downloads-hero">
        <div>
          <p class="section-label">Game Distribution</p>
          <h1 class="downloads-title">Download the latest TR3 Enrique build.</h1>
          <p class="downloads-copy">
            Ship your Unity executable from a single player-facing page with release notes,
            platform status, and setup guidance.
          </p>
        </div>
        <v-chip class="status-chip" size="large">
          Current channel: Stable
        </v-chip>
      </div>

      <v-row class="mt-2" dense>
        <v-col cols="12" md="8">
          <v-card class="download-card fill-height" rounded="xl">
            <v-card-title class="text-h5">Windows Desktop Build</v-card-title>
            <v-card-subtitle>Version 0.6.0 • Updated for Phase 6 rollout</v-card-subtitle>
            <v-card-text class="pt-6">
              <p class="download-copy">
                Package your exported Unity executable or installer behind this button.
                Replace the URL with your real artifact endpoint when the build pipeline is ready.
              </p>

              <div class="release-meta">
                <div>
                  <span class="meta-label">Package</span>
                  <strong>TR3-Enrique-Setup.exe</strong>
                </div>
                <div>
                  <span class="meta-label">Estimated size</span>
                  <strong>1.2 GB</strong>
                </div>
                <div>
                  <span class="meta-label">Compatibility</span>
                  <strong>Windows 10 / 11</strong>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="px-6 pb-6">
              <v-btn
                class="download-btn"
                href="https://example.com/downloads/TR3-Enrique-Setup.exe"
                prepend-icon="mdi-download"
                rounded="xl"
                size="large"
                target="_blank"
                variant="flat"
              >
                Download Executable
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="download-card fill-height" rounded="xl">
            <v-card-title>System Requirements</v-card-title>
            <v-card-text class="requirements-list">
              <div class="requirement-item">
                <span>CPU</span>
                <strong>Intel i5 / Ryzen 5 or better</strong>
              </div>
              <div class="requirement-item">
                <span>RAM</span>
                <strong>8 GB minimum</strong>
              </div>
              <div class="requirement-item">
                <span>GPU</span>
                <strong>DirectX 11 compatible</strong>
              </div>
              <div class="requirement-item">
                <span>Storage</span>
                <strong>2 GB free space</strong>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="download-card mt-6" rounded="xl">
        <v-card-title>Installation Notes</v-card-title>
        <v-card-text>
          <v-timeline align="start" density="compact" side="end">
            <v-timeline-item dot-color="#f1b36b" fill-dot size="small">
              Download the executable and allow Windows to verify the file.
            </v-timeline-item>
            <v-timeline-item dot-color="#d77a61" fill-dot size="small">
              Run the installer and choose your target directory.
            </v-timeline-item>
            <v-timeline-item dot-color="#8fb8d8" fill-dot size="small">
              Launch the game, then authenticate through the Login page to sync your profile.
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

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
