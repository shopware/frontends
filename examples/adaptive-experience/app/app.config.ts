export default defineAppConfig({
  // The placeholder colour is an app config value, not a UnoCSS token, so
  // retheming in `uno.config.ts` does not reach it. Keep this in step with
  // `brand-primary` there or images flash the starter's purple while loading.
  imagePlaceholder: {
    color: "#0E7C7B",
  },

  experience: {
    /**
     * Shadow mode: ask the planner, record what it would have done, apply
     * nothing. This is phase 6 of the rollout and the only honest way to judge
     * proposal quality before letting a model move the UI under real shoppers.
     */
    aiShadowMode: true,
  },
});
