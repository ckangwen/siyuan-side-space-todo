import { createApp } from "vue";
import App from "./App.vue";
import { create, NInput, NDropdown, NCheckbox } from "naive-ui";
import { fixSiYuanStyle, startService } from "./siyuan";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./styles/index.scss";

const naive = create({
  components: [NInput, NDropdown, NCheckbox],
});

const app = createApp(App);
app.use(naive);

app.mount("#app").$nextTick(() => {
  fixSiYuanStyle();
  startService();
});
