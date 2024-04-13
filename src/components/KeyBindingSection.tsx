import KeyBindingTile from "./KeyBindingTile"

const KeyBindingSection = () => {
  return <ul>
    <KeyBindingTile tile="F" tileDescription="Makes the image full screen"/>
    <KeyBindingTile tile="G" tileDescription="Generates an image with the current prompt"/>
    <KeyBindingTile tile="P" tileDescription="Start the Prompter"/>
  </ul>
}

export default KeyBindingSection
