import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles.module.css'
import PropTypes from 'prop-types'
import getImageSize from '../../helper/getImageSize'
import useWindowSize from '../../helper/useWindowSize'

export default function Img(pr) {
  const {
    skeleton,
    imageWidth,
    imageHeight,
    src,
    placeholderSrc,
    alt,
    loading,
    imageRootProps = {},
    imageProps = {},
    ...props
  } = pr
  const [width] = useWindowSize()
  const ref = useRef()
  const [loaded, setLoaded] = useState(false)
  const [size, setSize] = useState()

  useEffect(() => {
    setImageSize()
  }, [width])

  function setImageSize() {
    if (!(imageWidth && imageHeight))
      return


    const process = () => {
      const [width, height] = getImageSize(ref, imageWidth, imageHeight)
      setSize({
        width,
        height
      })
    }

    if (size) {
      setSize(undefined)
      setTimeout(process, 300)
      return
    }
    process()
  }

  useEffect(() => {

    if (loaded)
      return
    let interval = undefined
    try {
      setTimeout(() => {
        interval = setInterval(() => {
          if (loaded || ref.current.getElementsByClassName('smart-image')[0].complete) {
            setLoaded(true)
            clearInterval(interval)
          }
        }, 400)
      }, 1000)
    } catch {
    }
    return () => {
      try {
        clearInterval(interval)
      } catch {}
    }
  }, [loaded])


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
        !loaded && (
          skeleton &&
          React.isValidElement(skeleton) ?
            skeleton :
            <div className={styles.skeleton}/>
        )
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
          className={`smart-image ${styles.initWithOpacity} ${loaded ? styles.initWithOpacityStart : ''}`}
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
  imageProps: PropTypes.object,
  skeleton: PropTypes.oneOfType([PropTypes.element, PropTypes.bool])
}

