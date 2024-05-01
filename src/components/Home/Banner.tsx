import Carousel from "react-bootstrap/Carousel"

interface BannerProps {
  images: string[]
}

function Banner({ images }: BannerProps) {
  return (
    <Carousel style={{ maxWidth: "1200px" }}>
      {images.map((image, index) => {
        return (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={image}
              alt="First slide"
            />
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}

export default Banner