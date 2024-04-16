import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Space, Popconfirm, Card } from 'antd';
import type { TableListItem } from './data';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import { addPartsProfile, deletePartsProfile, querypartsprofile, updatePartsProfile } from './service';
import { queryMaintain } from '@/pages/basic/maintain/service';
import { queryCondition } from '@/pages/basic/condition/service';
import { queryProfile } from '@/pages/profile/service';
import { queryparts } from '../partslist/service';
import { values } from 'lodash';


const RbacTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [parts, setParts] = useState<any>();
  const [which, setWhich] = useState<any>();
  const [belongto, setBelongto] = useState<any>();
  async function handleDeleteUser(id: number,partsid:number) {
    console.log({ id });
    const response = await deletePartsProfile(id,partsid);
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
  const columns_parts: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '零件名称',
      dataIndex: 'name',
    },
    {
      title: '规格',
      dataIndex: 'spec',
    },
    {
      title: '型号',
      dataIndex: 'model',
    },
    {
      title: '生产商',
      dataIndex: 'man',
    },
    {
      title: '供货商',
      dataIndex: 'sup',
    },
    {
      title: '购买时间',
      search: false,
      hideInForm: true,
      dataIndex: 'buy_at',
    },
    {
      title: '库存',
      dataIndex: 'remain',
    },
    {
      title: '使用中',
      dataIndex: 'used',
    },
  ];
  const columns_which: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '电梯名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '运行状态',
      dataIndex: 'status',
    },
    {
      title: '地点',
      dataIndex: 'location',
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
      title: '零件id',
      dataIndex: 'partsid',
    },
    {
      title: '保养类型',
      dataIndex: 'maintaintype',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '电梯ID',
      dataIndex: 'which',
    },
    {
      title: '上次维修',
      search: false,
      dataIndex: 'last_repair',
    },
    {
      title: '上次保养',
      search: false,
      dataIndex: 'last_maintain',
    },
    {
      title: '创建时间',
      search: false,
      hideInTable: true,
      dataIndex: 'create_at',
    },
    {
      title: '更新时间',
      search: false,
      hideInTable: true,
      dataIndex: 'update_at',
    },
    {
      title: '报废时间',
      search: false,
      hideInForm: true,
      dataIndex: 'diposed_at',
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
                    setParts(record.partsid);
                    setWhich(record.which);
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
                <ProTable
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  pagination={false}
                  columns={columns_parts}
                  request={async (params = {}) => {
                    const response = await queryparts({ ...params, id: parts, belongto: belongto });
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
              <Card title="运行电梯详细信息">
                <ProTable
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  pagination={false}
                  columns={columns_which}
                  request={async (params = {}) => {
                    const response = await queryProfile({ ...params, id: which, belongto: belongto });
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
            <Popconfirm title={'确认删除？'} onConfirm={() => handleDeleteUser(record.id!,record!.partsid)}>
              <a>报废</a>
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
              <Button type="primary" onClick={() => {handleCreateModalVisible(true);
              }}>
                <PlusOutlined /> 新建
              </Button>
            </Access>,
          ]}
          request={async (params = {}) => {
            const rsp = await queryCurrentUser();
          const belongto = rsp.data?.belongto;
          setBelongto(belongto);
            const response = await querypartsprofile({ ...params, belongto: rsp.data?.belongto });
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
              value.belongto = rsp.data?.belongto;
              const response = await addPartsProfile(value as TableListItem);
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
            name={'partsid'}
            label={'选择零件'}
            width="md"
            placeholder={'零件'}
            rules={[
              {
                required: true,
                message: '请选择零件',
              },
            ]}
            request={async () => {
              const response = await await queryparts({
                belongto: belongto,
              });
              console.log({ response });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
            }}
          />
         <ProFormText
            name={'maintaintype'}
            label={'保养类型'}
            width="md"
            placeholder={'请输入保养类型'}
            rules={[
              {
                required: true,
                message: '请输入保养类型',
              },
            ]}
            request={async () => {
              const response = await await queryMaintain({
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
            name={'status'}
            width="md"
            label={'零件状态'}
            placeholder={'请输入零件状态'}
            rules={[
              {
                required: true,
                message: '请输入零件状态',
              },
            ]}
            request={async () => {
              const response = await await queryCondition({
                belongto: belongto,
              });
              console.log({ response });
              return response.data.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.name,
                };
              });
            }}
          />
          <ProFormText
            name={'which'}
            label={'所属电梯'}
            width="md"
            placeholder={'请输入所属电梯'}
            rules={[
              {
                required: true,
                message: '请输入所属电梯',
              },
            ]}
            request={async () => {
              const response = await queryProfile({
                belongto: belongto,
              });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
            }}
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
              value.last_maintain = new Date(value.last_maintain);
              value.last_repair = new Date(value.last_repair);
              value.diposed_at = new Date(value.diposed_at);
              const payload: TableListItem = {
                id: value.id,
                ...value,
              };
              const response = await updatePartsProfile(payload);
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
            name={'maintaintype'}
            label={'保养类型'}
            width="md"
            placeholder={'请输入保养类型'}
            rules={[
              {
                required: true,
                message: '请输入保养类型',
              },
            ]}
            request={async () => {
              const response = await await queryMaintain({
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
            name={'status'}
            width="md"
            label={'电梯状态'}
            placeholder={'请输入电梯状态'}
            rules={[
              {
                required: true,
                message: '请输入电梯状态',
              },
            ]}
            request={async () => {
              const response = await await queryCondition({
                belongto: belongto,
              });
              console.log({ response });
              return response.data.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.name,
                };
              });
            }}
          />
           <ProFormText
            name={'which'}
            label={'所属电梯'}
            width="md"
            placeholder={'请输入所属电梯'}
            rules={[
              {
                required: true,
                message: '请输入所属电梯',
              },
            ]}
            request={async () => {
              const response = await await queryProfile({
                belongto: belongto,
              });
              return response.data!.list!.map((item: { name: any; id: any }) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
            }}
          />
           <ProFormDateTimePicker
            name={'diposed_at'}
            label={'报废时间'}
            width="md"
          />
           <ProFormDateTimePicker
            name={'last_maintain'}
            label={'上次维保'}
            width="md"
            placeholder={'请输入上次维保时间'}
            rules={[
              {
                required: true,
                message: '请输入上次维保时间',
              },
            ]}
          />
           <ProFormDateTimePicker
            name={'last_repair'}
            label={'上次维修'}
            width="md"
            placeholder={'请输入上次维修时间'}
            rules={[
              {
                required: true,
                message: '请输入上次维修时间',
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
