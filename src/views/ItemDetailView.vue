<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import {
  categoryIcons,
  categoryLabels,
  typeLabels
} from "../data/seedItems";
import { useItemStore } from "../stores/items";

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const { getById } = useItemStore();
const item = computed(() => getById(props.id));
</script>

<template>
  <main class="shell page detail-page">
    <RouterLink class="back-link" :to="{ name: 'home' }">← 返回</RouterLink>

    <template v-if="item">
      <header class="detail-head">
        <span class="detail-icon" aria-hidden="true">
          {{ categoryIcons[item.category] }}
        </span>
        <div class="detail-heading">
          <div class="detail-title-row">
            <h1>{{ item.title }}</h1>
            <span
              class="badge"
              :class="item.type === 'lost' ? 'badge-lost' : 'badge-found'"
            >
              {{ typeLabels[item.type] }}
            </span>
          </div>
          <p class="detail-meta">
            {{ item.location }} · {{ item.date }}
          </p>
        </div>
      </header>

      <img v-if="item.image" class="detail-image" :src="item.image" alt="">

      <section class="detail-content" aria-label="信息描述">
        <p class="detail-category">{{ categoryLabels[item.category] }}</p>
        <p class="detail-desc">{{ item.description }}</p>
      </section>
    </template>

    <div v-else class="empty-state">
      <p class="empty-title">信息不存在</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">
        返回列表
      </RouterLink>
    </div>
  </main>
</template>
