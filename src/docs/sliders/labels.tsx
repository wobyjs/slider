import { $, $$, ObservableMaybe, type JSX } from 'woby'

import { Slider } from "../../slider"

interface HorizontalCustomLabelsProps { }

const HorizontalCustomLabels = (props: HorizontalCustomLabelsProps) => {
    const horizontal = $<number>(10)
    const vertical = $<number>(50)

    // const handleChangeHorizontal = (value: number) => {
    //     horizontal(value)
    // }

    // const handleChangeVertical = (value: number) => {
    //     vertical(value)
    // }

    const horizontalLabels = {
        0: "Low",
        25: 'Q',
        50: "Medium",
        75: "75%",
        100: "High"
    }

    const verticalLabels = {
        10: "G",
        50: "H",
        90: "A",
        100: "C"
    }

    const formatkg = (value: ObservableMaybe<number>) => $$(value) + " kg"
    const formatPc = (p: ObservableMaybe<number>) => $$(p) + "%"

    return (
        <div class="slider custom-labels">
            <Slider
                class="
[&>.rangesliderHandle]:w-[34px] [&>.rangesliderHandle]:h-[34px] [&>.rangesliderHandle]:text-center [&>.rangesliderHandle]:rounded-[30px]
[&>.rangesliderHandle]:after:[position:initial]
[&>.rangesliderLabel]:top-[18px]
[&>.rangesliderHandle-tooltip]:w-[60px] [&>.rangesliderHandle-tooltip]:left-2/4
[&>.rangesliderHandle-tooltip]:[transform:translate3d(-50%,0,0)]
[&>.rangesliderHandle-label]:absolute [&>.rangesliderHandle-label]:left-2/4 [&>.rangesliderHandle-label]:top-2/4
[&>.rangesliderHandle-label]:[transform:translate3d(-50%,-50%,0)]
            
            "
                min={0}
                max={100}
                value={horizontal}
                labels={horizontalLabels}
                formatTooltip={formatkg}
                formatLabel={horizontal}
                onChange={horizontal}
            />
            <div class="value">{() => formatkg(horizontal)}</div>
            <hr />
            <Slider
                value={vertical}
                orientation="vertical"
                labels={verticalLabels}
                // handleLabel={vertical}
                formatTooltip={formatPc}
                onChange={vertical}
            />
            <div class="value">{() => formatPc(vertical)}</div>
        </div>
    )
}

export default HorizontalCustomLabels
