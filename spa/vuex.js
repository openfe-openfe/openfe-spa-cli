import {createNamespacedHelpers} from 'vuex'

const {mapState, mapGetters, mapActions, mapMutations} = createNamespacedHelpers(process.env.MODULE_NAME)

export {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
};