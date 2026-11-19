import { computed, reactive } from "vue";

const STORAGE_KEY = "campus-demo-user";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

const state = reactive({
  user: readUser()
});

const isLoggedIn = computed(() => Boolean(state.user));
const isAdmin = computed(() => state.user?.role === "admin");

function login(username) {
  const name = username.trim() || "同学";
  state.user = {
    name,
    role: name.toLowerCase() === "admin" ? "admin" : "user"
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
}

function logout() {
  state.user = null;
  localStorage.removeItem(STORAGE_KEY);
}

export function useAuthStore() {
  return {
    state,
    isLoggedIn,
    isAdmin,
    login,
    logout
  };
}
