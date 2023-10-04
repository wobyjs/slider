import { $, $$, type JSX } from "voby"
import { Slider } from "../../slider"

interface NegativeProps { }

const Negative = (props: NegativeProps) => {
    const value = $<number>(-10)

    // const handleChange = (newValue: number) => {
    //     value(newValue)
    // }

    return (
        <div class="slider">
            <Slider
                min={-20}
                max={0}
                tooltip={false}
                value={value}
                onChange={value}
            />
            <div class="value">{value}</div>
        </div>
    )
}

export default Negative
