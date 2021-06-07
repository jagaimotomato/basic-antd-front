<template>
  <a-card :bordered="false">
    <div v-action:query_dicttype class="table-page-search-wrapper" style="margin-bottom: 15px">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="字典名称">
              <a-input
                v-model="queryParam.name"
                placeholder="请输入字典名称"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="字典类型">
              <a-input
                v-model="queryParam.type"
                placeholder="请输入字典类型"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-model-item label="状态" prop="status">
              <a-select
                v-model="queryParam.status"
                placeholder="请选择字典状态"
                default-value=""
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
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
      :rowKey="record => record.dictId"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <a-switch
        slot-scope="text, record"
        @change="handleStatus($event, record)"
        slot="status"
        :checked="record.status !== '0'"
      >
        <a-icon slot="checkedChildren" type="check" />
        <a-icon slot="unCheckedChildren" type="close" />
      </a-switch>
      <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-action:detail_dicttype>
              <a href="javascript:;" @click="handleGet(record)">详情</a>
            </a-menu-item>
            <a-menu-item v-action:del_dicttype>
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
        class="permission-form"
        ref="form"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字典名称"
          ref="name"
          prop="name"
        >
          <a-input
            placeholder="请输入字典名称"
            :disabled="disabled"
            v-model="form.name"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="字典类型"
          prop="type"
        >
          <a-input
            placeholder="请输入字典类型"
            :disabled="disabled"
            v-model="form.type"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          prop="status"
        >
          <a-select v-model="form.status" :disabled="disabled">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
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
  import { getDictTypePage, createDictType, updateDictType, getDictType, delDictType } from '@/api/system/dict'

  export default {
    name: 'DictType',
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
            title: '类型ID',
            dataIndex: 'dictId'
          },
          {
            title: '类型名称',
            dataIndex: 'name'
          },
          {
            title: '类型',
            dataIndex: 'type'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            scopedSlots: { customRender: 'createTime' },
            sorter: true
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
          return getDictTypePage(Object.assign(parameter, this.queryParam)).then(res => {
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
          type: [ { required: true, message: '请输入字典类型', trigger: 'blur' } ],
          name: [ { required: true, message: '请输入字典名称', trigger: 'blur' } ]
        },
        /* 多个禁用修改按钮 */
        single: true,
        /* 非0个开启删除按钮 */
        multiple: true
      }
    },
    methods: {
      handleEdit (record) {
        this.reset()
        const dictId = record.dictId || this.selectedRowKeys
        getDictType(dictId).then(res => {
          this.form = res.result
          this.title = '修改字典'
          this.disabled = false
          this.visible = true
        })
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      reset () {
        this.form = {
          dictId: undefined,
          name: undefined,
          type: undefined,
          status: '1'
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
        this.title = '添加字典'
        this.disabled = false
        this.visible = true
      },
      handleGet (record) {
        this.reset()
        const dictId = record.dictId
        getDictType(dictId).then(res => {
          this.form = res.result
          this.title = '字典详情'
          this.disabled = true
          this.visible = true
        })
      },
      /** 删除按钮操作 */
      handleDel (record) {
        const dictIds = record.dictId || this.selectedRowKeys
        const _self = this
        this.$confirm({
          title: '提示',
          content: '是否确认删除字典类型编号为"' + dictIds + '"的数据项?',
          onOk () {
            return new Promise((resolve, reject) => {
              delDictType(dictIds).then(res => {
                if (res.code === 200) {
                  _self.$refs.table.refresh()
                  _self.$message.success('删除成功')
                  resolve()
                } else if (res.code === 400) {
                  reject(res.message)
                } else {
                  reject(res.message)
                }
              })
            }).catch((err) => _self.$message.error(err))
          }
        })
      },
      handleStatus (checked, record) {
        console.log(checked, record)
        const text = checked ? '启用' : '停用'
        const _self = this
        this.$confirm({
          title: '提示',
          content: '确认要' + text + 'ID为"' + record.dictId + '"字典类型吗?',
          onOk () {
            return new Promise((resolve, reject) => {
              _self.form.status = record.status === '1' ? '0' : '1'
              _self.form.dictId = record.dictId
              updateDictType(_self.form).then(res => {
                if (res.code === 200) {
                  _self.$message.success('修改成功')
                  _self.$refs.table.refresh()
                  resolve()
                } else {
                  reject(res.message)
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
            if (this.form.dictId !== undefined) {
              updateDictType(this.form).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.visible = false
                  this.$refs.table.refresh()
                } else {
                  this.$message.error(res.message)
                }
              })
            } else {
              createDictType(this.form).then(res => {
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
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        this.multiple = selectedRowKeys.length === 0
        this.single = selectedRowKeys.length !== 1
      }
    }
  }
</script>
