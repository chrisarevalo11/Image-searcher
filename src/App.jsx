import { Formik, Form, Field } from 'formik'
import { useEffect, useState } from 'react'
import { API, fetchHeaders } from './utils'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './styles/header.css'
import './styles/content.css'
import './styles/article.css'

function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const values = {
      search: 'random'
    }
    fetchAPI(values)
  }, [])

  const fetchAPI = async values => {
    if (values.search.length > 0) {
      setLoading(true)
      await fetch(`${API}${values.search}`, {
        headers: fetchHeaders
      })
        .then(res => res.json())
        .then(data => setPhotos(data.results))
        .catch(err => console.log(err))
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

  }

  const openImg = (link) => {
    window.open(link)
  }

  const capitalize = string => {
    return string !== null
      ? string.charAt(0).toUpperCase() + string.slice(1)
      : 'Go to image source'
  }

  return (
    <>
      <header>
        <Formik
          initialValues={{ search: '' }}
          onSubmit={fetchAPI}
        >
          <Form>
            <Field placeHolder='Try typing "tree"' name='search' autoFocus autoComplete='off' />
            <Field
              type='submit'
              value='🔍︎' />
          </Form>
        </Formik>
      </header>
      {!loading
        ? photos.length !== 0
          ? <div className='container'>
            <div className="grid">
              {photos.map(photo =>
                <article key={photo.id} onClick={() => openImg(photo.links.html)}>
                  <LazyLoadImage
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />

                  <p> {photo.description === null
                    ? capitalize(photo.alt_description)
                    : [photo.description, photo.alt_description].join(' - ')}
                  </p>
                </article>
              )}
            </div>
          </div>
          : <div className="not-found">
            <h1>No matching results for this search.</h1>
            <p>Try again with another request.</p>
          </div>
        : <div className="loader-container">
          <span className="loader"></span>
        </div>
      }
    </>
  );
}

export default App;
