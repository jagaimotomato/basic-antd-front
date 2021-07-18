<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 15px" v-action:add>
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-button type="primary" icon="plus" style="margin-left: 8px" @click="handleAdd">新增</a-button>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      :rowKey="record => record.departmentId"
    >
      <span slot="action" slot-scope="text, record">
        <a v-action:edit @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="handleGet(record)">详情</a>
            </a-menu-item>
            <a-menu-item v-action:del>
              <a-popconfirm
                title="确定删除这个部门吗?"
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
              label="父级部门"
            >
              <a-tree-select
                v-model="form.parentId"
                placeholder="请选择父级部门/组织"
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
              ref="name"
              prop="name"
              label="部门名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-model="form.name"
                placeholder="请输入部门/组织名称"
                :disabled="disabled"
              >
                <a-icon slot="addonAfter" type="bars"></a-icon>
              </a-input>
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
                placeholder="请输入部门/组织描述"
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
  import { STable } from '@/components'
  import { getPage, getTreeList, update, del, create, get } from '@/api/system/department'

  export default {
    name: 'Department',
    components: {
      STable
    },
    data () {
      return {
        columns: [
          {
            title: '部门/组织名',
            dataIndex: 'name'
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
            title: 'name',
            key: 'departmentId',
            value: 'departmentId'
          }
        },
        treeParams: {},
        // 弹出层标题
        title: '',
        jumpWay: ['', '_blank', '_self'],
        rules: {
          parentId: [ { required: true, message: '请选择父级部门/组织', trigger: 'blur' } ],
          name: [ { required: true, message: '请输入部门/组织名称', trigger: 'blur' } ]
        },
        /* 详情禁用表单 */
        disabled: false
      }
    },
    watch: {},
    created () {
    },
    methods: {
      handleEdit (record) {
        this.reset()
        this.getListTree()
        get(record.departmentId).then(res => {
          this.form = res.result
          this.disabled = false
          this.title = '修改部门'
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
      getListTree () {
        getTreeList(this.treeParams).then(res => {
          this.tree.treeData = []
          const permission = { name: '顶级', children: [], departmentId: 0 }
          permission.children = res.result
          this.tree.treeData.push(permission)
        })
      },
      submitForm () {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.form.departmentId !== undefined) {
              update(this.form).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.visible = false
                  this.$refs.table.refresh()
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              create(this.form).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  this.visible = false
                  this.$refs.table.refresh()
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          }
        })
      },
      reset () {
        this.form = {
          departmentId: undefined,
          parentId: 0,
          name: undefined
        }
        this.resetForm('form')
      },
      handleAdd (row) {
        this.reset()
        this.getListTree()
        if (row.permissionId != null) {
          this.form.parentId = row.permissionId
        }
        this.disabled = false
        this.title = '添加部门'
        this.visible = true
      },
      handleDel (record) {
        del(record.departmentId).then(res => {
          if (res.code === 200) {
            this.$refs.table.refresh()
            this.$message.success('删除成功')
          } else {
            this.$message.error({
              message: res.msg
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
        this.getListTree()
        get(record.permissionId).then(res => {
          this.form = res.result
          this.title = '部门详情'
          this.disabled = true
          this.visible = true
        })
      }
    }
  }
</script>

<style scoped>

</style>
