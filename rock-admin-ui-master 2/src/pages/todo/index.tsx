import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Space, Switch, Form, Popconfirm, Table, Card } from 'antd';
import type { TableListItem } from './data';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, {  ModalForm, ProFormDateTimePicker, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import {  addTodo, deleteTodo, queryTodo, updateTodo } from './service';
import { queryUser } from '../userListForEnAdmin/user/service';
import { queryProfile } from '../profile/service';


const RbacTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [belongto, setBelongto] = useState<any>();
  async function handleDeleteUser(id: number) {
    console.log({ id });
    const response = await deleteTodo(id);
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
  const options = [
    { value: 0, label: '待完成' },
    { value: 1, label: '已完成' },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      search:false,
    },
    {
      title: '负责人',
      dataIndex: 'username',
    },
    {
      title: '操作电梯',
      dataIndex: 'which',
    },
    {
      title: '工作内容',
      dataIndex: 'content',
      search:false,
    },
    {
      title: '待办状态',
      dataIndex: 'status',
      valueEnum: options.reduce((acc, { value, label }) => {
        acc[value] = { text: label };
        return acc;
      }, {}),
      render: (text) => {
        switch (text) {
          case 1:
            return '已完成';
          case 0:
            return '待完成';
          default:
            return text;
        }
      },
    },
    {
      title: '创建人',
      dataIndex: 'createby',
    },
    {
      title: '创建时间',
      search: false,
      hideInForm: true,
      dataIndex: 'created_at',
    },
    {
      title: '完成时间',
      search: false,
      hideInForm: true,
      dataIndex: 'finish_at',
    },
    {
      title: '操作',
      hideInForm: true,
      search: false,
      render: (_, record) => {
        return (
          <Space>
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
              <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
                <PlusOutlined /> 新建
              </Button>
          ]}
          request={async (params = {}) => {
            const rsp = await queryCurrentUser();
          const belongto = rsp.data?.belongto;
          setBelongto(belongto);
            const response = await queryTodo({ ...params, belongto: rsp.data?.belongto });
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
              value.createby = rsp.data?.username;
              value.status = 0;
              const response = await addTodo(value as TableListItem);
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
              name="username"
              label={'负责人'}
              placeholder={'请输入负责人'}
              rules={[
                {
                  required: true,
                  message: '请输入负责人',
                },
              ]}
              request={async () => {
                const response = await queryUser({
                  belongto: belongto,
                });
                console.log({ response });
                return response.data!.list!.map((item) => ({
                  label: item.username,
                  value: item.username,
                }));
              }}
            />
            <ProFormText
              name="which"
              label={'操作电梯'}
              placeholder={'请选择操作电梯'}
              rules={[
                {
                  required: true,
                  message: '请选择操作电梯',
                },
              ]}
              request={async () => {
                const response = await queryProfile({
                  belongto: belongto,
                });
                console.log({ response });
                return response.data!.list!.map((item: { name: any; id: any }) => ({
                  label: item.name,
                  value: item.id,
                }));
              }}
            />
            <ProFormTextArea
              name="content"
              label={'工作内容'}
              placeholder={'请输入工作内容'}
              rules={[
                {
                  required: true,
                  message: '请输入工作内容',
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
              const response = await updateTodo(payload);
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
            <ProFormTextArea
              name="content"
              label={'工作内容'}
              placeholder={'请输入工作内容'}
              rules={[
                {
                  required: true,
                  message: '请输入工作内容',
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
