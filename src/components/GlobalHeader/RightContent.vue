<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
  import AvatarDropdown from './AvatarDropdown'
  import SelectLang from '@/components/SelectLang'
  import { mapState } from 'vuex'

  export default {
    name: 'RightContent',
    components: {
      AvatarDropdown,
      SelectLang
    },
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-global-header-index-action'
      },
      isMobile: {
        type: Boolean,
        default: () => false
      },
      topMenu: {
        type: Boolean,
        required: true
      },
      theme: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        showMenu: true,
        currentUser: {},
        notify: {}
      }
    },
    computed: {
      wrpCls () {
        return {
          'ant-pro-global-header-index-right': true,
          [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
        }
      },
      ...mapState({
        nickname: (state) => state.user.nickname,
        welcome: (state) => state.user.welcome
      }),
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    mounted () {
      this.currentUser = {
        name: this.userInfo.name,
        avatar: process.env.VUE_APP_API_BASE_URL + '/' + this.userInfo.avatar
      }
    },
    methods: {
    }
  }
</script>
