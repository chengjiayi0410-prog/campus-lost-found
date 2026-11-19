<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import FilterBar from "../components/FilterBar.vue";
import ItemRow from "../components/ItemRow.vue";
import SearchBar from "../components/SearchBar.vue";
import { useItemStore } from "../stores/items";

const { items } = useItemStore();

const keyword = ref("");
const type = ref("all");
const category = ref("all");

const filteredItems = computed(() => {
  const text = keyword.value.trim().toLowerCase();

  return items.value.filter((item) => {
    const matchesType = type.value === "all" || item.type === type.value;
    const matchesCategory =
      category.value === "all" || item.category === category.value;
    const matchesKeyword =
      !text ||
      [item.title, item.description, item.location]
        .join(" ")
        .toLowerCase()
        .includes(text);

    return matchesType && matchesCategory && matchesKeyword;
  });
});

function scrollToList() {
  document.querySelector(".item-list")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function resetFilters() {
  keyword.value = "";
  type.value = "all";
  category.value = "all";
}
</script>

<template>
  <main class="shell page">
    <div class="page-head">
      <h1>失物招领</h1>
      <SearchBar v-model="keyword" @submit="scrollToList" />
    </div>

    <FilterBar
      v-model:type="type"
      v-model:category="category"
      :count="filteredItems.length"
    />

    <div v-if="filteredItems.length" class="item-list">
      <ItemRow
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
      />
    </div>

    <div v-else class="empty-state">
      <p class="empty-title">没有匹配的信息</p>
      <div class="empty-actions">
        <RouterLink class="btn btn-primary" :to="{ name: 'publish' }">
          发布
        </RouterLink>
        <button class="btn btn-secondary" type="button" @click="resetFilters">
          清除筛选
        </button>
      </div>
    </div>
  </main>
</template>
