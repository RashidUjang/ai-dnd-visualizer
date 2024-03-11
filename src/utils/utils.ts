export const convertBlobToBase64 = (blob: Blob) => {
  // Web application to read file
  return new Promise((resolve) => {
    // TODO: Find out how does it work that it converts to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader?.result?.split(',')[1])
      }
    }
    reader.readAsDataURL(blob)
  })
}
