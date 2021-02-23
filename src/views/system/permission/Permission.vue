<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 15px">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24" v-action:query>
            <a-form-item label="菜单">
              <a-input
                v-model="queryParam.title"
                placeholder="请输入菜单名"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleQuery(1)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleQuery(0)">重置</a-button>
            </span>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-button type="primary" icon="plus" style="margin-left: 8px" @click="handleAdd">新增</a-button>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="record => record.permissionId"
    >
      <!--:pagination="pagination" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
      <span slot="icon" slot-scope="text, record">
        <a-icon :type="record.icon" style="font-size: 16px" />
      </span>

      <span slot="actions" slot-scope="text, record">
        <a-tag v-for="(action, index) in record.actionList" :key="index">{{ action.title }}</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="handleGet(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm
                title="确定删除这个菜单吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDel(record)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      :title="title"
      :width="800"
      v-model="visible"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              prop="parentId"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="父级菜单"
            >
              <a-tree-select
                v-model="form.parentId"
                placeholder="请选择父级菜单"
                show-search
                treeNodeFilterProp="title"
                :treeData="tree.treeData"
                :replaceFields="tree.replaceFields"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                allow-clear
                tree-default-expand-all
                :disabled="disabled"
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="title"
              prop="title"
              label="菜单名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-model="form.title"
                placeholder="请输入菜单名称"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="bars"></a-icon>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="权限唯一键"
              ref="name"
              prop="name"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-model="form.name"
                placeholder="请输入权限唯一键"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="lock"></a-icon>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="path"
              prop="path"
              label="路径"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-model="form.path"
                placeholder="请输入路径"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="right-circle"></a-icon>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="Redirect"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              ref="redirect"
              prop="redirect"
            >
              <a-input
                v-model="form.redirect"
                placeholder="请输入跳转路径"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="forward"></a-icon>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="component"
              prop="component"
              label="组件名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-model="form.component"
                placeholder="请输入组件"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="pie-chart"></a-icon>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="sort"
              prop="sort"
              label="排序(升序)"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number
                :min="0"
                :max="100000"
                v-model="form.sort"
                :disabled="disabled"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="action"
              prop="action"
              label="Actions"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-select
                placeholder="请选择action"
                v-model="form.action"
                @change="selectChange"
                :disabled="disabled"
                mode="multiple"
              >
                <a-select-option
                  v-if="actions.length > 0"
                  v-for="item in actions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="show"
              prop="show"
              label="隐藏菜单"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                v-model="form.show"
                :disabled="disabled"
              >
                <a-radio :value="0">
                  是
                </a-radio>
                <a-radio :value="1">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="hideChildren"
              prop="hideChildren"
              label="隐藏子菜单"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                v-model="form.hideChildren"
                :disabled="disabled"
              >
                <a-radio :value="1">
                  是
                </a-radio>
                <a-radio :value="0">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="hiddenHeaderContent"
              prop="hiddenHeaderContent"
              label="隐藏面包屑"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                v-model="form.hiddenHeaderContent"
                :disabled="disabled"
              >
                <a-radio :value="1">
                  是
                </a-radio>
                <a-radio :value="0">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="target"
              prop="target"
              label="跳转方式"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                v-model="form.target"
                :disabled="disabled"
              >
                <a-radio :value="jumpWay[0]">
                  无
                </a-radio>
                <a-radio :value="jumpWay[1]">
                  新页面
                </a-radio>
                <a-radio :value="jumpWay[2]">
                  当前页面
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="icon"
              prop="icon"
              label="菜单图标"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <icon-selector v-model="form.icon" :show="disabled" @change="handleIconChange"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              ref="describe"
              prop="describe"
              label="描述"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-textarea
                v-model="form.describe"
                placeholder="请输入菜单描述"
                allow-clear
                :rows="5"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="edit"></a-icon>
              </a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button v-if="!disabled" key="submit" type="primary" @click="submitForm">
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>

<script>
import IconSelector from '@/components/IconSelector'
import { STable } from '@/components'
import { getPage, getList, update, del, create, get } from '@/api/system/permission'

