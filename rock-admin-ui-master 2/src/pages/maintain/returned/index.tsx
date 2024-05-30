import { ActionType, ModalForm, PageContainer, ProColumns, ProForm, ProFormText, ProFormTextArea, ProList, ProTable } from '@ant-design/pro-components';
import { Button, Card, Progress, Space, Table, Tag, message } from 'antd';
import type { Key } from 'react';
import { useState, useEffect, useRef } from 'react';
import { queryMaintainRecord, updateMaintainRecord } from '../record/service';
import { currentUser } from '@/services/api';
import { queryProfile } from '@/pages/profile/service';
import { addTodo } from '@/pages/todo/service';
import { queryUser } from '@/pages/rbac/user/service';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [belongto, setBelongto] = useState<any>();
  const [recordid, setRecordid] = useState<any>();
  const [eid, setEid] = useState<any>();
  const [username, setUsername] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [form] = ProForm.useForm<any>();

  const columns_elv: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '运行状态',
      dataIndex: 'status',
    },
    
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title: '电梯类型',
      dataIndex: 'type',
      search: false,
    },
    {
      title: '安装地点',
      dataIndex: 'location',
    },
    {
      title: '设备代码',
      dataIndex: 'device_code',
    },
  ];
  const fetchData = async () => {
    try {     
      const response = await queryMaintainRecord({returned:2,belongto:belongto});
      console.log({response});
      const newData = response.data.list.map(item => ({
        title: '维保员： '+item.maintainer,
        subTitle: (
          <Space size={0}>
            <Tag color="blue">维保单</Tag>
            <Tag color="#f50">被退回</Tag>
          </Space>
        ),
        description: (
          <div>
          <Table
            columns={[
              { title: '处理的安全员', dataIndex: 'safer', key: 'safer' },
              { title: '退回理由', dataIndex: 'reason', key: 'reason' },
              { title: '操作', dataIndex: 'action', key: 'action' },
              { title: '具体操作', dataIndex: 'project', key: 'project' },
            ]}
            dataSource={[item]}
            pagination={false}
          />
          <Card title="操作对象电梯">
                <ProTable    
                  options={false}
                  pagination={false}
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  columns={columns_elv}
                  request={async (params = {}) => {
                    const response = await queryProfile({ ...params, id: item.eid, belongto: belongto });
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
          </div>
          
        ),        
        actions: <a key="invite" onClick={() => {
          form.setFieldsValue(item);
          setRecordid(item.id);
          setEid(item.eid);
          handleCreateModalVisible(true);}} >通知维保员</a>,
      }));
      setDataSource(newData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  
  useEffect(() => {
if(belongto){
  fetchData(); 
}
  }, [belongto]); 
  useEffect(() => {
    fetchUser();
  }, []); 
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
  
  return (
    <PageContainer>
    <ProList<{ title: string }>
      rowKey="id"
      headerTitle="被安全员退回的保单"
      toolBarRender={() => {
        return [
        
        ];
      }}
      expandable={{ expandedRowKeys, onExpandedRowsChange: setExpandedRowKeys }}
      dataSource={dataSource}
      metas={{
        title: {},
        subTitle: {},
        description: {},
        avatar: {},
        content: {},
        actions: {},
      }}
    />
    {createModalVisible && (
      <ModalForm
        title="处理被退回保单"
        width="450px"
        visible={createModalVisible}
        isKeyPressSubmit={true}
        onVisibleChange={handleCreateModalVisible}
        modalProps={{
          centered: true,
        }}
        onFinish={async (value) => {  
          console.log({value});  
          const userresponse = await queryUser({username:value.username});
              console.log({userresponse});

              if(userresponse.data.list[0].role.id!=3){
                message.error("角色选择错误，请选择维保员");
                return;
              }      
          const response = await addTodo({status:0,which:eid,username:value.username,content:value.content,createby:username,belongto:belongto});
          const r2 = await updateMaintainRecord({id:recordid,returned:3})
          const { code, msg } = response;
          if (code !== 200) {
            message.error(msg);
            return;
          }
          message.success("通知成功");
          handleCreateModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      >
        
        <ProFormText
          name="eid"
          hidden
        />
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
      </PageContainer>

  );

};
