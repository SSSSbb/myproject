import React, { useEffect, useRef, useState } from 'react';
import {
  ProFormSwitch,
  ProList,
} from '@ant-design/pro-components';
import { currentUser } from '@/services/api';
import { Progress, Tag, message } from 'antd';
import { queryMaintainRecord, queryCurrentUser } from '../record/service';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { addTodo } from '@/pages/todo/service';
import { ActionType } from '@ant-design/pro-table';
import { queryUser } from '@/pages/rbac/user/service';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<any>();
  const [belongto, setBelongto] = useState<any>();
  const [data, setData] = useState<any>([]); 
  const [username, setUsername] = useState<any>();
  const [ghost, setGhost] = useState<boolean>(false);
  const [ModalVisible, handleModalVisible] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      // 发起数据请求
      const user = await currentUser(); // 等待异步请求完成
      setBelongto(user.data.belongto);
      setUsername(user.data?.username);
      console.log({user});
      
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
  const fetchData = async () => {
    try {     
      const response = await queryMaintainRecord({belongto: belongto ,safer:'0'});
      console.log({response});
      const processedData = response.data?.list.map((item) => ({
        title: item.action === 'repair' ? '维修' : item.action === 'maintain' ? '保养' : item.action,
        subTitle: <Tag color="#f50">待安全员确认</Tag>, // 固定子标题
      
        actions: [<a key="run"  onClick={()=>{
          form.setFieldsValue(item);
          handleModalVisible(true)}} >通知安全员</a>], // 固定操作
        avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        content: (
          <div style={{ flex: 1 }}>
            <div style={{ width: 300 }}>
            <div>创建人：{item.maintainer}</div>
            <div>创建时间：{item.created_at}</div>
            <div>工作内容：{item.project}</div>
              <Progress percent={80} />
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
      <ProFormSwitch
        label="幽灵模式"
        fieldProps={{
          checked: ghost,
          onChange: (e) => setGhost(e),
        }}
      />
      <ProList<any>
        ghost={ghost}
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
        headerTitle="维保进程管理"
        dataSource={data}
      />
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
