<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['hasMask'])
  },
  methods: {
    ...mapMutations({'setMask': 'setMask'})
  }
}
</script>
