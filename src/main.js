import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store';

// Importando Vuetify corretamente
import { createVuetify } from 'vuetify';
import 'vuetify/styles';

// Importando presets necessários do Vuetify
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
    components,
    directives,
});

store.dispatch('initializeStore');

const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify); // Certifique-se de adicionar o Vuetify corretamente
app.mount('#app');
