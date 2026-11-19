<script setup>
import { categoryOptions, typeOptions } from "../data/seedItems";

defineProps({
  type: {
    type: String,
    default: "all"
  },
  category: {
    type: String,
    default: "all"
  },
  count: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["update:type", "update:category"]);
</script>

<template>
  <div class="toolbar">
    <div class="segmented" role="group" aria-label="信息类型">
      <button
        v-for="option in typeOptions"
        :key="option.value"
        class="segment"
        :class="{ 'is-active': type === option.value }"
        :data-type="option.value"
        type="button"
        @click="emit('update:type', option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="category-filter" role="group" aria-label="物品分类">
      <button
        v-for="option in categoryOptions"
        :key="option.value"
        class="chip"
        :class="{ 'is-active': category === option.value }"
        :data-category="option.value"
        type="button"
        @click="emit('update:category', option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <p class="result-text" aria-live="polite">
      <strong>{{ count }}</strong> 条
    </p>
  </div>
</template>
