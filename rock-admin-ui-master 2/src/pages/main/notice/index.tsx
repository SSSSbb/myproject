import React, { useEffect, useRef, useState } from 'react';
import {
  ActionType,
  ProFormSwitch,
  ProList,
} from '@ant-design/pro-components';
import { currentUser } from '@/services/api';
import { Button, Progress, Tag, message } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { addTodo } from '@/pages/todo/service';
import { queryUser } from '@/pages/rbac/user/service';
import { addNotice, deleteNotice, queryNotice, updateNotice } from './service';
import { PlusOutlined } from '@ant-design/icons';
import { TableListItem } from './data';

export default () => {
  const action = useRef<ActionType>();
  const [form] = ProForm.useForm<any>();
  const [status, setStatus] = useState<any>();
  const [belongto, setBelongto] = useState<any>();
  const [data, setData] = useState<any>([]); 
  const [username, setUsername] = useState<any>();
  const [ghost, setGhost] = useState<boolean>(false);
  const [ModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const user = await currentUser();
      setBelongto(user.data.belongto);
      setUsername(user.data?.username);
      
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); 

  useEffect(() => {
    fetchData(); 
  }, [belongto]);
  
  async function handleDeleteNotice(id: number) {
    const response = await deleteNotice(id);
    const { code, msg } = response;
    if (code !== 200) {
      message.error(msg);
      return;
    }
    message.success(msg);
    if (action.current) {
      action.current?.reload();
    }
  }
  async function handleSendNotice(id: number,status:number) {
    console.log({ id });
    const response = await updateNotice({id:id,status:status});
    const { code, msg } = response;
    if (code !== 200) {
      message.error(msg);
      return;
    }
    message.success("已发送");
    if (action.current) {
      action.current?.reload();
    }
  }
  const fetchData = async () => {
    try {     
      const response = await queryNotice({belongto: belongto});
      console.log({response});
      const processedData = response.data?.list.map((item) => ({
        title: (
          <Tag color={item.status === 1 ? "#f50" : "#5BD8A6"}>
            {item.status === 1 ? "已发送" : "未发送"}
          </Tag>
        ),
        subTitle: <Tag color="#5BD8A6">公告</Tag>, 
        actions: [
          item.status !== 1 && (
            <a onClick={() => { handleSendNotice(item.id, 1) }}>
              发送
            </a>
          ),
          <a onClick={() => { handleDeleteNotice(item.id) }}>
            删除
          </a>
        ],         // 固定操作
        avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        content: (
          <div style={{ flex: 1 }}>
            <div style={{ width: 300 }}>
            <div>创建人：{item.createby}</div>
            <div>创建时间：{item.created_at}</div>
            <div>内容：{item.content}</div>
            </div>
          </div>
        ), // 固定内容
      }));
      setData(processedData); // 更新 data 状态
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#eee',
        margin: -24,
        padding: 24,
      }}
    >
      {/* <ProFormSwitch
        label="已发送/未发送"
        fieldProps={{
          checked: ghost,
          onChange: (e) => setGhost(e),
        }}
      /> */}
      <Button type="primary" onClick={() => handleCreateModalVisible(true)}>
                <PlusOutlined /> 新建公告
              </Button>
      <ProList<any>
        ghost={ghost}
        actionRef={action}
        itemCardProps={{
          ghost,
        }}
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: false,
        }}
        showActions="hover"
        rowSelection={{}}
        grid={{ gutter: 16, column: 2 }}
        onItem={(record: any) => {
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        metas={{
          title: {},
          subTitle: {},
          type: {},
          avatar: {},
          content: {},
          actions: {
            cardActionProps: 'actions',
          },
        }}
        headerTitle="公告管理"
        dataSource={data}
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
              const rsp = await currentUser();
              value.belongto = rsp.data?.belongto;
              value.createby = rsp.data?.username;
              value.status = 0;
              const response = await addNotice(value as TableListItem);
              const { code, msg } = response;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success(msg);
              handleCreateModalVisible(false);
              if (action.current) {
                action.current.reload();
              }
            }}
          >
            
            <ProFormTextArea
              name="content"
              label={'公告内容'}
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
      {ModalVisible && (
          <ModalForm
            title="发送工作"
            width="450px"
            form={form}
            isKeyPressSubmit={true}
            visible={ModalVisible}
            onVisibleChange={handleModalVisible}
            modalProps={{
              centered: true,
            }}
            onFinish={async (value: any) => {
              console.log(value);
              
              const response = await addTodo({
                username:value.username,
                which:value.eid,
                belongto:belongto,
                record:value.id,
                createby:username,
                content:username+"提醒您完成检查",
                status:0,
              });
              const { code, msg } = response;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success("发送成功");
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
                        <ProFormText name={'eid'} label={'EID'} hidden />
            <ProFormText name={'id'} label={'ID'} hidden />
            <ProFormText name={'belongto'} label={'belongto'} hidden />
            <ProFormText
              name="username"
              label={'安全员'}
              placeholder={'请选择安全员'}
              rules={[
                {
                  required: true,
                  message: '请选择安全员',
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
            
          </ModalForm>
        )}
    </div>
  );
};
