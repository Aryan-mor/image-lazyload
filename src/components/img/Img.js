import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles.module.css'
import PropTypes from 'prop-types'

export default function Img(pr) {
  const {
    imageWidth,
    imageHeight,
    src,
    placeholderSrc,
    alt,
    loading,
    imageRootProps={},
    imageProps={},
    ...props
  } = pr


  const ref = useRef()
  const [loaded, setLoaded] = useState(false)
  const [size, setSize] = useState()

  useEffect(() => {
    if (!(imageWidth && imageHeight))
      return

    const width = ref?.current?.offsetWidth
    const height = (width * imageHeight) / imageWidth

    setSize({
      width,
      height
    })
  }, [])

  return (
    <div
      ref={ref}
      {...props}
      style={{
        width: size?.width || '100%',
        height: size?.height,
        position: 'relative',
        ...props?.style
      }}>
      {
        !loaded &&
        <div className={styles.skeleton}/>
      }
      <div
        {...imageRootProps}
        style={{
          width: size?.width || '100%',
          height: size?.height,
          ...(placeholderSrc ? {
            backgroundImage: `url("${placeholderSrc}")`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          } : {}),
          ...imageRootProps?.style
        }}>
        <img
          className={`${styles.initWithOpacity} ${loaded ? styles.initWithOpacityStart : ''}`}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => {
            setLoaded(true)
          }}
          style={{
            width: size?.width || '100%',
            height: size?.height,
            ...imageProps
          }}/>
      </div>
    </div>

  )
}


Img.defaultProps = {
  loading: 'lazy'
}


Img.propTypes = {
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  src: PropTypes.string,
  placeholderSrc: PropTypes.string,
  alt: PropTypes.string,
  loading: PropTypes.string,
  imageRootProps: PropTypes.object,
  imageProps: PropTypes.object
}

