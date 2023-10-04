import { $, $$, type JSX } from "voby"
import { Slider } from "../../slider"

interface VerticalProps { }

const Vertical = (props: VerticalProps) => {
    const value = $<number>(25)
    const reverseValue = $<number>(8)

    // const handleChange = (newValue: number) => {
    //     value(newValue)
    // }

    // const handleChangeReverse = (newValue: number) => {
    //     reverseValue(newValue)
    // }

    return (
        <div class="slider orientation-reversed">
            <div class="slider-group flex items-center justify-center">
                <div class="slider-vertical flex-1">
                    <Slider
                        class="w-[4px]
                [&>.rangesliderFill]:bg-[#ef5350]
                [&>.rangesliderHandle]:w-[30px] 
                [&>.rangesliderHandle]:h-[30px] 
                [&>.rangesliderHandle]:left-[-13px] 
                [&>.rangesliderHandle]:bg-white 
                [&>.rangesliderHandle]:shadow-[0_1px_1px_#333]
                [&>.rangesliderHandle]:rounded-[50%]
                "
                        min={0}
                        max={100}
                        value={value}
                        orientation="vertical"
                        onChange={value}
                    />
                    <div class="value">{value}</div>
                </div>
                <div class="slider-vertical flex-1">
                    <Slider class="w-[4px]
                [&>.rangesliderFill]:bg-[#ef5350]
                [&>.rangesliderHandle]:w-[30px] 
                [&>.rangesliderHandle]:h-[30px] 
                [&>.rangesliderHandle]:left-[-13px] 
                [&>.rangesliderHandle]:bg-white 
                [&>.rangesliderHandle]:shadow-[0_1px_1px_#333]
                [&>.rangesliderHandle]:rounded-[50%]
                "
                        min={0}
                        max={100}
                        value={value}
                        orientation="vertical"
                        onChange={value}
                        reverse alwaysOnTooltip
                    />
                    <div class="value">{value}</div>
                </div>

                <div class="slider-horizontal  flex-1">
                    <Slider
                        class="
                            rounded-none h-[10px]
                            [&>.rangesliderFill]:rounded-none 
                            [&>.rangesliderFill]:bg-[#1e88e5]
                            [&>.rangesliderHandle]:rounded-none

                        [&>.rangesliderHandle]:w-2.5 [&>.rangesliderHandle]:h-[30px] [&>.rangesliderHandle]:after:hidden
                                            "
                        min={0}
                        max={10}
                        value={reverseValue}
                        orientation="horizontal"
                        onChange={reverseValue}
                    />
                    <div class="value">{reverseValue}</div>
                </div>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <div class="slider-horizontal  flex-1">
                    <Slider
                        class="
                            rounded-none h-[10px]
                            [&>.rangesliderFill]:rounded-none 
                            [&>.rangesliderFill]:bg-[#1e88e5]
                            [&>.rangesliderHandle]:rounded-none

                        [&>.rangesliderHandle]:w-2.5 [&>.rangesliderHandle]:h-[30px] [&>.rangesliderHandle]:after:hidden
                                            "
                        min={0}
                        max={10}
                        value={reverseValue}
                        orientation="horizontal"
                        onChange={reverseValue}
                        reverse
                    />
                    <div class="value">{reverseValue}</div>
                </div>
            </div>
        </div>
    )
}

export default Vertical
