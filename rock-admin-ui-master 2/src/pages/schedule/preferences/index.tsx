import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Space, Switch, Form, Popconfirm, Table, Card } from 'antd';
import type { TableListItem } from './data';
import ProForm, {  ModalForm, ProFormDateTimePicker, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import {  addPreferences, deletePreferences, generate, queryPreferences, updatePreferences } from './service';
import { queryUser } from '@/pages/rbac/user/service';
import { querySchedule } from '../schedulelist/service';

import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';

const RbacTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [belongto, setBelongto] = useState<any>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  async function handleDeleteUser(id: number) {
    console.log({ id });
    const response = await deletePreferences(id);
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
  async function handleGenerate(belongto: number) {
    console.log({ belongto });
    const response2 = await querySchedule({ belongto: belongto });
    
    // 判断是否已经存在本周的数据
    if (isCurrentWeekDataExist(response2)) {
      message.warning("本周已生成过排班表");
      return;
    }
    
    const response = await generate(belongto);
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
  
  // 判断是否存在本周的数据
  function isCurrentWeekDataExist(response: any) {
    // 获取当前日期
    const currentDate = moment();
    
    // 遍历响应数据，检查每条数据的 create_time 是否属于本周
    for (const item of response.data) {
      const createTime = moment(item.create_time);
      if (createTime.isoWeek() === currentDate.isoWeek() && createTime.year() === currentDate.year()) {
        return true;
      }
    }
    
    return false;
  }
  

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      search:false,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      search:false,
    },
    {
      title: '用户 ID',
      dataIndex: 'userid',
      hideInTable: true,
      search:false,
    },
    {
      title: '每周不工作日',
      dataIndex: 'no_work_day',
      search:false,
      render: (text) => {
        switch (text) {
          case 1:
            return '星期一';
          case 2:
            return '星期二';
            case 3:
            return '星期三';
            case 4:
              return '星期四';
              case 5:
                return '星期五';
                case 6:
                  return '星期六';
                  case 7:
            return '星期日';
          default:
            return text;
        }
      },
    },
    {
      title: '每周最少工时',
      dataIndex: 'no_more_than_time',
      search:false,
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
          search={false}
          columns={columns}
          toolBarRender={() => [
              <Button type="ghost" onClick={() =>{handleGenerate(belongto)}}>
                 生成排班表
              </Button>,
               <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
               <PlusOutlined /> 新建
             </Button>
          ]}
          request={async (params = {}) => {
            const rsp = await queryCurrentUser();
          const belongto = rsp.data?.belongto;
          setBelongto(belongto);
            const response = await queryPreferences({ ...params, belongto: rsp.data?.belongto });
            console.log({ response });
            const res2 = await queryUser({...params,belongto:rsp.data?.belongto});
            console.log({res2});
            const userIdToUsernameMap = {};
res2.data.list.forEach(user => {
    userIdToUsernameMap[user.id] = user.username;
});

// 向响应数据中添加用户名
response.data.list.forEach(item => {
    item.username = userIdToUsernameMap[item.userid];
});
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
          isKeyPressSubmit={true}
          visible={createModalVisible}
          onVisibleChange={handleCreateModalVisible}
          modalProps={{
            centered: true,
          }}
          onFinish={async (value) => {
           value.belongto = belongto;
            console.log({ value });
            const response = await addPreferences(value as TableListItem);
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
            name={'userid'}
            label={'员工'}
            width="md"
            placeholder={'请选择员工'}
            rules={[
              {
                required: true,
                message: '请选择员工',
              },
            ]}
            request={async () => {
              const response = await await queryUser({
                belongto: belongto,
              });
              console.log({ response });
              return response.data!.list!.map((item: { username: any; id: any }) => {
                return {
                  label: item.username,
                  value: item.id,
                };
              });
            }}
          />
          <ProFormText
            name={'no_more_than_time'}
            label={'一周最多工时'}
            width="md"
            placeholder={'请输入一周最多工时'}
            rules={[
              {
                required: true,
                message: '请输入一周最多工时',
              },
            ]}
          />
          <ProFormSelect
  name="no_work_day"
  label={'周几休息'}
  placeholder={'请选择周几休息'}
  rules={[
    {
      required: true,
      message: '请选择周几休息',
    },
  ]}
  options={[
    { label: '星期一', value: '1' },
    { label: '星期二', value: '2' },
    { label: '星期三', value: '3' },
    { label: '星期四', value: '4' },
    { label: '星期五', value: '5' },
    { label: '星期六', value: '6' },
    { label: '星期日', value: '7' },
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
              const response = await updatePreferences(payload);
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
            <ProFormSelect
  name="no_work_day"
  label={'周几休息'}
  placeholder={'请选择周几休息'}
  rules={[
    {
      required: true,
      message: '请选择周几休息',
    },
  ]}
  options={[
    { label: '星期一', value: '1' },
    { label: '星期二', value: '2' },
    { label: '星期三', value: '3' },
    { label: '星期四', value: '4' },
    { label: '星期五', value: '5' },
    { label: '星期六', value: '6' },
    { label: '星期日', value: '7' },
  ]}
/>

            <ProFormText
              name="no_more_than_time"
              label={'一周最多工时'}
              placeholder={'请输入一周最多工时'}
              rules={[
                {
                  required: true,
                  message: '请输入一周最多工时',
                },
                {
                  validator: async (_, value) => {
                    if (value === '0') {
                      throw new Error('工时不能为0');
                    }
                  },
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
