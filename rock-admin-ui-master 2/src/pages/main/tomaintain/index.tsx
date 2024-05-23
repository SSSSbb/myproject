import React, { useEffect, useRef, useState } from 'react';
import { ModalForm, ProForm, ProFormText, ProList } from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { currentUser } from '@/services/api';
import { queryProfile } from '@/pages/profile/service';
import { queryMaintain } from '@/pages/basic/maintain/service';
import moment from 'moment';
import { Spin, message } from 'antd'; // Import the Spin component from Ant Design
import { addTodo } from '@/pages/todo/service';
import { queryUser } from '@/pages/rbac/user/service';

const MyComponent = () => {
  const [belongto, setBelongto] = useState<any>();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const action = useRef<ActionType>();
  const [maintain, setMaintain] = useState<any>([]);
  const [form] = ProForm.useForm<any>();
  const [ModalVisible, handleModalVisible] = useState<boolean>(false);
  const [username, setUsername] = useState<any>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await currentUser();
        console.log({ user });
        setBelongto(user.data?.belongto);
        setUsername(user.data?.username);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMaintain = async () => {
      try {
        const maintainResponse = await queryMaintain({ belongto: belongto });
        const maintainList = maintainResponse.data?.list;
        const maintainMap = maintainList.reduce((acc, item) => {
          acc[item.name] = item.days;
          return acc;
        }, {});
        console.log({ maintainMap });
        setMaintain(maintainMap);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchMaintain();
  }, [belongto]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await queryProfile({ belongto });
        console.log({ response });
        const filteredData = response.data?.list.filter(item => {
          const maintainType = item.maintaintype;
          const lastMaintain = item.last_maintain;

          if (maintain[maintainType]) {
            const nextMaintainDate = moment(lastMaintain).add(maintain[maintainType], 'days');
            return moment().isAfter(nextMaintainDate);
          }

          return false;
        });

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false); 
      }
    };

    if (Object.keys(maintain).length > 0) { 
      fetchData();
    }
  }, [maintain]);
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="检测中..." style={{ fontSize: '24px' }} /> 
      </div>
    ); 
  }


  return (
    <div>
    <ProList<any>
      rowKey="id"
      actionRef={action}
      dataSource={data}
      editable={{}}
      metas={{
        title: {
          dataIndex: 'name',
          valueType: 'select',
          fieldProps: {
            showSearch: true,
            placement: 'bottomRight',
            options: [
              {
                label: '实验名称1',
                value: '实验名称1',
              },
            ],
          },
        },
        description: {
          dataIndex: 'location',
        },
        content: {
          dataIndex: 'maintaintype',
          render: (text, row) => (
            <div key={row.id} style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <div>状态</div>
                <div><span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'red', // 修改为红色
                          marginInlineEnd: 8,
                        }}
                      />
                      待维保</div>
              </div>
              <div>
                <div>保养等级与频次</div>
                <div>{row.maintaintype}</div>
              </div>
              <div>
                <div>上次维保时间</div>
                <div>{row.last_maintain}</div>
              </div>
             
            </div>
          ),
        },
        
        actions: {
          render: (text, row) => [
            <a key="view"
            onClick={()=>{
              console.log({row});
                form.setFieldsValue(row);
                handleModalVisible(true)
              }
              }
            >
              通知维保员
            </a>,
          ],
        },
      }}
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
                username: value.username,
                which: value.id,
                belongto: belongto,
                createby: username,
                content: "电梯已到维保时间，"+username + "提醒您按时维保",
                status: 0,
              });
              const { code, msg } = response;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success("发送成功");
              handleModalVisible(false);
            }}
          >
            <ProFormText name={'id'} label={'ID'} hidden />
            <ProFormText name={'belongto'} label={'belongto'} hidden />
            <ProFormText
              name="username"
              label={'维保员'}
              placeholder={'请选择维保员'}
              rules={[
                {
                  required: true,
                  message: '请选择维保员',
                },
              ]}
              request={async () => {
                const response = await queryUser({
                  belongto: belongto,
                });
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

export default MyComponent;