export default {
  name: 'Permission',
  components: {
    STable,
    IconSelector
  },
  data () {
    return {
      columns: [
        {
          title: '菜单名',
          dataIndex: 'title'
        },
        {
          title: '权限唯一键',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '菜单icon',
          dataIndex: 'icon',
          align: 'center',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '可操作权限',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        hideOnSinglePage: true
      },
      queryParam: {},
      form: {
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      loadData: parameter => {
        return getPage(Object.assign(parameter, this.queryParam)).then(res => {
          const result = res.result
          return result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      tree: {
        treeData: [],
        replaceFields: {
          children: 'children',
          title: 'title',
          key: 'permissionId',
          value: 'permissionId'
        }
      },
      treeParams: {},
      // 弹出层标题
      title: '',
      jumpWay: ['', '_blank', '_self'],
      rules: {
        parentId: [ { required: true, message: '请选择父级菜单', trigger: 'blur' } ]
      },
      /* 详情禁用表单 */
      disabled: false,
      actions: []
    }
  },
  watch: {},
  created () {
    this.getDict('sys_action').then(res => {
      this.actions = res.result.list
      console.log(res.result)
    })
  },
  methods: {
    handleEdit (record) {
      this.reset()
      this.getTreeList()
      get(record.permissionId).then(res => {
        this.form = res.result
        if (this.form.action === null) {
          this.form.action = []
        }
        this.disabled = false
        this.title = '修改菜单'
        this.visible = true
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleCancel () {
      this.visible = false
      this.reset()
    },
    getTreeList () {
      getList(this.treeParams).then(res => {
        this.tree.treeData = []
        const permission = { title: '主页', children: [], permissionId: 0 }
        permission.children = res.result
        this.tree.treeData.push(permission)
      })
    },
    handleIconChange (icon) {
      this.form.icon = icon
      this.$message.info(<span>选中图标 <code>{icon}</code></span>)
    },
    changeIcon (type) {
      this.currentSelectedIcon = type
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.permissionId !== undefined) {
            update(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.visible = false
                this.$refs.table.refresh()
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            create(this.form).then(res => {
              if (res.code === 200) {
                this.$message.success('新增成功')
                this.visible = false
                this.$refs.table.refresh()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    reset () {
      this.form = {
        permissionId: undefined,
        parentId: 0,
        name: undefined,
        icon: undefined,
        title: undefined,
        sort: 0,
        action: [], // 查询的action数据
        actionUpload: [], // 上传的action数据
        show: 1,
        hideChildren: 0,
        hiddenHeaderContent: 0,
        redirect: undefined,
        describe: undefined,
        component: undefined,
        target: this.jumpWay[0]
      }
      this.resetForm('form')
    },
    handleAdd (row) {
      this.reset()
      this.getTreeList()
      if (row.permissionId != null) {
        this.form.parentId = row.permissionId
      }
      this.disabled = false
      this.title = '添加菜单'
      this.visible = true
    },
    handleDel (record) {
      del(record.permissionId).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
          this.$message.success('删除成功')
        } else {
          this.$message.error({
            message: res.message
          })
        }
      })
    },
    handleQuery (flag) {
      switch (flag) {
        case 0:
          this.queryParam = {}
          break
        case 1:
          break
      }
      this.$refs.table.refresh()
    },
    handleGet (record) {
      this.reset()
      this.getTreeList()
      get(record.permissionId).then(res => {
        this.form = res.result
        this.title = '菜单详情'
        this.disabled = true
        this.visible = true
      })
    },
    selectChange (value, option) {
      // console.log(this.actions.filter(item => item.value === value))
      // console.log(value)
      if (value.length > 0) {
        this.form.actionUpload = []
        for (let i = 0; i < value.length; i++) {
          this.actions.forEach(item => {
            if (value[i] === item.value) {
              const data = {
                label: item.label,
                value: item.value
              }
              this.form.actionUpload.push(data)
            }
          })
        }
        // console.log(this.form.actionUpload)
      }
      // this.form.describe = arr[0].label
      // console.log(value, option)
    }
  }
}
</script>

<style scoped>

</style>
