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
    fetch('https://picsum.photos/v2/list?limit=20')
      .then(res => res.json())
      .then(photos => dispatch({type: 'updatePhotos', payload: photos}))
  }, [])

  return (
    <div className="App">
      <SearchBar search={state.search} dispatch={dispatch}></SearchBar>
      <Gallery photos={state.visiblePhotos} selectedPhotoIds={state.selectedPhotoIds} dispatch={dispatch}></Gallery>
    </div>
  );
}

export default App;
