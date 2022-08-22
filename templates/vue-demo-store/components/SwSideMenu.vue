<script setup lang="ts">
const { navigationElements } = useNavigation();

const isSideMenuOpened = inject("isSideMenuOpened");
const collapseItems = ref<Array<{ id: string; isCollapsed: boolean }>>([]);

onMounted(() => {
  if (navigationElements.value) {
    for (let navigationElement of navigationElements.value) {
      collapseItems.value.push({
        id: navigationElement.id,
        isCollapsed: true,
      });
    }
  }
});

const triggerCollapse = (id: string) => {
  const newCollapseItems = collapseItems.value.map((item) => {
    if (item.id === id) {
      item.isCollapsed = !item.isCollapsed;
    }

    return item;
  });

  collapseItems.value = newCollapseItems;
};
</script>

<template>
  <button class="md:hidden" @click="isSideMenuOpened = true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <path
        fill="#494c4e"
        d="M17 5H1a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2zm0 5H1a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2zm0 5H1a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2z"
      />
    </svg>
  </button>
  <div
    v-show="isSideMenuOpened"
    class="relative z-40 md:hidden"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-black opacity-25"></div>
    <div class="fixed inset-0 z-40 flex" @click="isSideMenuOpened = false">
      <div
        class="relative flex flex-col w-full max-w-xs overflow-y-auto bg-white shadow-xl"
      >
        <div class="flex px-4 py-5">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md"
            @click="isSideMenuOpened = false"
          >
            <span class="sr-only">Close menu</span>
            <svg
              class="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="max-w-2xl">
          <aside aria-label="Sidebar">
            <div class="overflow-y-auto">
              <ul class="flex flex-col p-0 space-y-2">
                <li
                  v-for="(navigationElement, index) in navigationElements"
                  :key="navigationElement.id"
                >
                  <router-link
                    :to="'/' + navigationElement.seoUrls[0]?.seoPathInfo"
                    @click="isSideMenuOpened = false"
                    class="flex items-center w-full px-5 py-3 text-base font-normal text-gray-900 break-all hover:bg-gray-100"
                  >
                    <span class="flex-1">
                      {{ navigationElement.name }}
                    </span>
                    <button
                      class="p-4 -m-4 h-11 w-11"
                      v-if="navigationElement?.children?.length"
                      @click.stop.prevent="
                        triggerCollapse(navigationElement.id)
                      "
                    >
                      <svg
                        v-if="!collapseItems[index]?.isCollapsed"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Layer_1"
                        x="0"
                        y="0"
                        viewBox="0 0 330 330"
                        style="enable-background: new 0 0 330 330"
                        xml:space="preserve"
                      >
                        <path
                          id="XMLID_93_"
                          d="m325.606 229.393-150.004-150a14.997 14.997 0 0 0-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.953 14.953 0 0 0 315 255a14.95 14.95 0 0 0 10.607-4.394c5.857-5.858 5.857-15.355-.001-21.213z"
                        />
                      </svg>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Layer_1"
                        x="0"
                        y="0"
                        viewBox="0 0 330 330"
                        style="enable-background: new 0 0 330 330"
                        xml:space="preserve"
                      >
                        <path
                          id="XMLID_225_"
                          d="M325.607 79.393c-5.857-5.857-15.355-5.858-21.213.001l-139.39 139.393L25.607 79.393c-5.857-5.857-15.355-5.858-21.213.001-5.858 5.858-5.858 15.355 0 21.213l150.004 150a14.999 14.999 0 0 0 21.212-.001l149.996-150c5.859-5.857 5.859-15.355.001-21.213z"
                        />
                      </svg>
                    </button>
                  </router-link>

                  <div
                    v-if="
                      navigationElement.media &&
                      !collapseItems[index]?.isCollapsed
                    "
                    class="relative"
                  >
                    <div class="overflow-hidden">
                      <img
                        :src="navigationElement.media?.url"
                        class="object-cover object-center"
                      />
                    </div>
                  </div>
                  <ul
                    v-if="
                      navigationElement?.children?.length &&
                      !collapseItems[index]?.isCollapsed
                    "
                    class="px-0 py-2 m-0"
                  >
                    <li
                      v-for="childElement in navigationElement.children"
                      :key="childElement.id"
                    >
                      <router-link
                        :to="'/' + childElement.seoUrls[0]?.seoPathInfo"
                        @click="isSideMenuOpened = false"
                        class="flex items-center p-3 text-base font-normal text-gray-500 break-all hover:bg-gray-100 pl-11"
                      >
                        <span>
                          {{ childElement.name }}
                        </span>
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>
