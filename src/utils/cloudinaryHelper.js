export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET
    );
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUDINARY_ENDPOINT}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
      assetId: data.asset_id,
      signatureId: data.signature,
    };
  } catch (error) {
    throw new Error(error);
  }
};
