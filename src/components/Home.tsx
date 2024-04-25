import { useEffect } from "react"

/* useEffect(() => {
  first

  return () => {
    second
  }
}, [third])
 */

function Home() {
  return (
    (
      <div className="p-5 mb-4 bg-body-tertiary rounded-3">
        <h1 className="display-4">Welcome to Texas Lotto!</h1>
        <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
        <hr className="my-4" />
        <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
      </div>
    )
  )
}

export default Home