
import { useState } from "react";
import Banner from "./Banner"
import Test from "./Test"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import img1 from '/images/bannerImages/holiday-perfect-gift.jpg'
import img2 from '/images/bannerImages/mm_branding.png'
import checkNumbersImage from '/images/checkNumbers.jpg'
import lottoTexasImage from '/images/Texas-Lottery-logo.webp'

import '../../styles/Carousel.css'

function Index() {

  const [images] = useState([img1, img2])
  return (
    <>
      <Container fluid className="p-0" >
        <Row id="banner-row" className="justify-content-center">
          <Banner images={images} />
        </Row>
        <Row className="">
          <Col className="text-center">
            <img src={checkNumbersImage} alt="Check Numbers" className="img-fluid" />
          </Col>
          <Col className="text-center">
            <img src={lottoTexasImage} alt="Lotto Texas" className="img-fluid" />
          </Col>
        </Row>
        <Row>
          <Test />
        </Row>
      </Container>
    </>
  )
}

export default Index