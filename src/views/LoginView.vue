<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const { login } = useAuthStore();

const form = reactive({
  username: "",
  password: ""
});

const error = ref("");

function submit() {
  if (!form.username.trim() || !form.password) {
    error.value = "请填写用户名和密码";
    return;
  }

  error.value = "";
  login(form.username);

  const redirect =
    typeof route.query.redirect === "string" &&
    route.query.redirect.startsWith("/")
      ? route.query.redirect
      : "/";

  router.push(redirect);
}
</script>

<template>
  <main class="shell page auth-page">
    <form class="auth-card" @submit.prevent="submit">
      <div>
        <p class="page-kicker">账号</p>
        <h1>登录</h1>
      </div>

      <label class="field">
        <span class="field-label">用户名</span>
        <input
          id="login-username"
          v-model="form.username"
          class="input"
          type="text"
          name="username"
          autocomplete="username"
        >
      </label>

      <label class="field">
        <span class="field-label">密码</span>
        <input
          id="login-password"
          v-model="form.password"
          class="input"
          type="password"
          name="password"
          autocomplete="current-password"
        >
      </label>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button class="btn btn-primary auth-submit" type="submit">登录</button>
    </form>
  </main>
</template>
