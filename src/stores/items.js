import { computed, reactive } from "vue";
import { seedItems } from "../data/seedItems";

const state = reactive({
  items: seedItems.map((item) => ({ ...item }))
});

const items = computed(() => state.items);

function getById(id) {
  return state.items.find((item) => String(item.id) === String(id));
}

function addItem(payload) {
  const nextId = Math.max(0, ...state.items.map((item) => Number(item.id))) + 1;
  const now = new Date();
  const date = `${now.getMonth() + 1}月${now.getDate()}日 ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  state.items.unshift({
    id: nextId,
    ...payload,
    date
  });

  return nextId;
}

function removeItem(id) {
  const index = state.items.findIndex((item) => String(item.id) === String(id));
  if (index >= 0) {
    state.items.splice(index, 1);
  }
}

export function useItemStore() {
  return {
    items,
    getById,
    addItem,
    removeItem
  };
}
