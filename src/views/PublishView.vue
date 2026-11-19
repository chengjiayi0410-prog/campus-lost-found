<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { categoryLabels } from "../data/seedItems";
import { useItemStore } from "../stores/items";

const router = useRouter();
const { addItem } = useItemStore();

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({
  value,
  label
}));

const form = reactive({
  type: "lost",
  category: "card",
  title: "",
  description: "",
  location: ""
});

const errors = reactive({
  title: "",
  description: "",
  location: "",
  image: ""
});

const imagePreview = ref("");

function handleFile(event) {
  const file = event.target.files?.[0];
  errors.image = "";

  if (!file) {
    imagePreview.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    errors.image = "请选择图片文件";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    errors.image = "图片不能超过 2MB";
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = String(reader.result);
  };
  reader.readAsDataURL(file);
}

function validate() {
  errors.title = form.title.trim() ? "" : "请填写标题";
  errors.description = form.description.trim() ? "" : "请填写描述";
  errors.location = form.location.trim() ? "" : "请填写地点";

  return !errors.title && !errors.description && !errors.location && !errors.image;
}

function submit() {
  if (!validate()) return;

  const id = addItem({
    ...form,
    title: form.title.trim(),
    description: form.description.trim(),
    location: form.location.trim(),
    image: imagePreview.value
  });

  router.push({ name: "item-detail", params: { id } });
}
</script>

<template>
  <main class="shell page">
    <div class="page-head form-page-head">
      <div>
        <p class="page-kicker">发布</p>
        <h1>新增信息</h1>
      </div>
    </div>

    <form class="form-card" novalidate @submit.prevent="submit">
      <div class="field">
        <span class="field-label">类型</span>
        <div class="segmented" role="group" aria-label="信息类型">
          <button
            class="segment"
            :class="{ 'is-active': form.type === 'lost' }"
            type="button"
            @click="form.type = 'lost'"
          >
            失物
          </button>
          <button
            class="segment"
            :class="{ 'is-active': form.type === 'found' }"
            type="button"
            @click="form.type = 'found'"
          >
            招领
          </button>
        </div>
      </div>

      <label class="field">
        <span class="field-label">分类</span>
        <select
          id="publish-category"
          v-model="form.category"
          class="input select"
          name="category"
        >
          <option
            v-for="option in categoryOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="field">
        <span class="field-label">标题</span>
        <input
          id="publish-title"
          v-model="form.title"
          class="input"
          type="text"
          name="title"
          placeholder="例如：黑色雨伞"
        >
        <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
      </label>

      <label class="field">
        <span class="field-label">描述</span>
        <textarea
          id="publish-description"
          v-model="form.description"
          class="input textarea"
          name="description"
          rows="5"
          placeholder="颜色、特征、是否有标记"
        ></textarea>
        <span v-if="errors.description" class="error-text">
          {{ errors.description }}
        </span>
      </label>

      <label class="field">
        <span class="field-label">地点</span>
        <input
          id="publish-location"
          v-model="form.location"
          class="input"
          type="text"
          name="location"
          placeholder="例如：图书馆三楼"
        >
        <span v-if="errors.location" class="error-text">{{ errors.location }}</span>
      </label>

      <label class="field">
        <span class="field-label">图片</span>
        <input
          id="publish-image"
          class="file-input"
          type="file"
          name="image"
          accept="image/*"
          @change="handleFile"
        >
        <span v-if="errors.image" class="error-text">{{ errors.image }}</span>
      </label>

      <img v-if="imagePreview" class="image-preview" :src="imagePreview" alt="图片预览">

      <div class="form-actions">
        <RouterLink class="btn btn-secondary" :to="{ name: 'home' }">
          取消
        </RouterLink>
        <button class="btn btn-primary" type="submit">发布</button>
      </div>
    </form>
  </main>
</template>
