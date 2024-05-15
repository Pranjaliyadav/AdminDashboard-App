import { Col, Row } from "antd"

export const Home = () => {
  return (
    <div>
      <Row
        gutter={[32, 32]}
        style={{ margin: '32px' }}
      >

        <Col
          xs={24}  //total number of columns per row for diff screens
          sm={24}
          xl={8}
          style={{ height: '460px' }}
        >
          CalenderUpcomingEvents
        </Col>
        <Col
          xs={24}  //total number of columns per row for diff screens
          sm={24}
          xl={8}
          style={{ height: '460px' }}
        >
          DashboardDealsChart
        </Col>
      </Row>

    </div>
  )
}
