<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 15px">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="路径">
              <a-input
                v-model="queryParam.path"
                placeholder="请输入路径"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="描述">
              <a-input
                v-model="queryParam.desc"
                placeholder="请输入api描述"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="api分组">
              <a-input
                v-model="queryParam.group"
                placeholder="请输入api分组"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-model-item label="请求方式" prop="method">
              <a-select
                v-model="queryParam.method"
                placeholder="请选择请求方式"
                default-value=""
              >
                <a-select-option value="GET">GET</a-select-option>
                <a-select-option value="POST">POST</a-select-option>
                <a-select-option value="PUT">PUT</a-select-option>
                <a-select-option value="DELETE">DELETE</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleQuery(1)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleQuery(0)">重置</a-button>
            </span>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-button
            type="primary"
            icon="plus"
            @click="handleAdd"
          >
            新增
          </a-button>
          <a-button
            style="margin-left: 8px"
            type="primary"
            icon="edit"
            :disabled="single"
            @click="handleEdit"
          >
            修改
          </a-button>
          <a-button
            style="margin-left: 8px"
            type="primary"
            icon="delete"
            :disabled="multiple"
            @click="handleDel"
          >
            删除
          </a-button>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="true"
      :rowKey="record => record.id"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <div slot="method" slot-scope="text">
        <span>
          {{ text }}
        </span>
        <a-tag v-if="text === 'GET'" color="blue">查看</a-tag>
        <a-tag v-else-if="text === 'PUT'" color="orange">更新</a-tag>
        <a-tag v-else-if="text === 'POST'" color="green">新建</a-tag>
        <a-tag v-else color="red">删除</a-tag>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-action:detail_dictdata>
              <a href="javascript:;" @click="handleGet(record)">详情</a>
            </a-menu-item>
            <a-menu-item v-action:del_dictdata>
              <a href="javascript:;" @click="handleDel(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      style="top: 20px;"
      :width="800"
      :title="title"
      v-model="visible"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="api路径"
          ref="path"
          prop="path"
        >
          <a-input
            placeholder="请输入api路径"
            :disabled="disabled"
            v-model="form.path"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="api分组"
          prop="group"
        >
          <a-input
            placeholder="请输入api分组"
            :disabled="disabled"
            v-model="form.group"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="api简介"
          prop="desc"
        >
          <a-input
            placeholder="请输入简介"
            :disabled="disabled"
            v-model="form.desc"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请求方式"
          prop="method"
        >
          <a-select v-model="form.method" :disabled="disabled">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
          </a-select>
        </a-form-model-item>
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
import { get, getPage, del, update, create } from '@/api/system/api'

export default {
  name: 'Index',
  components: {
    STable
  },
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
      form: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: 'api路径',
          dataIndex: 'path'
        },
        {
          title: 'api分组',
          dataIndex: 'group'
        },
        {
          title: 'api简介',
          dataIndex: 'desc'
        },
        {
          title: '请求方式',
          dataIndex: 'method',
          scopedSlots: { customRender: 'method' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPage(Object.assign(parameter, this.queryParam)).then(res => {
          const result = res.result
          return result
        })
      },
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      title: '',
      disabled: false,
      rules: {
        group: [ { required: true, message: '请输入分组', trigger: 'blur' } ],
        path: [ { required: true, message: '请输入path', trigger: 'blur' } ],
        method: [ { required: true, message: '请选择请求方式', trigger: 'blur' } ]
      },
      /* 多个禁用修改按钮 */
      single: true,
      /* 非0个开启删除按钮 */
      multiple: true,
      typeList: []
    }
  },
  created () {
  },
  methods: {
    handleEdit (record) {
      this.reset()
      const id = record.id || this.selectedRowKeys
      get(id).then(res => {
        this.form = res.result
        this.title = '修改api'
        this.disabled = false
        this.visible = true
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    reset () {
      this.form = {
        id: undefined,
        path: undefined,
        method: undefined,
        desc: undefined,
        group: undefined
      }
      this.resetForm('form')
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
    handleAdd () {
      this.reset()
      this.title = '添加api'
      this.disabled = false
      this.visible = true
    },
    handleGet (record) {
      this.reset()
      const id = record.id
      get(id).then(res => {
        this.form = res.result
        this.title = 'api详情'
        this.disabled = true
        this.visible = true
      })
    },
    /** 删除按钮操作 */
    handleDel (record) {
      const ids = record.id || this.selectedRowKeys
      const _self = this
      this.$confirm({
        title: '提示',
        content: '是否确认删除字典数据编号为"' + ids + '"的数据项?',
        onOk () {
          return new Promise((resolve, reject) => {
            del(ids).then(res => {
              if (res.code === 200) {
                _self.$refs.table.refresh()
                _self.$message.success('删除成功')
                resolve()
              } else if (res.code === 400) {
                reject(res.msg)
              } else {
                reject(res.msg)
              }
            })
          }).catch((err) => _self.$message.error(err))
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.reset()
    },
    submitForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.multiple = selectedRowKeys.length === 0
      this.single = selectedRowKeys.length !== 1
    }
  }
}
</script>
