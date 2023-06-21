let component = `
<select id="option"
    name="option"
    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
    v-model="state.option"
>
    <option
        v-for="subscription in subscriptionOptions"
        :key="subscription.value"
        :value="subscription.value"
    >
        {{ subscription.label }}
    </option>
</select>

<html>
dwada</html>

<select :disabled="someDisabled">
<option>
</select>

<select>

</select>
`;

const hasDisabled = (block) => block.match(/\:disabled\=/gm);

const foundSelectElements =
  component.match(/<select(.*\s?)([\s\S]*?)?\<\/select\>/gm) || [];

for (const selectBlock of foundSelectElements) {
  if (hasDisabled(selectBlock)) {
    component = component.replace(
      selectBlock,
      selectBlock.replace(':disabled="', ':disabled="isDisabled && '),
    );

    continue;
  }
  component = component.replace(
    selectBlock,
    selectBlock.replace("<select", '<select :disabled="isDisabled"'),
  );
}

console.warn("component", component);
