import { els } from "./elements.js";
import { addEventListeners } from "./events.js";
import { applyTheme } from "./theme.js";
import { poblarPresets, poblarMisCurvas } from "./library.js";
import { UrlStore } from "./url-store.js";
import { model, updateModel } from "./model.js";
import { Estado } from "./estado.js";

addEventListeners();
applyTheme(els.theme.value);
poblarPresets();
poblarMisCurvas();

(function init() {
  const loaded = UrlStore.load() ?? model;
  updateModel(loaded);
  Estado.save(loaded);
})();
