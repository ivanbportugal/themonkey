import './App.css';
import React, { useReducer, useEffect } from 'react';

function everythingReducer(state, action) {
  let newSet = undefined
  switch (action.type) {
    case 'updatePhotos':
      return {
        ...state,
        photos: action.payload,
        visiblePhotos: action.payload,
        search: ''
      }
    case 'selectPhoto':
      newSet = new Set(state.selectedPhotoIds)
      newSet.add(action.payload)
      return {
        ...state,
        selectedPhotoIds: newSet
      }
    case 'deselectPhoto':
      newSet = new Set(state.selectedPhotoIds)
      newSet.delete(action.payload)
      return {
        ...state,
        selectedPhotoIds: newSet
      }
    case 'search':
      if(!action.payload) {
        return {
          ...state,
          visiblePhotos: [...state.photos],
          search: ''
        }
      } else {
        const visiblePhotos = state.photos.filter((photo) => photo.author.indexOf(action.payload) > -1)
        return {
          ...state,
          search: action.payload,
          visiblePhotos
        }
      }
    default:
      throw new Error();
  }
}

function GalleryItem({photo, isChecked, dispatch}) {
  const photoIdText = `photo-${photo.id}`
  let checked = isChecked
  const onCheck = () => {
    checked = !checked
    if (checked) {
      dispatch({type: "selectPhoto", payload: photo.id})
    } else {
      dispatch({type: "deselectPhoto", payload: photo.id})
    }
  }
  return (
    <>
      {/* Just use class name and css for now. Would prefer CSS-in-JS but didn't want to deal with that yet! */}
      <div className={checked ? 'selected-image' : null}>
        <input
          id={photoIdText}
          type="checkbox"
          checked={checked}
          onChange={onCheck}
        />
        <label htmlFor={photoIdText}>
          <img
            src={photo.download_url}
            width="150"
            alt={photo.author}
          />
        </label>
        <pre>{JSON.stringify(photo)}</pre>
      </div>
    </>
  )
}

function Gallery({photos, selectedPhotoIds, dispatch}) {
  const isSelected = (id) => {
    return selectedPhotoIds.has(id)
  }
  return (
    <>
      <div className="gallery">
        {photos.map((photo) => <GalleryItem key={photo.id} photo={photo} isChecked={isSelected(photo.id)} dispatch={dispatch}></GalleryItem>)}
      </div>
    </>
  )
}

function SearchBar({search, dispatch}) {
  const onType = (event) => {
    // Immediately dispatch events (no debouncing for now :) )
    dispatch({type: "search", payload: event.target.value})
  }
  return (
    <>
      <input 
        type="text"
        placeholder="Search Photo Authors"
        value={search}
        onChange={onType}
      />
    </>
  )
}

