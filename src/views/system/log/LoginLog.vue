<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="true"
      :rowKey="record => record.ID"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
    </s-table>
  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import { getLoginLogPage } from '@/api/system/log'

  export default {
    name: 'LoginLog',
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
            title: 'ID',
            dataIndex: 'ID'
          },
          {
            title: '登录名',
            dataIndex: 'username'
          },
          {
            title: '手机',
            dataIndex: 'mobile'
          },
          {
            title: 'ip',
            dataIndex: 'ip'
          },
          {
            title: '登录地',
            dataIndex: 'location'
          },
          {
            title: '浏览器',
            dataIndex: 'browser'
          },
          {
            title: '操作平台',
            dataIndex: 'platform'
          },
          {
            title: '操作系统',
            dataIndex: 'os'
          },
          {
            title: '登录时间',
            dataIndex: 'loginTime'
          },
          {
            title: '登录信息',
            dataIndex: 'msg'
          },
          {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getLoginLogPage(Object.assign(parameter, this.queryParam)).then(res => {
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
          type: [ { required: true, message: '请选择字典类型', trigger: 'blur' } ],
          label: [ { required: true, message: '请输入字典标签', trigger: 'blur' } ],
          value: [ { required: true, message: '请输入字典值', trigger: 'blur' } ]
        },
        /* 多个禁用修改按钮 */
        single: true,
        /* 非0个开启删除按钮 */
        multiple: true,
        typeList: []
      }
    },
    methods: {
      reset () {
        this.form = {
          dictCode: undefined,
          label: undefined,
          type: undefined,
          value: undefined,
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
        this.title = '添加字典数据'
        this.disabled = false
        this.visible = true
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
