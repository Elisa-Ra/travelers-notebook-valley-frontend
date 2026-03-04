export default function Gallery({ images }) {
  return (
    <div className="gallery">
      {images.map((img, i) => (
        <div className="gallery-item" key={i}>
          <img src={img.src} alt={img.alt} />
        </div>
      ))}
    </div>
  )
}
