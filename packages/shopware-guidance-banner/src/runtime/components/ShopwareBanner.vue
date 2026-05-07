<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

const storageKey = 'shopware-guidance-banner-dismissed'

const isMounted = ref(false)
const isDismissed = ref(false)
const bannerElement = ref<HTMLElement | null>(null)

const links = [
  {
    label: 'View code',
    href: 'https://github.com/shopware/frontends/tree/main/templates/vue-starter-template',
    variant: 'primary',
    type: 'link',
  },
  {
    label: 'Docs',
    href: 'https://frontends.shopware.com/',
    variant: 'secondary',
    type: 'link',
  },
]

const isVisible = computed(() => isMounted.value && !isDismissed.value)

onMounted(() => {
  isMounted.value = true
  isDismissed.value = localStorage.getItem(storageKey) === 'true'
  if (isDismissed.value) {
    return
  }
  window.addEventListener('resize', syncBodyPadding)
  void nextTick(syncBodyPadding)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncBodyPadding)
  document.body.style.paddingBottom = ''
})

watch(isVisible, async () => {
  await nextTick()
  syncBodyPadding()
})

function closeBanner() {
  isDismissed.value = true
  localStorage.setItem(storageKey, 'true')
}

function syncBodyPadding() {
  if (!isVisible.value || !bannerElement.value) {
    document.body.style.paddingBottom = ''
    return
  }

  document.body.style.paddingBottom = `${bannerElement.value.offsetHeight + 12}px`
}

function isExternalLink(href: string) {
  return href.startsWith('http')
}

function getLinkTarget(link: (typeof links)[number]) {
  if (link.type !== 'link' || !link.href) {
    return undefined
  }

  return isExternalLink(link.href) ? '_blank' : undefined
}

function getLinkRel(link: (typeof links)[number]) {
  if (link.type !== 'link' || !link.href) {
    return undefined
  }

  return isExternalLink(link.href) ? 'noopener noreferrer' : undefined
}
</script>

<template>
  <aside
    v-if="isVisible"
    ref="bannerElement"
    class="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6"
  >
    <div class="mx-auto max-w-6xl">
      <div
        class="relative overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(244,247,251,0.98)_45%,rgba(236,246,255,0.98)_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/70 backdrop-blur-xl"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -right-16 top-0 h-36 w-36 rounded-full bg-sky-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-amber-200/50 blur-3xl"
        />

        <div
          class="relative flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
        >
          <div class="max-w-2xl">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              Guided setup
            </div>

            <h2 class="mt-3 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              Your Frontends project is ready
            </h2>
            <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-[15px]">
              Explore the starter, inspect the codebase, open the docs, or jump
              straight into DevTools to continue building.
            </p>
            <p
              class="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500"
            >
              <span>Press</span>
              <kbd
                class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm"
              >
                F12
              </kbd>
              <span>or</span>
              <kbd
                class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm"
              >
                ⌘⌥I
              </kbd>
              <span>to open DevTools</span>
            </p>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex flex-wrap gap-2.5">
              <component
                :is="link.type === 'action' ? 'button' : 'a'"
                v-for="link in links"
                :key="link.label"
                :href="link.type === 'link' ? link.href : undefined"
                :type="link.type === 'action' ? 'button' : undefined"
                class="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                :class="
                  link.variant === 'primary'
                    ? 'bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.22)] hover:bg-slate-800'
                    : 'border border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-950'
                "
                :target="getLinkTarget(link)"
                :rel="getLinkRel(link)"
              >
                {{ link.label }}
              </component>
            </div>

            <button
              type="button"
              class="inline-flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full border border-slate-200/90 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:self-start"
              aria-label="Close banner"
              @click="closeBanner"
            >
              <span
                aria-hidden="true"
                class="text-xl leading-none"
              >&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
