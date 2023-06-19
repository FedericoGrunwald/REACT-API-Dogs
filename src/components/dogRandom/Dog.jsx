import React, { useState, useEffect } from "react";
import { FcLike, FcDislike } from "react-icons/fc";

function Dog() {
  const [randomMichis, setRandomMichis] = useState([]);
  const [favoriteMichis, setFavoriteMichis] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const APY_KEY =
    "live_vmVwKedbvl4xzuvmogzsHx3ctvs5TYKi4W5xx5RetJIV5JP0CLy2Mkq2AfWTnwsR";
  const API_URL_RANDOM = `https://api.thedogapi.com/v1/images/search?limit=2&`;
  const API_URL_FAVORITES = `https://api.thedogapi.com/v1/favourites?`;
  const API_URL_FAVORITES_DELETE = (id) =>
    `https://api.thedogapi.com/v1/favourites/${id}?`;
  const API_URL_UPLOAD = "https://api.thedogapi.com/v1/images/upload";

  useEffect(() => {
    loadRandomMichis();
    loadFavoriteMichis();
  }, []);

  const loadRandomMichis = async () => {
    try {
      const res = await fetch(API_URL_RANDOM);
      const data = await res.json();
      if (res.status !== 200) {
        console.log("Hubo un error: " + res.status);
      } else {
        setRandomMichis(data.slice(0, 10));
      }
    } catch (error) {
      console.log("Hubo un error al cargar los michis aleatorios");
    }
  };

  const loadFavoriteMichis = async () => {
    try {
      const res = await fetch(API_URL_FAVORITES, {
        method: "GET",
        headers: {
          "x-api-key": APY_KEY,
        },
      });
      const data = await res.json();
      if (res.status !== 200) {
        console.log("Hubo un error: " + res.status + data.message);
      } else {
        setFavoriteMichis(data);
      }
    } catch (error) {
      console.log("Hubo un error al cargar los perros favoritos");
    }
  };

  const saveFavoriteMichi = async (id) => {
    try {
      const res = await fetch(API_URL_FAVORITES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": APY_KEY,
        },
        body: JSON.stringify({
          image_id: id,
        }),
      });
      const data = await res.json();
      if (res.status !== 200) {
        console.log("Hubo un error: " + res.status + data.message);
      } else {
        console.log("Perro guardado en favoritos");
        loadFavoriteMichis();
      }
    } catch (error) {
      console.log("Hubo un error al guardar el perro en favoritos");
    }
  };

  const deleteFavoriteMichi = async (id) => {
    try {
      const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: "DELETE",
        headers: {
          "x-api-key": APY_KEY,
        },
      });
      const data = await res.json();
      if (res.status !== 200) {
        console.log("Hubo un error: " + res.status + data.message);
      } else {
        console.log("Perro eliminado de favoritos");
        loadFavoriteMichis();
      }
    } catch (error) {
      console.log("Hubo un error al eliminar el Perro de favoritos");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImageUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", handleComplete);
    xhr.open("POST", API_URL_UPLOAD);
    xhr.setRequestHeader("x-api-key", APY_KEY);
    xhr.send(formData);
  };

  const handleComplete = (event) => {
    const response = JSON.parse(event.target.responseText);
    setUploadedImages((prevImages) => [...prevImages, response]);
    console.log("Carga completa:", event.target.responseText);
    console.log(response.url);

    setSelectedFile(null); 
    setPreviewImageUrl("");
  };

  return (
    <div className="">
      <div className="m-5 p-5 bg-blue-400 flex flex-wrap flex-row gap-6 justify-center rounded-md shadow-xl">
        <div className="flex w-full h-12 justify-center">
          <h2 className="font-bold text-2xl text-white">Random Dogs</h2>
        </div>

        {randomMichis?.map((imagen) => (
          <div className="relative" key={imagen.id}>
            <img
              className="w-80 h-80 shadow-xl border-solid border-2 border-yellow-100 rounded-md p-4"
              src={imagen.url}
              alt={`Imagen ${imagen.id + 1}`}
              onDoubleClick={() => saveFavoriteMichi(imagen.id)}
            />
              {favoriteMichis.find((favorite) => favorite.image.id === imagen.id) && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FcLike className="text-red-500 text-5xl"/>
              </div>
              )}
          </div>
        ))}
      </div>
      <div className="flex w-full justify-center">
        <button
          className="p-2 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-600"
          onClick={loadRandomMichis}
        >
          Reload
        </button>
      </div>

      <div className="m-5 p-5 bg-blue-400 flex flex-wrap flex-row gap-6 justify-center rounded-md shadow-xl">
        <div className="flex w-full h-12 justify-center">
          <h2 className="font-bold text-2xl text-white">Favorite Dogs</h2>
        </div>

        {favoriteMichis?.map((favorite) => (
          <div className="relative" key={favorite.image.id}>
            <img
              className="w-80 h-80 shadow-xl border-solid border-2 border-yellow-100 rounded-md p-4"
              src={favorite.image.url}
              alt={`Imagen ${favorite.image.id + 1}`}
            />
            <button onClick={() => deleteFavoriteMichi(favorite.id)}>
              <div className=" absolute bottom-3 left-4 transform -translate-x-1/2 -translate-y-1/2">
                <FcDislike className="text-red-500 text-3xl"/>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="file relative">
        <form className="flex w-full justify-center">
          <div className="relative">
            <label
            htmlFor="file"
            className="upload-label bg-footer-color text-white py-8 px-10 flex flex-col transition duration-400"
          >
            <span className="flex justify-center text-2xl font-bold">Upload your dog picture!
            </span>
            <input
              className="absolute right-1 text-2xl opacity-0 cursor-pointer"
              type="file"
              onChange={handleFileChange}
            />
          </label>
          </div>
        </form>
        <div className="flex w-full justify-center">
          {previewImageUrl && <img className="w-80 h-80 shadow-xl border-solid border-2 border-yellow-100 rounded-md p-4" src={previewImageUrl} alt="Vista previa" />}
        </div>
        <div className="flex w-full justify-center">
          <button
            className="mb-8 mt-4 bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600"
            onClick={handleUpload}
          >
            Upload your dog images
          </button>
        </div>
          
        {uploadedImages?.map((image) => (
          <div className="relative">        
            <div className="m-5 p-5 bg-blue-400 flex flex-wrap flex-row gap-6 justify-center rounded-md shadow-xl" key={image.id}>
            <img
              className="mt-6 mb-8 w-80 h-80 shadow-xl border-solid border-2 border-yellow-100 rounded-md p-4"
              src={image.url}
              alt={`Imagen ${image.id + 1}`}
              onDoubleClick={() => saveFavoriteMichi(image.id)}
            />
              {favoriteMichis.find((favorite) => favorite.image.id === image.id) && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FcLike className="text-red-500 text-5xl"/>
              </div>
              )}
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dog;
