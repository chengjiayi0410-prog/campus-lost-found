<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const { state, isLoggedIn, isAdmin, logout } = useAuthStore();

function handleLogout() {
  logout();
  router.push({ name: "home" });
}
</script>

<template>
  <header class="topbar">
    <div class="shell topbar-inner">
      <RouterLink class="brand" :to="{ name: 'home' }" aria-label="校园失物招领首页">
        <span class="brand-mark" aria-hidden="true">寻</span>
        <span class="brand-name">校园失物招领</span>
      </RouterLink>

      <nav class="header-actions" aria-label="主导航">
        <RouterLink v-if="isAdmin" class="nav-link nav-admin" :to="{ name: 'admin' }">
          管理
        </RouterLink>

        <template v-if="isLoggedIn">
          <span class="user-name">{{ state.user.name }}</span>
          <button class="nav-link" type="button" @click="handleLogout">退出</button>
        </template>
        <RouterLink v-else class="nav-link" :to="{ name: 'login' }">登录</RouterLink>

        <RouterLink class="btn btn-primary" :to="{ name: 'publish' }">发布</RouterLink>
      </nav>
    </div>
  </header>
</template>
