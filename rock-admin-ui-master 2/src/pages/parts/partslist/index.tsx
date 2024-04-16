import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Space, Switch, Form, Popconfirm, Table, Card } from 'antd';
import type { TableListItem } from './data';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import { addParts, deleteParts, queryparts, updateParts } from './service';
import { queryMan } from '@/pages/userListForEnAdmin/manufacturersList/service';
import { querySup } from '@/pages/userListForEnAdmin/supList/service';


const RbacTypeList: React.FC = () => {
  const [sup, setSup] = useState<any>();
  const [man, setMan] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [belongto, setBelongto] = useState<any>();
  async function handleDeleteUser(id: number) {
    console.log({ id });
    const response = await deleteParts(id);
    const { code, msg } = response;
    if (code !== 200) {
      message.error(msg);
      return;
    }
    message.success(msg);
    if (actionRef.current) {
      actionRef.current?.reload();
    }
  }
  const columns_sup: ProColumns[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '供货商名称',
      dataIndex: 'name',
    },
    {
      title: '负责人姓名',
      dataIndex: 'adminname',
    },
    {
      title: '负责人电话',
      dataIndex: 'adminphone',
    },
    {
      title: '创建时间',
      search: false,
      hideInForm: true,
      dataIndex: 'created_at',
    },
  ];
  const columns_man: ProColumns[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '生产厂家名',
      dataIndex: 'name',
    },
    {
      title: '负责人姓名',
      dataIndex: 'adminname',
    },
    {
      title: '负责人电话',
      dataIndex: 'adminphone',
    },
    {
      title: '资质',
      dataIndex: 'qualification',
      search: false,
    },
    {
      title: '创建时间',
      search: false,
      hideInForm: true,
      dataIndex: 'created_at',
    },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '零件名称',
      dataIndex: 'name',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      hideInTable: true,
      search: false,
    },
    {
      title: '型号',
      dataIndex: 'model',
      hideInTable: true,
      search: false,
    },
    {
      title: '生产厂家',
      dataIndex: 'man',
    },
    {
      title: '供货商',
      dataIndex: 'sup',
    },
    {
      title: '剩余库存',
      dataIndex: 'remain',
      search: false,
    },
    {
      title: '使用中',
      dataIndex: 'used',
      search: false,
    },
    {
      title: '已报废',
      dataIndex: 'diposed',
      search: false,
    },
    {
      title: '购买时间',
      search: false,
      hideInForm: true,
      dataIndex: 'buy_at',
    },
    {
      title: '操作',
      hideInForm: true,
      search: false,
      render: (_, record) => {
        return (
          <Space>
            <DrawerForm
              title="查看"
              key={'_lookup_form_' + record.id}
              submitter={false}
              trigger={
                <a
                  type="primary"
                  onClick={async () => {
                    console.log({ record });
                    setSup(record.sup);
                    setMan(record.man);
                  }}
                >
                  查看
                </a>
              }
              form={form}
              autoFocusFirstInput
            >
              {' '}  
              <Card title="零件详细信息">
                <Table
                  style={{ width: '100%' }}
                  bordered
                  size="small"
                  pagination={false}
                  dataSource={[record]}
                >
                  <Table.Column title="规格" dataIndex="spec" key="spec" width={200} />
                  <Table.Column title="型号" dataIndex="model" key="model" width={200} />
                  <Table.Column title="购买时间" dataIndex="buy_at" key="buy_at" width={200} />
                </Table>
               
              </Card>         
              <Card title="供货商详细信息">
                <ProTable
                  actionRef={actionRef}
                  options={false}
                  pagination={false}
                  rowKey="id"
                  search={false}
                  columns={columns_sup}
                  request={async (params = {}) => {
                    const response = await querySup({ ...params, name: sup, belongto: belongto });
                    console.log({ response });
                    return {
                      success: response.code === 200,
                      data: response!.data!.list,
                      page: response!.data!.page_num,
                      total: response!.data!.total,
                    };
                  }}
                />
              </Card>
              <Card title="生产厂家详细信息">
                <ProTable
                  actionRef={actionRef}
                  options={false}
                  pagination={false}
                  rowKey="id"
                  search={false}
                  columns={columns_man}
                  request={async (params = {}) => {
                    const response = await queryMan({ ...params, name: man, belongto: belongto });
                    console.log({ response });
                    return {
                      success: response.code === 200,
                      data: response!.data!.list,
                      page: response!.data!.page_num,
                      total: response!.data!.total,
                    };
                  }}
                />
              </Card>
            </DrawerForm>
            <a
              type={'primary'}
              onClick={() => {
                form.setFieldsValue(record);
                handleUpdateModalVisible(true);
              }}
            >
              编辑
            </a>
            <Popconfirm title={'确认删除？'} onConfirm={() => handleDeleteUser(record.id!)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <Access accessible={access.basicTypeIndex!}>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          columns={columns}
          toolBarRender={() => [
            <Access accessible={access.supListCreate!}>
              <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
                <PlusOutlined /> 新建
              </Button>
            </Access>,
          ]}
          request={async (params = {}) => {
            const rsp = await queryCurrentUser();
          const belongto = rsp.data?.belongto;
          setBelongto(belongto);
            const response = await queryparts({ ...params, belongto: rsp.data?.belongto });
            console.log({ response });
            return {
              success: response.code === 200,
              data: response!.data!.list,
              page: response!.data!.page_num,
              total: response!.data!.total,
            };
          }}
        />
        {createModalVisible && (
          <ModalForm
            title="添加"
            width="450px"
            visible={createModalVisible}
            isKeyPressSubmit={true}
            onVisibleChange={handleCreateModalVisible}
            modalProps={{
              centered: true,
            }}
            onFinish={async (value) => {
              const rsp = await queryCurrentUser();
              value.buy_at = new Date(value.buy_at);
              value.belongto = rsp.data?.belongto;
              const response = await addParts(value as TableListItem);
              const { code, msg } = response;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success(msg);
              handleCreateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
             <ProFormText
              name="name"
              label={'零件名称'}
              placeholder={'请输入零件名称'}
              rules={[
                {
                  required: true,
                  message: '请输入零件名称',
                },
              ]}
            />
            <ProFormText
              name="spec"
              width="xs"
              label={'规格'}
              placeholder={'请输入规格'}
              rules={[
                {
                  required: true,
                  message: '请输入规格',
                },
              ]}
            />
            <ProFormText
              name="model"
              label={'型号'}
              width="xs"
              placeholder={'请输入型号'}
              rules={[
                {
                  required: true,
                  message: '请输入型号',
                },
              ]}
            />
             <ProFormDateTimePicker
            name={'buy_at'}
            label={'购买时间'}
            width="md"
            placeholder={'请输入购买时间'}
            rules={[
              {
                required: true,
                message: '请输入购买时间',
              },
            ]}
          />
            <ProFormText
            name={'man'}
            label={'生产厂家'}
            width="md"
            placeholder={'请输入生产厂家'}
            rules={[
              {
                required: true,
                message: '请输入生产厂家',
              },
            ]}
            request={async () => {
              const response = await await queryMan({
                belongto: belongto,
              });
              console.log({ response });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.name,
                };
              });
            }}
          />
           <ProFormText
            name={'sup'}
            label={'供货商'}
            width="md"
            placeholder={'请输入供货商'}
            rules={[
              {
                required: true,
                message: '请输入供货商',
              },
            ]}
            request={async () => {
              const response = await await querySup({
                belongto: belongto,
              });
              console.log({ response });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.name,
                };
              });
            }}
          />
           <ProFormText
            name={'remain'}
            label={'剩余库存'}
            width="md"
            placeholder={'请输入剩余库存'}
            rules={[
              {
                required: true,
                message: '请输入剩余库存',
              },
            ]}
            
          />
           <ProFormText
              name="used"
              label={'使用中'}
              placeholder={'请输入使用中'}
              rules={[
                {
                  required: true,
                  message: '请输入使用中',
                },
              ]}
            />
             <ProFormText
              name="diposed"
              label={'已报废'}
              placeholder={'请输入已报废'}
              rules={[
                {
                  required: true,
                  message: '请输入已报废',
                },
              ]}
            />
          </ModalForm>
        )}
        {updateModalVisible && (
          <ModalForm<TableListItem>
            title="编辑"
            width="450px"
            form={form}
            isKeyPressSubmit={true}
            visible={updateModalVisible}
            onVisibleChange={handleUpdateModalVisible}
            modalProps={{
              centered: true,
            }}
            onFinish={async (value: TableListItem) => {
              const payload: TableListItem = {
                id: value.id,
                ...value,
              };
              const response = await updateParts(payload);
              const { code, msg } = response;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success(msg);
              handleUpdateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            <ProFormText name={'id'} label={'ID'} hidden />
            <ProFormText name={'belongto'} label={'belongto'} hidden />
            <ProFormText
              name="name"
              label={'零件名称'}
              placeholder={'请输入零件名称'}
              rules={[
                {
                  required: true,
                  message: '请输入零件名称',
                },
              ]}
            />
            <ProFormText
              name="spec"
              width="xs"
              label={'规格'}
              placeholder={'请输入规格'}
              rules={[
                {
                  required: true,
                  message: '请输入规格',
                },
              ]}
            />
            <ProFormText
              name="model"
              label={'型号'}
              width="xs"
              placeholder={'请输入型号'}
              rules={[
                {
                  required: true,
                  message: '请输入型号',
                },
              ]}
            />
            <ProFormText
            name={'man'}
            label={'生产厂家'}
            width="md"
            placeholder={'请输入生产厂家'}
            rules={[
              {
                required: true,
                message: '请输入生产厂家',
              },
            ]}
            request={async () => {
              const response = await await queryMan({
                belongto: belongto,
              });
              console.log({ response });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.name,
                };
              });
            }}
          />
           <ProFormText
            name={'sup'}
            label={'供货商'}
            width="md"
            placeholder={'请输入供货商'}
            rules={[
              {
                required: true,
                message: '请输入供货商',
              },
            ]}
            request={async () => {
              const response = await await querySup({
                belongto: belongto,
              });
              console.log({ response });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.name,
                };
              });
            }}
          />
            <ProFormText
            name={'remain'}
            label={'剩余库存'}
            width="md"
            placeholder={'请输入剩余库存'}
            rules={[
              {
                required: true,
                message: '请输入剩余库存',
              },
            ]}
          />
           <ProFormText
              name="used"
              label={'使用中'}
              placeholder={'请输入使用中'}
              rules={[
                {
                  required: true,
                  message: '请输入使用中',
                },
              ]}
            />
             <ProFormText
              name="diposed"
              label={'已报废'}
              placeholder={'请输入已报废'}
              rules={[
                {
                  required: true,
                  message: '请输入已报废',
                },
              ]}
            />
          </ModalForm>
        )}
      </Access>
    </PageContainer>
  );
};
export default RbacTypeList;
