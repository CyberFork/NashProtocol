import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    network: "",
    addressNow: "",
  },
  mutations: {
    SET_NETWORK(state, data) {
      state.network = data;
    },
    SET_ADDRESS(state, data) {
      state.addressNow = data;
    },
  },
  actions: {},
  modules: {},
});
