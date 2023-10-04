import { type JSX } from "voby"
import { Horizontal, Negative, FloatExample, Labels, Orientation } from "./sliders"
import Demo from "./demo"
// import Codeblock from './Codeblock'

const Examples = () => {
    return <>
        <Demo title="Basic Slider">
            <Horizontal />
        </Demo>
        <Demo title="Negative Values (No Tooltip)">
            <Negative />
        </Demo>
        <Demo title="Floating Point Boundaries">
            <FloatExample />
        </Demo>
        <Demo title="Custom Labels &amp; Formatting">
            <Labels />
        </Demo>
        <Demo title="Orientation &amp; Custom Styles">
            <Orientation />
        </Demo>
    </>
}

export default Examples
