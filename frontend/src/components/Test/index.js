import React, { useState, useEffect } from "react";
import { Skeleton, Row, Col, Card, Avatar } from 'antd';
import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import { axiosClient } from "../../apiClient";

import nema_png from "../../static/images/nema.png"

const { Meta } = Card;

export default function Test() {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var source = new EventSource(`${axiosClient.defaults.baseURL}/listen`);
    source.onmessage = (msg) => {
      let message = msg.data.replace(/'/g, '"');
      message = JSON.parse(message)
      setData(message)
    }
  }, [])

  useEffect(() => {
    if (data != null) {
      var cards_array = Object.entries(data).map((content, key) => {
        let pv = content[0]
        let pv_desc = content[1].desc
        let pv_value = content[1].value
        let pv_type = content[1].type
        return (
          <Col key={`col-${key}`}>
            <Card
              style={{ width: 250, marginTop: 16 }}
              actions={[
                <SettingOutlined key={`setting-${key}`} />,
                <EditOutlined key={`edit-${key}`} />,
                <EllipsisOutlined key={`elip-${key}`} />,
              ]}
            >
              <Meta
                avatar={<Avatar src={
                  (pv_type === "motor") ? nema_png : "https://joeschmoe.io/api/v1/random"
                } />}
                title={pv_desc} key={`card-${key}`}
                description={
                  <>
                    <p><strong>PV Name: </strong>{pv}</p>
                    <p><strong>RBV: </strong>{(pv_type === "motor") ? pv_value.toFixed(2) : pv_value}</p>
                  </>
                }
              />
            </Card>
          </Col>
        )
      })
      setCards(cards_array)
      setLoading(false)
    }
  }, [data])

  return (
    <>
      {
        loading === true ?
          <Skeleton style={{ marginTop: "60px" }} tip="Loading" size="large">
            {/* <div className="content" /> */}
          </Skeleton>
          :
          <>
            <div className="site-card-wrapper">
              <Row align="middle" gutter={16}>
                {cards}
              </Row>
            </div>
          </>
      }
    </>
  );
};