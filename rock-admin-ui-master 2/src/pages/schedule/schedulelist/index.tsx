import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import type { TableListItem } from './data';
import ProForm, {  ModalForm, ProFormDateTimePicker, ProFormItem, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Access, useAccess } from '@@/plugin-access/access';
import { currentUser as queryCurrentUser } from '@/services/api';
import {  querySchedule } from './service';
import { queryUser } from '@/pages/rbac/user/service';
import type { DatePickerProps } from 'antd';
import { Button, DatePicker, Space } from 'antd';
import { PlusOutlined, ZoomInOutlined } from '@ant-design/icons';

import moment from 'moment';

const RbacTypeList: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [form] = ProForm.useForm<TableListItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [selectedWeek, setSelectedWeek] = useState<string>(); 
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const access: API.UserAccessItem = useAccess();
  const [startOfWeek, setStartOfWeek] = useState<any>();
  const [endOfWeek, setEndOfWeek] = useState<any>();
  const [belongto, setBelongto] = useState<any>();
  const [scheduleData, setScheduleData] = useState<any>();
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    const startOfWeek = date.clone().startOf('isoWeek'); 
const endOfWeek = date.clone().endOf('isoWeek'); 
setStartOfWeek(startOfWeek.format('YYYY-MM-DD'));
setEndOfWeek(endOfWeek.format('YYYY-MM-DD'));
actionRef.current.reload();
console.log(startOfWeek.format('YYYY-MM-DD'));
console.log(endOfWeek.format('YYYY-MM-DD'));
  }
  const generateColumns = () => {
    const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const columns = [
      {
        title: '时段',
        dataIndex: 'slot',
        key: 'slot',
      },
    ];
    // 根据星期生成列配置
    weekdays.forEach((weekday, index) => {
      columns.push({
        title: weekday,
        dataIndex: `weekday${index}`,
        key: `weekday${index}`,
      });
    });
    return columns;
  };
  const generateData = (scheduleData) => {
    console.log({scheduleData});
    const data = [];
    const slots = [ 0, 1, 2, 3, 4];
    slots.forEach((slot) => {
      const rowData = {
        key: `slot${slot}`,
        slot: `时段${slot}`,
      };
      // 根据星期填充数据
      for (let i = 0; i < 7; i++) {
        const item = scheduleData.find((item) => item.weekday === i && item.slot === slot);
        rowData[`weekday${i}`] = item ? item.username : ''; // 这里假设要显示的是userid
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
            console.log({ response });
            const res2 = await queryUser({...params,belongto:rsp.data?.belongto});
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
            isKeyPressSubmit={true}
            visible={updateModalVisible}
            onVisibleChange={handleUpdateModalVisible}
            modalProps={{
              centered: true,
            }}
            // onFinish={async (value: TableListItem) => {
            //   const payload: TableListItem = {
            //     id: value.id,
            //     ...value,
            //   };
            //   const response = await updatePrefer(payload);
            //   const { code, msg } = response;
            //   if (code !== 200) {
            //     message.error(msg);
            //     return;
            //   }
            //   message.success(msg);
            //   handleUpdateModalVisible(false);
            //   if (actionRef.current) {
            //     actionRef.current.reload();
            //   }
            // }}
          >
            <ProFormText name={'id'} label={'ID'} hidden />
            <ProFormText name={'belongto'} label={'belongto'} hidden />
          </ModalForm>
        )}
              </div>
      </Access>
    </PageContainer>
  );
};
export default RbacTypeList;
