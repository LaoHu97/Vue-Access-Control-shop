export default {
  data () {
    return {
      total: 0,
      page: 1,
      users: [],
      listLoading: false
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getList()
    },
    getUsers() {
      this.page = 1
      this.getList()
    }
  },
  mounted() {
    this.getUsers()
  }
}