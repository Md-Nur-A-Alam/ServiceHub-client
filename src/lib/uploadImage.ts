export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMG_API_KEY;
  if (!apiKey) throw new Error("Missing ImgBB API Key");

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error(data.error?.message || "Failed to upload image");
  }
};
