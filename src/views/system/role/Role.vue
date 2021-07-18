<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 15px">
      <a-form-model layout="inline" v-action:query_role>
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-model-item label="角色名称" prop="name">
              <a-input
                v-model="queryParam.name"
                placeholder="请输入角色名称"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-model-item label="权限字符" prop="roleKey">
              <a-input
                v-model="queryParam.roleKey"
                placeholder="请输入权限字符"
                allow-clear
                @keyup.enter.native="handleQuery(1)"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-model-item label="状态" prop="status">
              <a-select
                v-model="queryParam.status"
                placeholder="角色状态"
                default-value=""
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleQuery(1)">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleQuery(0)">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row :gutter="10">
        <a-button
          v-action:add_role
          type="primary"
          icon="plus"
          @click="handleAdd"
        >
          新增
        </a-button>
        <a-button
          v-action:edit_role
          style="margin-left: 8px"
          type="primary"
          icon="edit"
          :disabled="single"
          @click="handleEdit"
        >
          修改
        </a-button>
        <a-button
          v-action:del_role
          style="margin-left: 8px"
          type="primary"
          icon="delete"
          :disabled="multiple"
          @click="handleDel"
        >
          删除
        </a-button>
      </a-row>
    </div>

    <s-table
      ref="table"
      row-key="id"
      size="default"
      :columns="columns"
      :data="loadData"
      :expandedRowKeys="expandedRowKeys"
      @expand="handleExpand"
      :showAlertInfo="true"
      :rowKey="record => record.roleId"
      :defaultExpandAllRows="false"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px', height: '23px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.title }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionList && role.actionList.length > 0">
              <a-tag color="cyan" v-for="action in role.actionList" :key="action">{{ action | permissionFilter }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <!-- <a-tag color="blue" slot="status" slot-scope="text">{{ text | statusFilter }}</a-tag> -->
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
            <a-menu-item v-action:detail_role>
              <a href="javascript:;" @click="handleGet(record)">详情</a>
            </a-menu-item>
            <a-menu-item v-action:del_role>
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
          label="唯一识别码"
          ref="roleKey"
          prop="roleKey"
          hasFeedback
        >
          <a-input
            placeholder="唯一识别码"
            :disabled="disabled"
            v-model="form.roleKey"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          prop="name"
          hasFeedback
        >
          <a-input
            placeholder="起一个名字"
            v-decorator="['name']"
            :disabled="disabled"
            v-model="form.name"
          />
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序"
          prop="sort"
        >
          <a-input-number
            :min="0"
            :max="100000"
            v-model="form.sort"
            :disabled="disabled"
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

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          prop="describe"
        >
          <a-textarea
            :disabled="disabled"
            :rows="5"
            placeholder="..."
            id="describe"
            v-model="form.describe"
          />
        </a-form-model-item>

        <a-divider>菜单及操作权限</a-divider>
        <a-row>
          <a-form-model-item
            label="权限"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-tree
              :disabled="disabled"
              :tree-data="tree.treeData"
              v-model="form.permissionIds"
              :replaceFields="tree.replaceFields"
              @check="onCheck"
              checkable
            ></a-tree>
          </a-form-model-item>
        </a-row>
        <a-divider>api权限</a-divider>
        <a-row>
          <a-form-model-item
            label="api权限"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-tree
              :disabled="disabled"
              :tree-data="apiTree.treeData"
              v-model="apiIds"
              :replaceFields="apiTree.replaceFields"
              @check="onApiCheck"
              checkable
            ></a-tree>
          </a-form-model-item>
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
import { getPage, create, update, get, del, updateStatus } from '@/api/system/role'
import { getList, getCasbinList } from '@/api/system/api'
import { getTree, getRoleTree } from '@/api/system/permission'
import { PERMISSION_ENUM } from '@/core/permission/permission'

const STATUS = {
  1: '启用',
  2: '禁用'
}
export default {
  name: 'Role',
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
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      form: {},
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'roleKey'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'sort',
          align: 'center',
          sorter: (a, b) => a.sort - b.sort,
          sortDirections: ['descend']
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
        return getPage(Object.assign(parameter, this.queryParam)).then(res => {
          // this.expandedRowKeys = res.result.list.map(item => item.roleId)
          const result = res.result
          return result
        })
      },
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
      title: '',
      disabled: false,
      tree: {
        treeData: [],
        replaceFields: {
          children: 'children',
          title: 'title',
          key: 'permissionId'
        }
      },
      apiTree: {
        treeData: [],
        replaceFields: {
          children: 'children',
          title: 'desc',
          key: 'onlyId'
        }
      },
      apiTreeIds: [],
      rules: {
        roleKey: [ { required: true, message: '请输入唯一识别码', trigger: 'blur' } ],
        name: [ { required: true, message: '请输入角色名称', trigger: 'blur' } ]
      },
      /* 多个禁用修改按钮 */
      single: true,
      /* 非0个开启删除按钮 */
      multiple: true,
      childrenIds: [], // 存放所有子节点id
      permissionIds: [], // 需要提交的permissionId
      apiCheckedNodes: [], // 选择的api nodes
      apiIds: []
    }
  },
  filters: {
    statusFilter (key) {
      return STATUS[key]
    },
    permissionFilter (key) {
      const permission = PERMISSION_ENUM[key]
      return permission && permission.label
    }
  },
  async created () {
    const res = await getList()
    this.apiTree.treeData = this.genApiTree(res.result)
    console.log(this.apiTree.treeData)
  },
  methods: {
    handleEdit (record) {
      this.reset()
      const roleId = record.roleId || this.selectedRowKeys
      this.getPermissionTree()
      get(roleId).then(res => {
        this.form = res.result
        this.title = '修改角色'
        this.disabled = false
        this.getRolePermissionTree(roleId)
        this.handleCasbinIds(record.roleKey)
        this.visible = true
      })
    },
    async handleCasbinIds (roleKey) {
      const res = await getCasbinList(roleKey)
      res.result && res.result.map(item => {
        this.apiIds.push('p:' + item.v1 + 'm:' + item.v2)
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    reset () {
      this.form = {
        roleId: undefined,
        name: undefined,
        roleKey: undefined,
        sort: 0,
        status: '1',
        permissionIds: [],
        apis: []
      }
      this.apiIds = []
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
      this.getPermissionTree()
      this.title = '添加角色'
      this.disabled = false
      this.visible = true
    },
    handleGet (record) {
      this.reset()
      const roleId = record.roleId
      this.getPermissionTree()
      get(roleId).then(res => {
        this.form = res.result
        this.title = '菜单详情'
        this.disabled = true
        this.handleCasbinIds(record.roleKey)
        this.getRolePermissionTree(roleId)
        this.visible = true
      })
    },
    /** 删除按钮操作 */
    handleDel (record) {
      const roleIds = record.roleId || this.selectedRowKeys
      const _self = this
      this.$confirm({
        title: '提示',
        content: '是否确认删除角色编号为"' + roleIds + '"的数据项?',
        onOk () {
          return new Promise((resolve, reject) => {
            del(roleIds).then(res => {
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
    handleStatus (checked, record) {
      console.log(checked, record)
      const text = checked ? '启用' : '停用'
      const _self = this
      this.$confirm({
        title: '提示',
        content: '确认要' + text + '识别码为"' + record.roleKey + '"角色吗?',
        onOk () {
          return new Promise((resolve, reject) => {
            _self.form.status = record.status === '1' ? '0' : '1'
            _self.form.roleId = record.roleId
            updateStatus(_self.form).then(res => {
              if (res.code === 200) {
                _self.$message.success('修改成功')
                _self.$refs.table.refresh()
                resolve()
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
        const casbin = []
        const apiCheckNodes = this.apiCheckedNodes
        apiCheckNodes && apiCheckNodes.map(item => {
          const casbinInfo = {
            path: item.data.props.path,
            method: item.data.props.method
          }
          if (item.key !== undefined) {
            casbin.push(casbinInfo)
          }
        })
        this.form.permissionIds = this.permissionIds
        this.form.apis = casbin
        if (valid) {
          if (this.form.roleId !== undefined) {
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
    handleExpand (expanded, record) {
      console.log('expanded', expanded, record)
      if (expanded) {
        this.expandedRowKeys.push(record.roleId)
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(item => record.roleId !== item)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.multiple = selectedRowKeys.length === 0
      this.single = selectedRowKeys.length !== 1
    },
    /* 菜单树 */
    getPermissionTree () {
      this.childrenIds = []
      getTree().then(res => {
        this.tree.treeData = res.result
        this.allChildrenList(res.result)
        // console.log(this.childrenIds)
      })
    },
    getRolePermissionTree (roleId) {
      getRoleTree(roleId).then(res => {
        this.form.permissionIds = this.uniqueTree(res.result, this.childrenIds)
      })
    },
    onCheck (checkedKeys, info) {
      // console.log('onCheck', checkedKeys, info)
      // console.log('ids', this.form.permissionIds)
      /* console.log(info.halfCheckedKeys) */
      this.permissionIds = checkedKeys.concat(info.halfCheckedKeys)
      // console.log(this.permissionIds)
      // console.log(info.halfCheckedKeys, this.form.permissionIds)
    },
    onApiCheck (checkedKeys, info) {
      // console.log('onCheck', checkedKeys, info)
      // console.log('ids', this.form.permissionIds)
      /* console.log(info.halfCheckedKeys) */
      // console.log(this.permissionIds)
      console.log(info.checkedNodes, checkedKeys)
      this.apiCheckedNodes = info.checkedNodes
    },
    allChildrenList (data) {
      data.map(item => {
        if (item.children && item.children.length > 0) {
          this.allChildrenList(item.children)
        } else {
          this.childrenIds.push(item.permissionId)
        }
      })
    },
    uniqueTree (uniqueArr, arr) {
      const uniqueChild = []
      for (const i in arr) {
        for (const k in uniqueArr) {
          if (uniqueArr[k] === arr[i]) {
            uniqueChild.push(uniqueArr[k])
          }
        }
      }
      return uniqueChild
    },
    genApiTree (apis) {
      const apiObj = {}
      apis && apis.map(item => {
        item.onlyId = 'p:' + item.path + 'm:' + item.method
        if (Object.prototype.hasOwnProperty.call(apiObj, item.group)) {
          apiObj[item.group].push(item)
        } else {
          Object.assign(apiObj, { [item.group]: [item] })
        }
      })
      const apiTree = []
      for (const key in apiObj) {
        const treeNode = {
          id: key,
          desc: key + '组',
          children: apiObj[key]
        }
        apiTree.push(treeNode)
      }
      return apiTree
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
