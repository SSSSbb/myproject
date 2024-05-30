import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Modal, Space, Switch, Form, Popconfirm, Table, Card, Upload } from 'antd';
import type { TableListItem } from './data';
import { PlusOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormDateTimePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import { addMaintainRecord, deleteMaintainRecord, queryMaintainRecord, updateMaintainRecord } from './service';
import { queryUser } from '@/pages/userListForEnAdmin/user/service';
import { queryProfile } from '@/pages/profile/service';
import { addPartsrecord, deletePartsrecord, querypartsrecord } from '@/pages/parts/record/service';
import type { TableListItem as PartsRecordTableListItem } from 'src/pages/parts/record/data';
import { querypartsprofile } from '@/pages/parts/partsprofile/service';


const RbacTypeList: React.FC = () => {
  const [elv, setElv] = useState<any>();
  const [recordId, setRecordId] = useState<any>();
  const [parts, setParts] = useState<any>();
  const [maintainer, setMaintainer] = useState<any>();
  const [safer, setSafer] = useState<any>();
  const actionRef = useRef<ActionType>();
  const [saferPic, setSaferPic] = useState<any>();
  const [maintainPic, setMaintainPic] = useState<any>();
  const [saferUrl, setSaferUrl] = useState<any>();
  const [picUrl, setPicUrl] = useState<any>();
  const [saferSignUrl, setSaferSignUrl] = useState<any>();

  const [mantainUrl, setMaintainUrl] = useState<any>();
  const [partsRecordCreateModalVisible, handlePartsRecordCreateModalVisible] = useState<boolean>(false);
  const [form] = ProForm.useForm<TableListItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [action, setAction] = useState('');
  const [belongto, setBelongto] = useState<any>();
  const handleValuesChange = (changedValues: { action: any; }) => {
    const { action } = changedValues;
    if (action) {
      setAction(action);
    }
  };
  async function handleDeletePartsRecord(id: number) {
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
  function fileToBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  async function beforeUpload(file: any) {
    const blob1 = await fileToBase64(file);
    const compressionQuality = 0.5;

    const saferPic = await compressImage(blob1, compressionQuality);
    setSaferPic(saferPic);
    setSaferUrl(`data:image/png;base64,${saferPic}`);
  }
  async function beforeUploadEnp(file: any) {
    const blob1 = await fileToBase64(file);
    const compressionQuality = 0.5;

    const maintainPic = await compressImage(blob1, compressionQuality);
    setMaintainPic(maintainPic);
    setMaintainUrl(`data:image/png;base64,${maintainPic}`);
  }
  const compressImage = (base64WithoutPrefix: string, compressionQuality: number) => {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64WithoutPrefix}`;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;

        canvas.width = image.width * 0.5;
        canvas.height = image.height * 0.5;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', compressionQuality);

        const matchResult = compressedBase64.match(/^data:image\/\w+;base64,(.*)$/);

        if (matchResult && matchResult.length === 2) {
          resolve(matchResult[1]);
        } else {
          reject(new Error('Failed to extract image data from base64 string.'));
        }
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  };
  async function handleDeleteUser(id: number) {
    console.log({ id });
    const response = await deleteMaintainRecord(id);
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
    { value: 'maintain', label: '保养' },
    { value: 'repair', label: '维修' },
  ];
  
  const returned = [
    { value: 1, label: '合格' },
    { value: 2, label: '已退回未处理' },
    { value: 3, label: '已退回已处理' },
    { value: 0, label: '未检查' },
  ];
  
  const options_parts = [
    { value: 'clean', label: '清洁' },
    { value: 'lubricate', label: '润滑' },
    { value: 'inspect', label: '检查' },
    { value: 'adjust', label: '调整' },
    { value: 'replace', label: '更换' },
  ];
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
  const columns_user: ProColumns[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '角色',
      search: false,
      renderText: (text, record) => {
        return record.role?.name;
      },
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
  ];
  const columns_parts: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      search: false,
    },
    {
      title: '操作零件ID',
      dataIndex: 'part_id',
    },
    {
      title: '操作',
      dataIndex: 'action',
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
            <Popconfirm title={'确认删除？'} onConfirm={() => handleDeletePartsRecord(record.id!)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
     
    },
    {
      title: '维保员',
      dataIndex: 'maintainer',
    },
    {
      title: '安全员',
      dataIndex: 'safer',
      render: (safer) => {
        return safer === "0" ? '-' : safer;
      },
    },
    {
      title: '目标电梯id',
      dataIndex: 'eid',
    },
    {
      title: '工作内容',
      dataIndex: 'action',
      valueEnum: options.reduce((acc, { value, label }) => {
        acc[value] = { text: label };
        return acc;
      }, {}),
        render: (text) => {
          switch (text) {
            case 'repair':
              return '维修';
            case 'maintain':
              return '保养';
            default:
              return text;
          }
        },   
    },
    {
      title: '工作内容',
      dataIndex: 'project',
      search:false,
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'returned',
      valueEnum: returned.reduce((acc, { value, label }) => {
        acc[value] = { text: label };
        return acc;
      }, {}),    
      render: (text) => {
        switch (text) {
          case 0:
            return '未检查';
          case 1:
            return '合格';
          case 2:
            return '已退回未处理';
          case 3:
            return '已退回已处理';
          default:
            return text;
        }
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
            <DrawerForm
              title="查看"
              key={'_lookup_form_' + record.id}
              submitter={false}
              trigger={
                <a
                  type="primary"
                  onClick={async () => {
                    console.log({ record });
                    setElv(record.eid);
                    setRecordId(record.id);
                    setParts(record.parts_record);
                    setMaintainer(record.maintainer);
                    setSafer(record.safer);
                    if (record.enp_sign) setMaintainUrl(`data:image/png;base64,${record.enp_sign}`);
                    else setMaintainUrl(null);
                    if (record.safe_sign) setSaferUrl(`data:image/png;base64,${record.safe_sign}`);
                    else setSaferUrl(null);
                    if (record.pic) setPicUrl(`data:image/png;base64,${record.pic}`);
                    else setPicUrl(null);
                    if (record.saferpic) setSaferSignUrl(`data:image/png;base64,${record.saferpic}`);
                    else setSaferSignUrl(null);
                  }}
                >
                  查看
                </a>
              }
              form={form}
              autoFocusFirstInput
            >
              {' '}
              <Card title="维保单详细信息">
              <Table
                  style={{ width: '100%' }}
                  bordered
                  size="small"
                  pagination={false}
                  dataSource={[record]}
                >
                <Table.Column
    title="维保员打卡图片"
    width={200}
    render={() => <img style={{ width: '100%' }} src={picUrl} />}
  />
  <Table.Column
    title="安全员打卡图片"
    width={200}
    render={() => <img style={{ width: '100%' }} src={saferSignUrl} />}
  />
    />                  <Table.Column title="详细操作内容" dataIndex="project" key="project" width={200} />

<Table.Column
    title="状态"
    dataIndex="returned"
    key="returned"
    width={200}
    render={(returned) => {
      let statusText = '';
      switch (returned) {
        case 0:
          statusText = '未检查';
          break;
        case 1:
          statusText = '合格';
          break;
        case 2:
          statusText = '已退回未处理';
          break;
        default:
          statusText = '已退回已处理';
          break;
      }
      return <span>{statusText}</span>;
    }}
  />                  <Table.Column title="退回理由" dataIndex="reason" key="reason" width={200} />

                </Table>
      </Card>                       
              <Card title="操作对象电梯">
                <ProTable    
                  options={false}
                  pagination={false}
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  columns={columns_elv}
                  request={async (params = {}) => {
                    const response = await queryProfile({ ...params, id: elv, belongto: belongto });
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
              <Card title="相关零件更换记录">
                <ProTable
                  options={false}
                  pagination={false}
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  columns={columns_parts}
                  toolBarRender={() => [
                      <Button type="primary" onClick={() => handlePartsRecordCreateModalVisible(true)}>
                        <PlusOutlined /> 新建
                      </Button>
                  ]}
                  request={async (params = {}) => {
                    const response = await querypartsrecord({record_id: recordId, belongto: belongto });
                    console.log({recordId});
                    return {
                      success: response.code === 200,
                      data: response!.data!.list,
                      page: response!.data!.page_num,
                      total: response!.data!.total,
                    };
                  }}
                />
              </Card>
              <Card title="负责人员--维保员">
                <ProTable
                options={false}
                pagination={false}
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  columns={columns_user}
                  request={async (params = {}) => {
                    const response = await queryUser({ ...params, username: maintainer, belongto: belongto });
                    console.log({ response });
                    return {
                      success: response.code === 200,
                      data: response!.data!.list,
                      page: response!.data!.page_num,
                      total: response!.data!.total,
                    };
                  }}
                />
                <img style={{ width: '20%' }} src={mantainUrl ?? ''} />
              </Card>
              <Card title="负责人员--安全员">
                <ProTable
                  options={false}
                  pagination={false}
                  actionRef={actionRef}
                  rowKey="id"
                  search={false}
                  columns={columns_user}
                  request={async (params = {}) => {
                    const response = await queryUser({ ...params, username: safer, belongto: belongto });
                    console.log({ response });
                    return {
                      success: response.code === 200,
                      data: response!.data!.list,
                      page: response!.data!.page_num,
                      total: response!.data!.total,
                    };
                  }}
                />
                <img style={{ width: '20%' }} src={saferUrl ?? ''} />

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
            console.log({params});
            const rsp = await queryCurrentUser();
          const belongto = rsp.data?.belongto;
          setBelongto(belongto);
            const response = await queryMaintainRecord({ ...params, belongto: rsp.data?.belongto });
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
              value.safe_sign = saferPic;
              value.enp_sign = maintainPic;
              const response = await addMaintainRecord(value as TableListItem);
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
              name="eid"
              label={'维保的电梯'}
              placeholder={'请选择维保的电梯'}
              rules={[
                {
                  required: true,
                  message: '请选择维保的电梯',
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
            <ProFormText
              name="maintainer"
              label={'负责的维保员'}
              placeholder={'请选择'}
              rules={[
                {
                  required: true,
                  message: '请选择',
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
              name="safer"
              label={'安全员'}
              placeholder={'请选择安全员'}
              rules={[
                {
                  required: true,
                  message: '请输入安全员',
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
           <ProFormSelect
            name={'action'}
            label={'操作'}
            width="md"
            placeholder={'请选择操作'}
            rules={[
              {
                required: true,
                message: '请选择操作',
              },
            ]}
            options={options}

          />
          <ProFormText
            name={'project'}
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
          <ProForm.Item label="安全员签名" valuePropName="defaultFileList" required>
            <Upload name="safe_sign" listType="picture-card" beforeUpload={beforeUpload}>
              <div>{<PlusOutlined />}</div>
            </Upload>
          </ProForm.Item>
          <ProForm.Item label="维保员签名" valuePropName="defaultFileList" required>
            <Upload name="enp_sign" listType="picture-card" beforeUpload={beforeUploadEnp}>
              <div>{<PlusOutlined />}</div>
            </Upload>
          </ProForm.Item>
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
              const response = await updateMaintainRecord(payload);
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
              name="maintainer"
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
            <ProFormText
              name="safer"
              label={'安全员'}
              placeholder={'请选择安全员'}
              rules={[
                {
                  required: true,
                  message: '请输入安全员',
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
         {partsRecordCreateModalVisible && (
          <ModalForm
            title="添加"
            width="450px"
            visible={partsRecordCreateModalVisible}
            isKeyPressSubmit={true}
            onValuesChange={handleValuesChange}
            onVisibleChange={handlePartsRecordCreateModalVisible}
            modalProps={{
              centered: true,
            }}
            onFinish={async (value) => {
              const rsp = await queryCurrentUser();
              value.buy_at = new Date(value.buy_at);
              value.belongto = rsp.data?.belongto;
              value.record_id = recordId;
              const response = await addPartsrecord(value as PartsRecordTableListItem);
              const { code, msg } = response;
              console.log({response});
              console.log("ssssss");
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success(msg);
              handlePartsRecordCreateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            
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
                  which:elv,
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
  options={options_parts}
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
