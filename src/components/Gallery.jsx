export default function Gallery({ images }) {
  // duplico le immagini
  const loopImages = [...images, ...images]

  return (
    <div className="gallery">
      <div className="scorrimento">
        {loopImages.map((img, i) => (
          <div className="gallery-item" key={i}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>
    </div>
  )
}
