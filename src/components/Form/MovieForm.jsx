import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "@/utils/cloudinaryHelper";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Loader from "../Loader";

const MovieForm = ({
  initialData,
  onSubmit,
  isLoading,
  isDataLoading = false,
  router,
}) => {
  const {
    handleSubmit,
    setValue,
    register,
    setError,
    formState: { errors },
  } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { movieId } = router.query;
  const { data: session } = useSession();

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setPreviewImage(initialData?.poster);
        setValue(key, value);
      });
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  const onFileChange = useCallback(
    async (file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed", {
          position: "bottom-center",
        });
        return;
      }

      setIsUploading(true);
      try {
        const { secureUrl } = await uploadImage(file);
        setValue("poster", secureUrl);
        setError("poster", "");
        setPreviewImage(secureUrl.trim());
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
        setIsUploading(false);
      }
    },
    [setValue]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error("Only image files are allowed", {
          position: "bottom-center",
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        onFileChange(file);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  if (movieId && isDataLoading) return <Loader />;

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
    setValue("poster", "");
  };

  return (
    <div className="min-h-screen edit p-8 md:px-[30px] xl:px-[120px] lg:py-[80px] xl:py-[120px]">
      <div className="mx-0 w-full">
        <div className="text-wrapper-5 mb-[40px] lg:mb-[80px] xl:mb-[100px]">
          {initialData ? "Edit Movie" : "Create a new movie"}
        </div>
        <form
          className="div flex flex-col md:flex-row"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className="group w-full md:w-[473px] h-[504px] mb-[24px] md:mb-0"
            {...getRootProps()}
          >
            {errors.poster && (
              <p className="font-semibold text-rose-500 text-xs p-2">
                {errors.poster.message}
              </p>
            )}
            <input
              {...register("poster", { required: "Poster is required" })}
              {...getInputProps()}
            />
            {isUploading ? (
              <div className="flex justify-center items-center h-full">
                <Loader
                  type="ThreeDots"
                  color="#00BFFF"
                  height={100}
                  width={100}
                />
              </div>
            ) : previewImage ? (
              <>
                <Image
                  src={previewImage}
                  alt="Dropped image"
                  width={800}
                  height={600}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
                >
                  <span className="material-symbols-outlined">X</span>
                </button>
              </>
            ) : (
              <div className="group-2">
                <label htmlFor="imageInput" className="center">
                  <img
                    className="file-download-black"
                    alt="File download black"
                    src="https://c.animaapp.com/T8Jpu6Ic/img/file-download-black-24dp-1.svg"
                  />
                </label>
                <div className="text-wrapper-2">
                  Drop an image here or click to upload
                </div>
              </div>
            )}
          </div>
          <div className="form ml-0 w-full md:ml-[24px] md:w-[362px] lg:ml-[120px]">
            <div className="overlap-wrapper mb-[24px]">
              <input
                type="text"
                placeholder="Title"
                {...register("title", { required: "Title is required" })}
                className="w-full h-[45px] bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
              />
              {errors.title && (
                <p className="font-semibold text-rose-500 text-xs">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="input mb-[24px]">
              <div className="input">
                <div className="overlap-group">
                  <input
                    type="text"
                    className="w-full h-[45px] left-0 top-0 absolute bg-cyan-900 rounded-[10px] pl-[16px] text-white text-sm border-transparent focus:outline-none"
                    placeholder="Publishing year"
                    {...register("publishingYear", {
                      required: "Publishing year is required",
                    })}
                  />
                </div>
                {errors.publishingYear && (
                  <p className="font-semibold text-rose-500 text-xs">
                    {errors.publishingYear.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <button
                type="button"
                className={`w-full button-wrapper button-2 cursor-pointer hover:bg-emerald-500
                  ${
                    isUploading || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  `}
                disabled={isUploading || isLoading}
                onClick={() => router.push("/movies")}
              >
                <div className="text-wrapper">Cancel</div>
              </button>
              <button
                disabled={isUploading || isLoading}
                type="submit"
                className={`w-full button button-instance cursor-pointer bg-[#2BD17E] hover:bg-emerald-500 ${
                  isUploading || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className={`submit design-component-instance-node`}>
                  {initialData ? "Update" : "Create"}
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;
