<script setup>
import { RouterLink } from "vue-router";
import { typeLabels } from "../data/seedItems";
import { useItemStore } from "../stores/items";

const { items, removeItem } = useItemStore();

function remove(item) {
  if (window.confirm(`删除「${item.title}」？`)) {
    removeItem(item.id);
  }
}
</script>

<template>
  <main class="shell page">
    <div class="page-head admin-head">
      <h1>管理</h1>
      <p class="result-text"><strong>{{ items.length }}</strong> 条</p>
    </div>

    <div v-if="items.length" class="item-list">
      <article v-for="item in items" :key="item.id" class="admin-row">
        <div class="admin-main">
          <RouterLink class="admin-title" :to="{ name: 'item-detail', params: { id: item.id } }">
            {{ item.title }}
          </RouterLink>
          <span
            class="badge"
            :class="item.type === 'lost' ? 'badge-lost' : 'badge-found'"
          >
            {{ typeLabels[item.type] }}
          </span>
          <span class="admin-meta">{{ item.location }}</span>
        </div>
        <button
          class="btn btn-secondary"
          type="button"
          :aria-label="`删除：${item.title}`"
          @click="remove(item)"
        >
          删除
        </button>
      </article>
    </div>

    <div v-else class="empty-state">
      <p class="empty-title">暂无信息</p>
      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">
        返回列表
      </RouterLink>
    </div>
  </main>
</template>
