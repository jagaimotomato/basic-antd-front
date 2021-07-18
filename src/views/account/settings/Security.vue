<template>
  <a-list
    itemLayout="horizontal"
  >
    <!--:dataSource="data"-->
    <!--<a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>-->
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">账户密码</a>
        <span slot="description">
          <span class="security-list-description">当前密码强度</span>
          <span>：</span>
          <span class="security-list-value">
            <a-tag v-if="form.passwordStrength === 0" color="pink">
              弱
            </a-tag>
            <a-tag v-else-if="form.passwordStrength === 1" color="green">
              强
            </a-tag>
            <a-tag v-else color="purple">
              非常强
            </a-tag>
          </span>
        </span>
      </a-list-item-meta>
      <template>
        <a slot="actions" @click="visible = !visible">修改</a>
      </template>
    </a-list-item>
    <a-modal
      style="top: 20px;"
      :width="800"
      :title="title"
      v-model="visible"
    >
      <a-form-model
        class="permission-form"
        ref="password"
        :model="password"
        :rules="rules"
        v-bind="layout"
      >
        <a-form-model-item
          label="旧密码"
          ref="old"
          prop="old"
          hasFeedback
        >
          <a-input
            type="password"
            placeholder="请输入旧密码"
            v-model="password.old"
          />
        </a-form-model-item>
        <a-form-model-item
          has-feedback
          label="新密码"
          prop="new"
        >
          <a-input
            type="password"
            v-model="password.new"
            placeholder="请输入新密码"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item
          has-feedback
          label="确认密码"
          prop="confirm"
        >
          <a-input
            type="password"
            v-model="password.confirm"
            placeholder="请再次输入新密码"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item
          label="密码强度"
          v-if="password.new.length > 5"
        >
          <a-tag v-if="passwordStrength(password.new) === 0" color="pink">
            弱
          </a-tag>
          <a-tag v-else-if="passwordStrength(password.new) === 1" color="green">
            强
          </a-tag>
          <a-tag v-else-if="passwordStrength(password.new) === 2" color="purple">
            非常强
          </a-tag>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="submitForm">
          确定
        </a-button>
      </template>
    </a-modal>
  </a-list>
</template>

<script>
  import { get, updatePassword } from '@/api/system/account'

  export default {
    computed: {
      data () {
        return [
          { title: this.$t('account.settings.security.password'), description: this.$t('account.settings.security.password-description'), value: '强', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.info('This is a normal message') } } },
          { title: this.$t('account.settings.security.phone'), description: this.$t('account.settings.security.phone-description'), value: '138****8293', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.success('This is a message of success') } } },
          { title: this.$t('account.settings.security.question'), description: this.$t('account.settings.security.question-description'), value: '', actions: { title: this.$t('account.settings.security.set'), callback: () => { this.$message.error('This is a message of error') } } },
          { title: this.$t('account.settings.security.email'), description: this.$t('account.settings.security.email-description'), value: 'ant***sign.com', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.warning('This is message of warning') } } },
          { title: this.$t('account.settings.security.mfa'), description: this.$t('account.settings.security.mfa-description'), value: '', actions: { title: this.$t('account.settings.security.bind'), callback: () => { this.$message.info('This is a normal message') } } }
        ]
      }
    },
    data () {
      const validatePass = (rule, value, callback) => {
        console.log(value, 'new')
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 6 || value.length > 15) {
          callback(new Error('长度在6到15个字符'))
        } else {
          if (this.password.confirm !== '') {
            this.$refs.password.validateField('confirm')
          }
          callback()
        }
      }
      const validateConfirm = (rule, value, callback) => {
        console.log(value, 'confirm')
        if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value !== this.password.new) {
          callback(new Error('两次输入不一致'))
        } else {
          callback()
        }
      }
      return {
        form: {},
        title: '修改密码',
        visible: false,
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 }
        },
        password: {
          old: '',
          new: '',
          confirm: '',
          passwordStrength: undefined
        },
        rules: {
          old: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
          ],
          new: [
            { validator: validatePass, trigger: 'change' },
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          confirm: [
            { validator: validateConfirm, trigger: 'change' },
            { required: true, message: '请确认密码', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getUser()
    },
    methods: {
      getUser () {
        get().then(res => {
          this.form = res.result
        })
      },
      reset () {
        this.password = {
          old: '',
          new: '',
          confirm: '',
          passwordStrength: undefined
        }
        this.resetForm('password')
      },
      handleCancel () {
        this.visible = false
        this.reset()
      },
      passwordStrength (str) {
        const strong = new RegExp('^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
        const medium = new RegExp('^(?=.{6,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[a-z])(?=.*\\W))|((?=.*[0-9])(?=.*\\W))|((?=.*[A-Z])(?=.*\\W))).*$', 'g')
        const enough = new RegExp('(?=.{6,}).*', 'g')
        if (strong.test(str)) {
          this.password.passwordStrength = 2
          return 2
        } else if (medium.test(str)) {
          this.password.passwordStrength = 1
          return 1
        } else if (enough.test(str)) {
          this.password.passwordStrength = 0
          return 0
        }
      },
      submitForm () {
        this.$refs.password.validate(valid => {
          if (valid) {
            const data = {
              old: this.password.old,
              new: this.password.new,
              passwordStrength: this.password.passwordStrength
            }
            updatePassword(data).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.form = res.result
                this.visible = false
              } else if (res.code === 403) {
                this.$message.error(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
