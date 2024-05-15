import { queryLocation } from '@/pages/basic/location/service';
import { Map } from 'react-bmapgl';
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Space } from 'antd';
import { Column } from '@ant-design/charts';
import { currentUser as queryCurrentUser } from '@/services/api';
import { queryProfile } from '@/pages/profile/service';
import { Pie } from '@ant-design/plots';
import { currentUser } from '@/services/api';

import { CityListControl, MapvglLayer, MapvglView, Marker } from 'react-bmapgl';
const MyMap = () => {
  // 使用useState钩子来存储markers数据
  const [markers, setMarkers] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const [belongto, setBelongto] = useState<any>();

  function renderStatistic(containerWidth, text, style) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`;
  }

  const fetchUser = async () => {
    try {
      const user = await currentUser();
      setBelongto(user.data.belongto);
      
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await queryCurrentUser();
        const belongTo = response1.data.belongto;
        const response2 = await queryProfile({ belongto: belongTo });
        const data = response2.data.list;

        setLocationData(data);

        const typeCount = {};
        data.forEach((item) => {
          const type = item.type;
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
        const typeChartData = Object.keys(typeCount).map((type) => ({
          type,
          value: typeCount[type],
        }));
        setTypeData(typeChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []); 
  useEffect(() => {
    // 模拟请求数据
    const fetchData = async () => {
      const response = await queryLocation({belongto:belongto})
      const data = response.data?.list;
      console.log({data});
      setMarkers(data);
    };
    fetchData();
  }, []); 

  let mapCenter = { lng: 116.404, lat: 39.915 }; // 默认中心点坐标

  if (markers.length > 0) {
    // 如果markers数组不为空，则将地图中心点设置为第一个标记的位置
    const firstMarker = markers[0];
    mapCenter = { lng: firstMarker.longitude, lat: firstMarker.latitude };
  }
  const locationCount = {};
  locationData.forEach((item) => {
    const location = item.location;
    locationCount[location] = (locationCount[location] || 0) + 1;
  });

  const locationChartData = Object.keys(locationCount).map((location) => ({
    name: location,
    value: locationCount[location],
  }));

  const locationChartConfig = {
    data: locationChartData,
    height: 300,
    xField: 'name',
    yField: 'value',
    columnStyle: {
      fill: '#1890ff',
    },
  };
  console.log({ locationChartData });
  console.log({ typeData });
  const typeChartConfig = {
    appendPadding: 10,
    data: typeData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    height: 300,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v) => `${v} ¥`,
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : '总计';
          return renderStatistic(d, text, {
            fontSize: 28,
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum ? `¥ ${datum.value}` : `¥ ${data.reduce((r, d) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            fontSize: 32,
          });
        },
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };

  return (
    <div>
       <Map 
        style={{height: '400px'}}
        center={mapCenter} // 设置地图中心点为第一个标记的位置
        zoom="11"
        enableScrollWheelZoom
      >
        {
          markers.map((item) => (
            <Marker 
              key={item.id} 
              position={{lng: item.longitude, lat: item.latitude}} 
              title={item.name} // 可选，鼠标悬停时显示的文字
            />
          ))
        }
      </Map>
      <Row gutter={16}>
     
      {/* <Map
        center={{lng:105.403119, lat:38.028658}}
        zoom={4}
        // mapStyleV2={{styleJson: blackstyle}}
      >
        <MapvglView effects={['bright']}>
          <MapvglLayer
            type="PointLayer"
            // data={point}
            options={{
              blend: 'lighter',
              size: 12,
              color: 'rgb(255, 53, 0, 0.6)'
            }}
          />
        </MapvglView>
      </Map> */}
      </Row>
        <Row gutter={16}>
      <Col span={12}>
        <Card title="安装地点" style={{ height: 400 }}>
          <Column {...locationChartConfig} />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="电梯类型" style={{ height: 400 }}>
          <Pie {...typeChartConfig} />
        </Card>
      </Col>
    </Row>
    
    </div>
   
      
  );
}

export default MyMap;
