<script setup lang="ts">
const { resetPassword } = useCustomerPassword();
const { getStorefrontUrl } = useInternationalization();

const formData = ref({ email: "" });

async function onSubmit() {
  await resetPassword({
    ...formData.value,
    // resolved on the client, where window.location.origin exists
    storefrontUrl: getStorefrontUrl(),
  });
}
</script>
