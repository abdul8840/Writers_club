//createlisting

import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    shortdescription: '',
    story: '',
    type: 'english',
    // bedrooms: 1,
    // bathrooms: 1,
    // regularPrice: 50,
    // discountPrice: 0,
    // offer: false,
    drama: false,
    thriller: false,
    comedy: false,
    action: false,
    adventure: false,
    horror: false,
    romance: false,
    scifi: false,
    historic: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'english' || e.target.id === 'hindi' || e.target.id === 'marathi') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
  
    if (
      e.target.id === 'drama' ||
      e.target.id === 'thriller' ||
      e.target.id === 'comedy' ||
      e.target.id === 'action' ||
      e.target.id === 'adventure' ||
      e.target.id === 'horror' ||
      e.target.id === 'romance' ||
      e.target.id === 'scifi' ||
      e.target.id === 'historic'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
  
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      // Check if the input is for the story textarea
      if (e.target.id === 'story') {
        // Filter out abusive words
        const filteredStory = filterAbusiveWords(e.target.value);
        // Update the form data with the filtered story
        setFormData({
          ...formData,
          story: filteredStory,
        });
      } else {
        // For other inputs, update form data directly
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
    }
  };

  const filterAbusiveWords = (input) => {
    const abusiveWords = ["abuse", "Fuck", "Shit", "Asshole", "Bitch", "Bastard",
    "Dick", "Cunt", "Motherfucker", "Ass", "Slut",
    "Whore", "Nigger", "Faggot", "Retard", "Gay",
    "Dyke", "Tranny", "Chink", "Spic", "Kike",
    "Nigga", "Bitchass", "Piss", "Pissed off", "Piss off",
    "Crap", "Douchebag", "Wanker", "Fuckwit", "Twat",
    "Arsehole", "Bollocks", "Prick", "Cock", "Cockhead",
    "Shithead", "Son of a bitch", "Jackass", "Dumbass", "Motherfucking", 
  
    "fuck", "shit", "asshole", "bitch", "bastard",
    "dick", "cunt", "motherfucker", "ass", "slut",
    "whore", "nigger", "faggot", "retard", "gay",
    "dyke", "tranny", "chink", "spic", "kike",
    "nigga", "bitchass", "piss", "pissed off", "piss off",
    "crap", "douchebag", "wanker", "fuckwit", "twat",
    "arsehole", "bollocks", "prick", "cock", "cockhead",
    "shithead", "son of a bitch", "jackass", "dumbass", "motherfucking",

    "Chutiya", "Madarchod", "Behenchod", "Gandu", "Bhosdike",
  "Bhenchod", "Randi", "Kutiya", "Saala", "Harami",
  "Chutiye", "Laude", "Lavde", "Bhosdiwale", "Gand",
  "Bhadwa", "Chut", "Lund", "Chutia", "Chutiyapa",
  "Bhosdi", "Bhen ke lode", "Teri maa ka bhosda", "Teri maa ki chut",
  "Bhadwe", "Chut ke baal", "Chut ke dushman", "Chut ka pujari", "Chut marani",
  "Chut marne wala", "Chutad", "Gandu sala", "Gandu kela", "Gandmasti",

  "chutiya", "madarchod", "behenchod", "gandu", "bhosdike",
  "bhenchod", "randi", "kutiya", "saala", "harami",
  "chutiye", "laude", "lavde", "bhosdiwale", "gand",
  "bhadwa", "chut", "lund", "chutia", "chutiyapa",
  "bhosdi", "bhen ke lode", "teri maa ka bhosda", "teri maa ki chut",
  "bhadwe", "chut ke baal", "chut ke dushman", "chut ka pujari", "chut marani",
  "chut marne wala", "chutad", "gandu sala", "gandu kela", "gandmasti"
    
  ]; // Add abusive words to this array
    const inputWords = input.split(/\s+/); // Split the input into words
    // Filter out abusive words
    const filteredWords = inputWords.filter(word => !abusiveWords.includes(word.toLowerCase()));
    // Join the filtered words back into a string
    return filteredWords.join(' ');
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type='text'
            placeholder='Description max length 200'
            className='border p-3 rounded-lg'
            id='shortdescription'
            required
            maxLength='200'
            minLength='10'
            onChange={handleChange}
            value={formData.description}
          />
          <textarea
             placeholder='Write your story here...'
             className='border p-3 rounded-lg'
             id='story'
             required
             role="textbox"
             aria-multiline="true"
             contenteditable="true" 
             spellcheck="true"
             rows='10'
             onChange={handleChange}
             value={formData.story}
          />
          <div className='flex gap-6 flex-wrap'>
            <h3 className='font-bold'>Choose Language : </h3>

            <div className="flex gap-6 flex-wrap">
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='english'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'english'}
              />
              <span>English</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='hindi'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'hindi'}
              />
              <span>Hindi</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='marathi'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'marathi'}
              />
              <span>Marathi</span>
            </div>
            </div>
            </div>

            <div className='flex gap-6 flex-wrap'>
            <h3 className='font-bold'>Choose Categories : </h3>
            <div className="flex gap-6 flex-wrap">
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='drama'
                className='w-5'
                onChange={handleChange}
                checked={formData.drama}
              />
              <span>Drama</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='thriller'
                className='w-5'
                onChange={handleChange}
                checked={formData.thriller}
              />
              <span>Thriller</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='comedy'
                className='w-5'
                onChange={handleChange}
                checked={formData.comedy}
              />
              <span>Comedy</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='action'
                className='w-5'
                onChange={handleChange}
                checked={formData.action}
              />
              <span>Action</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='adventure'
                className='w-5'
                onChange={handleChange}
                checked={formData.adventure}
              />
              <span>Adventure</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='horror'
                className='w-5'
                onChange={handleChange}
                checked={formData.horror}
              />
              <span>Horror</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='romance'
                className='w-5'
                onChange={handleChange}
                checked={formData.romance}
              />
              <span>Romance</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='scifi'
                className='w-5'
                onChange={handleChange}
                checked={formData.scifi}
              />
              <span>Sci-Fi</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='historic'
                className='w-5'
                onChange={handleChange}
                checked={formData.historic}
              />
              <span>Historic</span>
            </div>
            </div>

          </div>
          {/* <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div> */}
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}