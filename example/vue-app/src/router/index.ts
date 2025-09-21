import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* viteChunkName: "home" */ "@/pages/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* viteChunkName: "about" */ "../pages/About.vue"),
  },
  {
    path: "/test",
    name: "Test",
    component: () => import(/* viteChunkName: "demo" */ "@/pages/Test.vue"),
  },
  {
    path: "/a",
    name: "A",
    component: () => import(/* viteChunkName: "A" */ "@/pages/a/index.vue"),
  },
  {
    path: "/b",
    name: "B",
    component: () => import(/* viteChunkName: "B" */ "@/pages/b/index.vue"),
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import(/* viteChunkName: "404" */ "../pages/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
