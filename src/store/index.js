import Vue from 'vue';
import Vuex from 'vuex';
import tagsView from './modules/tagsView.js'
import perMission from './modules/perMission.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    tagsView,
    perMission
  }
});

export default store;