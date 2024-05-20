import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem } from './data';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import { querySchedule, updateSchedule } from './service';
import { queryUser } from '@/pages/rbac/user/service';
import type { DatePickerProps } from 'antd';
import { DatePicker, message } from 'antd';
import { PlusOutlined, ZoomInOutlined } from '@ant-design/icons';

import moment from 'moment';
import { querySlot } from '../slot/service';

const RbacTypeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [startOfWeek, setStartOfWeek] = useState<any>();
  const [endOfWeek, setEndOfWeek] = useState<any>();
  const [belongto, setBelongto] = useState<any>();
  const [scheduleData, setScheduleData] = useState<any>();
  const [cellData, setCellData] = useState<any>({});

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    const startOfWeek = date.clone().startOf('isoWeek'); 
    const endOfWeek = date.clone().endOf('isoWeek'); 
    setStartOfWeek(startOfWeek.format('YYYY-MM-DD'));
    setEndOfWeek(endOfWeek.format('YYYY-MM-DD'));
    actionRef.current.reload();
  };

  const generateColumns = () => {
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const columns = [
      {
        title: '时段',
        dataIndex: 'slot',
        key: 'slot',
      },
    ];
    weekdays.forEach((weekday, index) => {
      columns.push({
        title: weekday,
        dataIndex: `weekday${index}`,
        key: `weekday${index}`,
        render: (text, record) => record[`weekday${index}`]?.username || '',
        onCell: (record, rowIndex) => ({
          onClick: () => {
            const item = record[`weekday${index}`];
            console.log({item});
            if (item) {
              form.setFieldsValue(item);
              setUpdateModalVisible(true);
            }
          },
        }),
      });
    });
    return columns;
  };

  const generateData = async (scheduleData) => {
    const data = [];
    const slotdata = await querySlot({ belongto: belongto });
    const slotsMap = {};
    slotdata.data.list.forEach((item) => {
      slotsMap[item.code] = item.slot;
    });
    const slots = [0, 1, 2, 3, 4];
    slots.forEach((slot) => {
      const rowData = {
        key: `slot${slot}`,
        slot: slotsMap[slot],
      };
      for (let i = 0; i < 7; i++) {
        const item = scheduleData.find((item) => item.weekday === i && item.slot === slot);
        rowData[`weekday${i}`] = item ? { id: item.id, userid:item.userid ,username: item.username } : null;
      }
      data.push(rowData);
    });
    setScheduleData(data);
  };

  const columns = generateColumns();

  return (
    <PageContainer>
      <Access accessible={access.basicTypeIndex!}>
        <div>
          <div>
            <DatePicker onChange={onChange} picker="week" />
          </div>
          <ProTable
            actionRef={actionRef}
            rowKey="id"
            search={false}
            dataSource={scheduleData}
            columns={columns}
            pagination={false}
            request={async (params = {}) => {
              const rsp = await queryCurrentUser();
              const belongto = rsp.data?.belongto;
              setBelongto(belongto);
              const response = await querySchedule({ ...params, belongto: rsp.data?.belongto });
              const res2 = await queryUser({ ...params, belongto: rsp.data?.belongto });
              const userIdToUsernameMap = {};
              res2.data.list.forEach(user => {
                userIdToUsernameMap[user.id] = user.username;
              });

              response.data.forEach(item => {
                item.username = userIdToUsernameMap[item.userid];
              });
              const filteredData = response.data.filter(item => {
                const createTime = moment(item.create_time);
                return createTime.isBetween(startOfWeek, endOfWeek);
              });
              generateData(filteredData);
            }}
          />
          {updateModalVisible && (
            <ModalForm<TableListItem>
              title="编辑"
              width="450px"
              form={form}
              visible={updateModalVisible}
              onVisibleChange={setUpdateModalVisible}
              modalProps={{
                centered: true,
              }}
              // initialValues={cellData}
              onFinish={async (value: TableListItem) => {
                console.log(value);
                const response = await updateSchedule({id:value.id,userid:value.username});
              const { code, msg } = response;
              if (code !== 200) {
                message.error(msg);
                return;
              }
              message.success(msg);
              setUpdateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
              }}
            >
              <ProFormText name={'id'} label={'ID'} hidden />
              <ProFormText name={'username'} label={'用户名'} 
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
            </ModalForm>
          )}
        </div>
      </Access>
    </PageContainer>
  );
};

export default RbacTypeList;
