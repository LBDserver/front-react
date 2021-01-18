import axios from "axios";

async function convertIFC(file, type, baseUri) {
  const formData = new FormData();
  formData.append("ifcFile", file, file.name);

  if (baseUri) {
    formData.append("baseUri", baseUri);
  }

  const response = await axios.post(`http://localhost:4800/${type}`, formData, {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log('response.data', response.data)
  const toFile = new File([response.data], "conversion.ttl")
  console.log('file', toFile)
  return toFile
}

export { convertIFC };
