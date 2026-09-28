<script setup lang="ts">
const { changeLanguage, replaceToDevStorefront } = useInternationalization();

async function onChangeHandler(id: string) {
  const data = await changeLanguage(id);

  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
}
</script>
