<template>
  <a-card :bordered="false">
    <div v-action:query class="table-page-search-wrapper" style="margin-bottom: 15px">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="用户名">
              <a-input
                v-model="queryParam.username"
                placeholder="请输入用户名"
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
    <a-row :gutter="8">
      <a-col :span="5">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" v-model="searchVal" @search="onTreeSearch" />
        <a-tree
          :tree-data="tree.treeData"
          :replaceFields="tree.replaceFields"
          @select="handleTreeSelect"
        />
      </a-col>
      <a-col :span="19">
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :rowKey="record => record.userId"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          style="min-width: 1200px"
        >
          <a-row type="flex" slot="userInfo" slot-scope="text, record">
            <a-col style="display: flex; flex-direction: column; justify-content: center">
              <a-avatar size="large" icon="user" />
            </a-col>
            <a-col style="margin-left: 10px" class="font12">
              <a-row type="flex">
                <a-col style="font-size: 17px; font-weight: bold">{{ record.username }}</a-col>
                <a-col v-if="record.sex==='1'" style="margin-left: 5px" :span="4">
                  <img style="width: 10px" src="@/assets/system/male.png" alt="">
                </a-col>
                <a-col v-else style="margin-left: 5px" :span="4">
                  <img style="width: 10px" src="@/assets/system/female.png" alt="">
                </a-col>
              </a-row>
              <a-row type="flex" style="align-items: center">
                <a-col class="gray">昵称：</a-col>
                <a-col>
                  <ellipsis :length="8" tooltip>
                    {{ record.name }}
                  </ellipsis>
                </a-col>
              </a-row>
              <a-row type="flex" style="align-items: center">
                <a-col class="gray">真实姓名：</a-col>
                <a-col>
                  <ellipsis :length="8" tooltip>
                    {{ record.realName }}
                  </ellipsis>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row type="flex" slot="role" slot-scope="text, record">
            <a-col v-for="item in record.roles" :key="item.roleId" style="margin-bottom: 5px">
              <a-tag color="orange">
                {{ item.roleKey }}
              </a-tag>
            </a-col>
          </a-row>
          <a-row type="flex" slot="organization" slot-scope="text, record">
            <a-col v-for="item in record.departments" :key="item.departmentId" style="margin-bottom: 5px">
              <a-tag color="purple">
                {{ item.name }}
              </a-tag>
            </a-col>
          </a-row>
          <a-row slot-scope="text, record" slot="status">
            <a-switch
              @change="handleStatus($event, record)"
              :checked="record.status !== '0'"
            >
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </a-row>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
            </template>
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="handleGet(record)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="handleDel(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <a-modal
      style="top: 20px;"
      :width="800"
      :title="modal.title"
      v-model="modal.visible"
    >
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="用户名"
              ref="username"
              prop="username"
              hasFeedback
            >
              <a-input
                placeholder="用户名/登录名"
                :disabled="modal.disabled"
                v-model="form.username"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="昵称"
              prop="name"
              hasFeedback
            >
              <a-input
                placeholder="起一个昵称"
                :disabled="modal.disabled"
                v-model="form.name"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="姓名"
              prop="realName"
            >
              <a-input
                placeholder="起一个名字"
                v-model="form.realName"
                :disabled="modal.disabled"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="手机号码"
              prop="phone"
            >
              <a-input
                placeholder="输入手机号码"
                v-model="form.phone"
                :disabled="modal.disabled"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12" v-if="modal.show">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="密码"
              prop="password"
            >
              <a-input
                placeholder="想一个密码"
                type="password"
                v-model="form.password"
                :disabled="modal.disabled"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="性别"
              prop="sex"
            >
              <a-radio-group v-model="form.sex" :disabled="modal.disabled">
                <a-radio value="1">♂</a-radio>
                <a-radio value="0">♀</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              prop="departmentIds"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="组织/部门"
            >
              <a-tree-select
                show-search
                allowClear
                treeNodeFilterProp="title"
                placeholder="请选择部门"
                :disabled="modal.disabled"
                :treeData="tree.treeData"
                :replaceFields="tree.replaceFields"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                v-model="form.departmentIds"
                multiple
              >
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="角色"
              prop="role"
            >
              <a-select
                mode="multiple"
                placeholder="请分配用户角色"
                v-model="form.roleIds"
                @change="selectChange"
                :disabled="modal.disabled"
                :allowClear="true"
              >
                <a-select-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :value="item.roleId"
                >
                  {{ item.roleKey }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="状态"
              prop="status"
            >
              <a-select v-model="form.status" :disabled="modal.disabled">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button v-if="!modal.disabled" key="submit" type="primary" @click="submitForm">
          确定
        </a-button>
      </template>
    </a-modal>
  </a-card>
</template>

<script>
  import { STable, Ellipsis } from '@/components'
  import { getPage, update, create, del, updateStatus, get } from '@/api/system/user'
  import { getList } from '@/api/system/role'
  import { getTreeList } from '@/api/system/department'

  export default {
    name: 'User',
    components: {
      STable,
      Ellipsis
    },
    data () {
      return {
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: 'ID',
            dataIndex: 'userId'
          },
          {
            title: '用户',
            width: '250px',
            scopedSlots: { customRender: 'userInfo' }
          },
          {
            title: '拥有角色',
            scopedSlots: { customRender: 'role' }
          },
          {
            title: '部门',
            scopedSlots: { customRender: 'organization' }
          },
          /* {
            title: '登录次数',
            dataIndex: 'loginTimes',
            sorter: true,
            needTotal: true,
            customRender: (text) => text + ' 次'
          }, */
          {
            title: '状态',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getPage(Object.assign(parameter, this.queryParam))
            .then(res => {
              return res.result
            })
        },
        selectedRowKeys: [],
        selectedRows: [],
        form: {},
        modal: {
          title: '',
          visible: false,
          disabled: false,
          show: true // 是否密码框出现
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        tree: {
          treeData: [],
          replaceFields: {
            children: 'children',
            title: 'name',
            key: 'departmentId',
            value: 'departmentId'
          }
        },
        roleList: [],
        rules: {
          username: [
            { required: true, message: '请输入用户名/登录名', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在5到15个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在5到15个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
            {
              type: 'email',
              message: "'请输入正确的邮箱地址",
              trigger: ['blur', 'change']
            }
          ],
          phone: [
            { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        },
        /* 多个禁用修改按钮 */
        single: true,
        /* 非0个开启删除按钮 */
        multiple: true,
        searchVal: ''
      }
    },
    created () {
      this.getDepartTreeList()
    },
    methods: {
      getDepartTreeList (data) {
        getTreeList(data).then(res => {
          this.tree.treeData = res.result
        })
      },
      getRoleList () {
        getList().then(res => {
          this.roleList = res.result
        })
      },
      handleStatus (checked, record) {
        const text = checked ? '启用' : '停用'
        const _this = this
        this.$confirm({
          title: '提示',
          content: '确认要' + text + '姓名为"' + record.realName + '"用户吗?',
          onOk () {
            return new Promise((resolve, reject) => {
              const data = {
                userId: record.userId,
                status: record.status === '1' ? '0' : '1'
              }
              updateStatus(data).then(res => {
                if (res.code === 200) {
                  _this.$message.success('修改成功')
                  _this.$refs.table.refresh()
                  resolve()
                } else {
                  reject(res.message)
                }
              })
            }).catch((err) => _this.$message.error(err))
          }
        })
      },
      handleAdd () {
        this.reset()
        this.getDepartTreeList()
        this.getRoleList()
        this.title = '添加用户'
        this.modal.disabled = false
        this.modal.show = true
        this.modal.visible = true
      },
      reset () {
        this.form = {
          userId: undefined,
          username: undefined,
          realName: undefined,
          name: undefined,
          departmentIds: [],
          roleIds: [],
          phone: undefined,
          email: undefined,
          sex: '1',
          password: undefined,
          status: '1'
        }
      },
      handleCancel () {
        this.modal.visible = false
        this.reset()
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
      handleEdit (record) {
        this.reset()
        const userId = record.userId || this.selectedRowKeys
        this.getRoleList()
        this.getDepartTreeList()
        get(userId).then(res => {
          this.form = res.result
          this.modal.title = '修改用户'
          this.modal.disabled = false
          this.modal.show = false
          this.modal.visible = true
        })
      },
      handleGet (record) {
        this.reset()
        const userId = record.userId
        this.getRoleList()
        this.getDepartTreeList()
        get(userId).then(res => {
          this.form = res.result
          this.title = '用户详情'
          this.modal.disabled = true
          this.modal.show = false
          this.modal.visible = true
        })
      },
      handleDel (record) {
        console.log(record)
        const userIds = record.userId || this.selectedRowKeys
        const _self = this
        this.$confirm({
          title: '提示',
          content: '是否确认删除用户编号为"' + userIds + '"的数据项?',
          onOk () {
            return new Promise((resolve, reject) => {
              del(userIds).then(res => {
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
      submitForm () {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.form.userId !== undefined) {
              update(this.form).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.modal.visible = false
                  this.$refs.table.refresh()
                } else {
                  this.$message.error(res.message)
                }
              })
            } else {
              create(this.form).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                  this.modal.visible = false
                  this.$refs.table.refresh()
                } else {
                  this.$message.error(res.message)
                }
              })
            }
          }
        })
      },
      handleTreeSelect (selectedKeys, e) {
        this.reset()
        if (selectedKeys.length > 0) {
          this.queryParam.departmentId = e.selectedNodes[0].data.props.departmentId
        } else {
          this.queryParam = {}
        }
        this.handleQuery(1)
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        this.multiple = selectedRowKeys.length === 0
        this.single = selectedRowKeys.length !== 1
      },
      handleSearch (val) {
        console.log(val)
      },
      onCheck (checkedKeys, info) {
        // console.log('onCheck', checkedKeys, info)
        // console.log('ids', this.form.permissionIds)
      },
      selectChange (value) {
        console.log(value)
      },
      onTreeSearch () {
        const data = {
          name: this.searchVal
        }
        this.getDepartTreeList(data)
      }
    }
  }
</script>

<style lang="less">
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
  .gray {
    color: #bababa;
  }

  .font12 {
    font-size: 12px;
  }
</style>