function App() {

  // One state for all the things for now!
  const [state, dispatch] = useReducer(everythingReducer, {
    photos: [],
    visiblePhotos: [],
    selectedPhotoIds: new Set(),
    search: '',
  })

  useEffect(() => {
    // Hydrate photos
    const thePhotos = [
      {
        "id": "0",
        "author": "Alejandro Escamilla",
        "width": 5616,
        "height": 3744,
        "url": "https://unsplash.com/photos/yC-Yzbqy7PY",
        "download_url": "https://picsum.photos/id/0/5616/3744"
      },
      {
        "id": "1",
        "author": "Alejandro Escamilla",
        "width": 5616,
        "height": 3744,
        "url": "https://unsplash.com/photos/LNRyGwIJr5c",
        "download_url": "https://picsum.photos/id/1/5616/3744"
      },
      {
        "id": "10",
        "author": "Paul Jarvis",
        "width": 2500,
        "height": 1667,
        "url": "https://unsplash.com/photos/6J--NXulQCs",
        "download_url": "https://picsum.photos/id/10/2500/1667"
      },
      {
        "id": "100",
        "author": "Tina Rataj",
        "width": 2500,
        "height": 1656,
        "url": "https://unsplash.com/photos/pwaaqfoMibI",
        "download_url": "https://picsum.photos/id/100/2500/1656"
      },
      {
        "id": "1000",
        "author": "Lukas Budimaier",
        "width": 5626,
        "height": 3635,
        "url": "https://unsplash.com/photos/6cY-FvMlmkQ",
        "download_url": "https://picsum.photos/id/1000/5626/3635"
      },
      {
        "id": "1001",
        "author": "Danielle MacInnes",
        "width": 5616,
        "height": 3744,
        "url": "https://unsplash.com/photos/1DkWWN1dr-s",
        "download_url": "https://picsum.photos/id/1001/5616/3744"
      },
      {
        "id": "1002",
        "author": "NASA",
        "width": 4312,
        "height": 2868,
        "url": "https://unsplash.com/photos/6-jTZysYY_U",
        "download_url": "https://picsum.photos/id/1002/4312/2868"
      },
      {
        "id": "1003",
        "author": "E+N Photographies",
        "width": 1181,
        "height": 1772,
        "url": "https://unsplash.com/photos/GYumuBnTqKc",
        "download_url": "https://picsum.photos/id/1003/1181/1772"
      },
      {
        "id": "1004",
        "author": "Greg Rakozy",
        "width": 5616,
        "height": 3744,
        "url": "https://unsplash.com/photos/SSxIGsySh8o",
        "download_url": "https://picsum.photos/id/1004/5616/3744"
      },
      {
        "id": "1005",
        "author": "Matthew Wiebe",
        "width": 5760,
        "height": 3840,
        "url": "https://unsplash.com/photos/tBtuxtLvAZs",
        "download_url": "https://picsum.photos/id/1005/5760/3840"
      },
      {
        "id": "1006",
        "author": "Vladimir Kudinov",
        "width": 3000,
        "height": 2000,
        "url": "https://unsplash.com/photos/-wWRHIUklxM",
        "download_url": "https://picsum.photos/id/1006/3000/2000"
      },
      {
        "id": "1008",
        "author": "Benjamin Combs",
        "width": 5616,
        "height": 3744,
        "url": "https://unsplash.com/photos/5L4XAgMSno0",
        "download_url": "https://picsum.photos/id/1008/5616/3744"
      },
      {
        "id": "1009",
        "author": "Christopher Campbell",
        "width": 5000,
        "height": 7502,
        "url": "https://unsplash.com/photos/CMWRIzyMKZk",
        "download_url": "https://picsum.photos/id/1009/5000/7502"
      },
      {
        "id": "101",
        "author": "Christian Bardenhorst",
        "width": 2621,
        "height": 1747,
        "url": "https://unsplash.com/photos/8lMhzUjD1Wk",
        "download_url": "https://picsum.photos/id/101/2621/1747"
      },
      {
        "id": "1010",
        "author": "Samantha Sophia",
        "width": 5184,
        "height": 3456,
        "url": "https://unsplash.com/photos/NaWKMlp3tVs",
        "download_url": "https://picsum.photos/id/1010/5184/3456"
      },
      {
        "id": "1011",
        "author": "Roberto Nickson",
        "width": 5472,
        "height": 3648,
        "url": "https://unsplash.com/photos/7BjmDICVloE",
        "download_url": "https://picsum.photos/id/1011/5472/3648"
      },
      {
        "id": "1012",
        "author": "Scott Webb",
        "width": 3973,
        "height": 2639,
        "url": "https://unsplash.com/photos/uAgLGG1WBd4",
        "download_url": "https://picsum.photos/id/1012/3973/2639"
      },
      {
        "id": "1013",
        "author": "Cayton Heath",
        "width": 4256,
        "height": 2832,
        "url": "https://unsplash.com/photos/D8LcRLwZyPs",
        "download_url": "https://picsum.photos/id/1013/4256/2832"
      },
      {
        "id": "1014",
        "author": "Oscar Keys",
        "width": 6016,
        "height": 4000,
        "url": "https://unsplash.com/photos/AmPRUnRb6N0",
        "download_url": "https://picsum.photos/id/1014/6016/4000"
      },
      {
        "id": "1015",
        "author": "Alexey Topolyanskiy",
        "width": 6000,
        "height": 4000,
        "url": "https://unsplash.com/photos/-oWyJoSqBRM",
        "download_url": "https://picsum.photos/id/1015/6000/4000"
      }
    ]
    dispatch({type: 'updatePhotos', payload: thePhotos})
  }, [])

  return (
    <div className="App">
      <SearchBar search={state.search} dispatch={dispatch}></SearchBar>
      <Gallery photos={state.visiblePhotos} selectedPhotoIds={state.selectedPhotoIds} dispatch={dispatch}></Gallery>
    </div>
  );
}

export default App;
