<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form-model layout="vertical" :rules="rules">
          <a-form-model-item
            :label="$t('account.settings.basic.nickname')"
            prop="name"
          >
            <a-input v-model="form.name" :placeholder="$t('account.settings.basic.nickname-message')" />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('account.settings.basic.profile')"
            prop="bio"
          >
            <a-textarea v-model="form.bio" rows="4" :placeholder="$t('account.settings.basic.profile-message')"/>
          </a-form-model-item>
          <a-form-model-item
            label="性别"
            prop="sex"
          >
            <a-radio-group name="sex" v-model="form.sex">
              <a-radio v-for="(item, index) in sex" :value="item.value" :key="index">
                <img v-if="item.value === '1'" style="width: 12px" src="@/assets/system/male.png" alt="">
                <img v-else style="width: 10px" src="@/assets/system/female.png" alt="">
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('account.settings.basic.email')"
            :required="false"
          >
            <a-input v-model="form.email" placeholder="example@ant.design"/>
          </a-form-model-item>

          <a-form-item>
            <a-button @click="updateAccount()" type="primary">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-item>
        </a-form-model>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" :url="option.img" @ok="setavatar"/>

  </div>
</template>

<script>
  import AvatarModal from './AvatarModal'
  import { get, update } from '@/api/system/account'

  export default {
    components: {
      AvatarModal
    },
    data () {
      return {
        // cropper
        preview: {},
        option: {
          img: '/avatar2.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },
        form: {},
        sex: [], // 性别列表
        rules: {
          name: [
            { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' }
          ],
          email: [
            {
              type: 'email',
              message: "'请输入正确的邮箱地址",
              trigger: ['blur', 'change']
            }
          ],
          bio: [
            { min: 5, max: 100, message: '长度在5到100个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getUser()
      this.getDict('sys_sex').then(res => {
        this.sex = res.result.list
        console.log(res.result)
      })
    },
    methods: {
      setavatar (url) {
        this.option.img = process.env.VUE_APP_API_BASE_URL + '/' + url
        this.form.avatar = url
        this.updateAccount()
      },
      getUser () {
        get().then(res => {
          this.form = res.result
          this.option.img = process.env.VUE_APP_API_BASE_URL + '/' + res.result.avatar
        })
      },
      updateAccount () {
        const data = {
          name: this.form.name,
          bio: this.form.bio,
          sex: this.form.sex,
          email: this.form.email,
          avatar: this.form.avatar
        }
        update(data).then(res => {
          if (res.code === 200) {
            this.getUser()
            this.$message.success('修改成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
