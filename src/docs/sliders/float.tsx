import { $, type JSX } from "voby"
import { Slider } from "../../slider"

export const FloatExample = () => {
    // Initialize the state value
    const value = $<number>(12.5)

    // // Event handler for the slider value change
    // const handleChange = (newValue: number) => {
    //     value(newValue)
    // }

    return <div class="slider">
        <Slider
            min={10}
            max={20}
            step={0.5}
            value={value}
            onChange={value}
        />
        <div class="value">{value}</div>
    </div>
}

