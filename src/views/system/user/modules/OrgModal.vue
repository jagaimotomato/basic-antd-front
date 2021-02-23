<template>
  <a-modal
    title="操作"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="父级ID"
        >
          <a-input v-decorator="['parentId', {}]" disabled />
        </a-form-item>

        <a-form-item
          label="父级名称"
        >
          <a-input v-decorator="['name', {}]" disabled />
        </a-form-item>

        <a-form-item
          label="机构名称"
        >
          <a-input
            v-decorator="['title', {
              rules: [{ required: true, message: '请输入机构/部门名称' }]
            }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { create } from '@/api/system/department'
  export default {
    name: 'OrgModal',
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        visible: false,
        confirmLoading: false,
        mdl: {}
      }
    },
    beforeCreate () {
      this.form = this.$form.createForm(this)
      console.log('form::', this.form)
    },
    created () {

    },
    methods: {
      add (record) {
        console.log(record)
        if (record.parentId === 0) {
          this.edit({ parentId: 0, name: 'new organization' })
        } else {
          this.edit({ parentId: record.key, name: record.title })
        }
      },
      edit (record) {
        this.mdl = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue({ ...record })
        })
      },
      close () {
        this.$emit('close')
        this.visible = false
      },
      handleOk () {
        const _this = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          // 验证表单没错误
          if (!err) {
            console.log('form values', values)

            _this.confirmLoading = true
            // 模拟后端请求 2000 毫秒延迟
            new Promise((resolve) => {
              // setTimeout(() => resolve(), 2000)
              const data = {
                parentId: values.parentId,
                title: values.title
              }
              create(data).then(res => {
                resolve(res)
              })
            }).then((res) => {
              // Do something
              if (res.code === 200) {
                _this.$message.success('保存成功')
                _this.$emit('refresh')
                _this.$emit('ok')
              }
            }).catch(() => {
              // Do something
            }).finally(() => {
              _this.confirmLoading = false
              _this.close()
            })
          }
        })
      },
      handleCancel () {
        this.close()
      }

    }
  }
</script>
