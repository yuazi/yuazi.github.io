import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/protectedImages.inline"
import style from "./styles/protectedImages.scss"

const ProtectedImages: QuartzComponent = () => {
  return <></>
}

ProtectedImages.css = style
ProtectedImages.afterDOMLoaded = script

export default (() => ProtectedImages) satisfies QuartzComponentConstructor
