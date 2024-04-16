import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Space, Switch, Form, Popconfirm, Table, Card } from 'antd';
import type { TableListItem } from './data';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import { addPartsrecord, deletePartsrecord, querypartsrecord, updatePartsrecord } from './service';
import { queryMan } from '@/pages/userListForEnAdmin/manufacturersList/service';
import { querySup } from '@/pages/userListForEnAdmin/supList/service';
import { queryparts } from '../partslist/service';
import { querypartsprofile } from '../partsprofile/service';


const RbacTypeList: React.FC = () => {
  const [sup, setSup] = useState<any>();
  const [man, setMan] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [action, setAction] = useState('replace');
  const [belongto, setBelongto] = useState<any>();
  const handleValuesChange = (changedValues: { action: any; }) => {
    const { action } = changedValues;
    if (action) {
      setAction(action);
    }
  };
  async function handleDeleteUser(id: number) {
    console.log({ id });
    const response = await deletePartsrecord(id);
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
    { value: 'clean', label: '清洁' },
    { value: 'lubricate', label: '润滑' },
    { value: 'inspect', label: '检查' },
    { value: 'adjust', label: '调整' },
    { value: 'replace', label: '更换' },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '维保记录ID',
      dataIndex: 'record_id',
    },
    {
      title: '操作零件ID',
      dataIndex: 'part_id',
    },
    {
      title: '操作',
      dataIndex: 'action',
      valueType: 'select',
    valueEnum: options.reduce((acc, { value, label }) => {
      acc[value] = { text: label };
      return acc;
    }, {}),
      render: (text) => {
        switch (text) {
          case 'clean':
            return '清洁';
          case 'lubricate':
            return '润滑';
          case 'inspect':
            return '检查';
          case 'adjust':
            return '调整';
          case 'replace':
            return '更换';
          default:
            return text;
        }
      },
    },
    {
      title: '操作内容',
      dataIndex: 'extrainfo',
      search: false,
    },
    {
      title: '更换的零件ID',
      dataIndex: 'replace_part',
      render: (text) => {
        return text === 0 ? '-' : text;
      },
    },
    {
      title: '创建时间',
      search: false,
      hideInForm: true,
      dataIndex: 'created_at',
    },
    {
      title: '更新时间',
      search: false,
      hideInForm: true,
      dataIndex: 'updated_at',
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
            const response = await querypartsrecord({ ...params, belongto: rsp.data?.belongto });
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
            onValuesChange={handleValuesChange}
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
              const response = await addPartsrecord(value as TableListItem);
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
              name="record_id"
              label={'维保记录'}
              placeholder={'请输入维保记录'}
              rules={[
                {
                  required: true,
                  message: '请输入维保记录',
                },
              ]}
            />
            <ProFormText
              name="part_id"
              label={'操作零件'}
              placeholder={'请选择操作的零件'}
              rules={[
                {
                  required: true,
                  message: '请输入操作的零件',
                },
              ]}
              request={async () => {
                const response = await querypartsprofile({
                  belongto: belongto,
                });
                console.log({ response });
                return response.data!.list!.map((item: { name: any; id: any }) => ({
                  label: item.name,
                  value: item.id,
                }));
              }}
            />
            <ProFormSelect
  name="action"
  label="操作"
  width="xs"
  placeholder="请选择操作"
  rules={[
    {
      required: true,
      message: '请选择操作',
    },
  ]}
  options={options}
/>
{action === 'replace' && (
        <ProFormText
          name="replace_part"
          label="更换的零件"
          width="md"
          placeholder="请输入更换的零件"
          rules={[
            {
              required: true,
              message: '请输入更换的零件',
            },
          ]}
          request={async () => {
            const response = await querypartsprofile({
              belongto: belongto,
            });
            console.log({ response });
            return response.data!.list!.map((item: { name: any; id: any }) => ({
              label: item.name,
              value: item.id,
            }));
          }}
        />
      )}
           <ProFormText
            name={'extrainfo'}
            label={'详细操作内容'}
            width="md"
            placeholder={'请输入详细操作内容'}
            rules={[
              {
                required: true,
                message: '请输入详细操作内容',
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
            onValuesChange={handleValuesChange}
            onVisibleChange={handleUpdateModalVisible}
            modalProps={{
              centered: true,
            }}
            onFinish={async (value: TableListItem) => {
              const payload: TableListItem = {
                id: value.id,
                ...value,
              };
              const response = await updatePartsrecord(payload);
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
              name="record_id"
              label={'维保记录'}
              placeholder={'请输入维保记录'}
              rules={[
                {
                  required: true,
                  message: '请输入维保记录',
                },
              ]}
            />
            <ProFormText
              name="part_id"
              label={'操作零件'}
              placeholder={'请选择操作的零件'}
              rules={[
                {
                  required: true,
                  message: '请输入操作的零件',
                },
              ]}
              request={async () => {
                const response = await querypartsprofile({
                  belongto: belongto,
                });
                console.log({ response });
                return response.data!.list!.map((item: { name: any; id: any }) => ({
                  label: item.name,
                  value: item.id,
                }));
              }}
            />
          <ProFormSelect
  name="action"
  label="操作"
  width="xs"
  placeholder="请选择操作"
  rules={[
    {
      required: true,
      message: '请选择操作',
    },
  ]}
  options={options}

/>
{action === 'replace' && (
        <ProFormText
          name="replace_part"
          label="更换的零件"
          width="md"
          placeholder="请输入更换的零件"
          rules={[
            {
              required: true,
              message: '请输入更换的零件',
            },
          ]}
          request={async () => {
            const response = await querypartsprofile({
              belongto: belongto,
            });
            console.log({ response });
            return response.data!.list!.map((item: { name: any; id: any }) => ({
              label: item.name,
              value: item.id,
            }));
          }}
        />
      )}
           <ProFormText
            name={'extrainfo'}
            label={'详细操作内容'}
            width="md"
            placeholder={'请输入详细操作内容'}
            rules={[
              {
                required: true,
                message: '请输入详细操作内容',
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
