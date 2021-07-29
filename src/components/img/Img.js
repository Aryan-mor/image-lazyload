import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles.module.css'
import PropTypes from 'prop-types'
import getImageSize from '../../helper/getImageSize'


export function useWindowSize(wait = 2000) {
  const [size, setSize] = useState([0, 0])
  useEffect(() => {
    function updateSize() {
      tryIt(() => setSize([window.innerWidth, window.innerHeight]))
    }

    window.addEventListener('resize', _.debounce(function() {
      updateSize()
    }, wait))
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return size
}

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

  const ref = useRef()
  const [loaded, setLoaded] = useState(false)
  const [size, setSize] = useState()


  useEffect(() => {
    setImageSize()
    let timer = undefined

    window.addEventListener('resize', () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setImageSize()
      }, 1000)
    })
    return () => window.removeEventListener('resize', setImageSize)
  }, [])

  function setImageSize() {
    if (!(imageWidth && imageHeight))
      return

    const [width, height] = getImageSize(ref, imageWidth, imageHeight)

    setSize({
      width,
      height
    })
  }


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
  imageProps: PropTypes.object,
  skeleton: PropTypes.oneOfType([PropTypes.element, PropTypes.bool])
}

