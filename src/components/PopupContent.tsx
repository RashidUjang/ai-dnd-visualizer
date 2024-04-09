import { Button } from '@radix-ui/themes'

const PopupContent = () => {
  const postMessage = () => {
    window.opener.postMessage(
      'Button clicked in popup!',
      window.location.origin
    )
  }
  return (
    <div>
      <Button onClick={postMessage}>Post Message</Button>
      {window.location.origin}
    </div>
  )
}

export default PopupContent
