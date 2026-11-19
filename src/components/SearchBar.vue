<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["update:modelValue", "submit"]);

function handleInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <form class="search-form" role="search" @submit.prevent="emit('submit')">
    <svg class="search-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5"></circle>
      <path d="m13 13 4 4"></path>
    </svg>
    <label class="sr-only" for="searchInput">搜索物品</label>
    <input
      id="searchInput"
      :value="props.modelValue"
      type="search"
      placeholder="搜索物品、地点"
      autocomplete="off"
      @input="handleInput"
    >
    <button class="search-submit" type="submit">搜索</button>
  </form>
</template>
