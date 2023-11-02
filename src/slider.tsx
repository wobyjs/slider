import { $, $$, useEffect, useMemo, ObservableMaybe, type JSX, ObservableReadonly, Observable, Child } from 'woby'
import { capitalize, clamp } from "./utils"

// /https://whoisandy.github.io/react-rangeslider/

type Orientation = "horizontal" | "vertical"

interface SliderProps {
    min?: ObservableMaybe<number>
    max?: ObservableMaybe<number>
    step?: ObservableMaybe<number>
    value?: Observable<number>
    orientation?: ObservableMaybe<Orientation>
    tooltip?: ObservableMaybe<boolean>
    alwaysOnTooltip?: ObservableMaybe<boolean>
    reverse?: ObservableMaybe<boolean>
    labels?: ObservableMaybe<Record<string, JSX.Child>>
    formatLabel?: (value: ObservableMaybe<number>) => JSX.Child
    formatTooltip?: (value: ObservableMaybe<number>) => JSX.Child
    onChangeStart?: (e: MouseEvent | TouchEvent) => void
    onChange?: (value: number, e: MouseEvent | TouchEvent | KeyboardEvent) => void
    onChangeComplete?: (e: MouseEvent | TouchEvent) => void
    class?: ObservableMaybe<string>
    className?: ObservableMaybe<string>
}

const constants = {
    orientation: {
        horizontal: {
            dimension: "width",
            direction: "left",
            reverseDirection: "right",
            coordinate: "x",
        },
        vertical: {
            dimension: "height",
            direction: "top",
            reverseDirection: "bottom",
            coordinate: "y",
        },
    },
}

export const Slider = (props: SliderProps & JSX.HTMLAttributes<HTMLDivElement>) => {
    const {
        min = $(0),
        max = $(100),
        step = $(1),
        value = $(0),
        orientation = $("horizontal"),
        tooltip = $(true),
        alwaysOnTooltip = $(false),
        reverse = $(false),
        labels = $({}),
        formatLabel = $(""),
        formatTooltip,
        onChangeStart,
        onChange,
        onChangeComplete,
    } = props

    const active = $<boolean>(false)
    const limit = $<number>(0)
    const grab = $<number>(0)
    const sliderRef = $<HTMLDivElement>()
    const handleRef = $<HTMLDivElement>()
    const tooltipRef = $<HTMLDivElement>()
    const labelsRef = $<HTMLUListElement>()
    const sliderValue = $($$(value))
    const sliderDim = $(0)
    const handleDim = $(0)

    useEffect(() => {
        sliderValue($$(value))
    })
    const handleTooltip = (value: number): JSX.Child => {
        return formatTooltip ? formatTooltip(value) : value
    }

    const handleUpdate = () => {
        if (!$$(sliderRef) || !$$(handleRef)) {
            return
        }
        const dimension = capitalize(constants.orientation[$$(orientation)].dimension)
        sliderDim($$(sliderRef)[`offset${$$(dimension)}`])
        handleDim($$(handleRef)[`offset${$$(dimension)}`])

        limit(sliderDim() - handleDim())
        grab(handleDim() / 2)
    }

    const handleStart = (e: MouseEvent | TouchEvent) => {
        document.addEventListener("mousemove", handleDrag)
        document.addEventListener("mouseup", handleEnd)
        active(true)
        onChangeStart?.(e)
    }

    const handleDrag = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation()
        if (!onChange) return

        const {
            //@ts-ignore
            target: { className, classList, dataset },
        } = e

        if (className === "rangesliderLabels") return

        sliderValue(position(e))

        if (classList?.contains("rangesliderLabel-item") && dataset.value) {
            sliderValue(parseFloat(dataset.value))
        }
        onChange?.($$(sliderValue), e)
    }

    useEffect(() => {
        handleUpdate()
        const resizeObserver = new ResizeObserver(handleUpdate)
        if ($$(sliderRef)) {
            resizeObserver.observe($$(sliderRef))
        }

        return () => {
            resizeObserver.disconnect()
        }
    })

    const handleEnd = (e: MouseEvent | TouchEvent) => {
        active(false)
        onChangeComplete?.(e)
        value($$(sliderValue))
        document.removeEventListener("mousemove", handleDrag)
        document.removeEventListener("mouseup", handleEnd)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        e.preventDefault()
        const { keyCode } = e
        // let sliderValue

        switch (keyCode) {
            case 38:
            case 39:
                sliderValue($$(value) + $$(step) > $$(max) ? $$(max) : $$(value) + $$(step))
                onChange?.($$(sliderValue), e)
                break
            case 37:
            case 40:
                sliderValue($$(value) - $$(step) < $$(min) ? $$(min) : $$(value) - $$(step))
                onChange?.($$(sliderValue), e)
                break
            default:
        }
    }

    const getPositionFromValue = (value: number, isLabel = false): number => {
        const diffMaxMin = $$(max) - $$(min)
        const diffValMin = value - $$(min)
        const percentage = diffValMin / diffMaxMin
        // const pos = Math.round(percentage * ($$(limit) +
        //     ($$(reverse) ?
        //         ($$(isHorizontal) ? 0 : +$$(grab) * 2) :
        //         ($$(isHorizontal) ? 0 : 0))
        // ) - ($$(reverse) ?
        //     ($$(isHorizontal) ? $$(grab) * 2 : -$$(grab) * 2) :
        //     ($$(isHorizontal) ? $$(grab) * 2 : 0))
        // )
        const pos = Math.round(percentage * (isLabel ? $$(sliderDim) : $$(limit)))

        return pos
    }

    const isHorizontal = useMemo(() => $$(orientation) === 'horizontal')

    const getValueFromPosition = (pos: number): number => {
        const percentage = clamp(pos, 0, $$(limit)) / ($$(limit) || 1)
        const baseVal = $$(step) * Math.round((percentage * ($$(max) - $$(min))) / $$(step))
        const result = $$(isHorizontal) ? baseVal + $$(min) : $$(max) - baseVal
        return clamp(result, $$(min), $$(max))
    }

    const position = (e: MouseEvent | TouchEvent) => {
        const coordinateStyle = constants.orientation[$$(orientation)].coordinate
        const directionStyle = $$(reverse)
            ? constants.orientation[$$(orientation)].reverseDirection
            : constants.orientation[$$(orientation)].direction
        const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`
        const coordinate = !("touches" in e)
            ? (e as MouseEvent)[clientCoordinateStyle]
            : (e.touches[0] as Touch)[clientCoordinateStyle]
        const direction = $$(sliderRef)!.getBoundingClientRect()[directionStyle]
        // const pos = $$(reverse)
        //     ? ($$(isHorizontal) ? (direction - coordinate) : ($$(limit) - (direction - coordinate /* - ($$(grab) * 2) */)))
        //     : $$(limit) - (coordinate - direction + ($$(grab)))

        const pos = $$(reverse)
            ? direction - coordinate - $$(grab)
            : coordinate - direction - $$(grab)

        sliderValue(getValueFromPosition(pos))
        return sliderValue
    }

    const coordinates = (pos: number, isLabel = false) => {
        const value = getValueFromPosition(pos)
        const position = getPositionFromValue(value, isLabel)
        // const handlePos = $$(reverse) ?
        //     ($$(isHorizontal) ? ($$(limit) - position + ($$(grab))) : ($$(limit) - position + ($$(grab)))) :
        //     ($$(isHorizontal) ? ($$(limit) - position - $$(grab)) : ($$(limit) - position - $$(grab)))
        // const fillPos = $$(reverse) ?
        //     ($$(isHorizontal) ? handlePos + $$(grab) : $$(limit) - handlePos) :
        //     ($$(isHorizontal) ? $$(limit) - handlePos : handlePos)

        const handlePos = $$(isHorizontal) ? position + $$(grab) : position
        const fillPos = $$(isHorizontal) ? handlePos : $$(limit) - handlePos

        // console.log('coords', pos, value, position, handlePos, fillPos)
        return {
            fill: fillPos,
            handle: handlePos,
            label: handlePos
        }


    }

    const renderLabels = (labels: ObservableReadonly<Record<string, JSX.Child>>) => (
        <ul ref={labelsRef} className={["rangesliderLabels relative select-none",
            () => $$(isHorizontal) ? 'left-[-15px] top-[20px]' : 'left-[15px] top-[8px]'
        ]}
        >
            {$$(labels)}
        </ul >
    )


    const labelItems = useMemo(() => {
        const _l = $$(limit)

        let labelItems = []
        let labelKeys = Object.keys($$(labels)).map(r => +r)

        if (labelKeys.length > 0) {
            labelKeys = labelKeys.sort((a, b) => ($$(reverse) ? a - b : b - a))

            for (let key of labelKeys) {
                const labelPosition = getPositionFromValue(key)
                // const labelPosition2 = getPositionFromValue(key)
                const labelCoords = coordinates(labelPosition, !$$(isHorizontal))
                const labelStyle = {
                    [constants.orientation[$$(orientation)].direction]: `${labelCoords.label}px`
                }

                console.log('labels', $$(limit), labelCoords.label)

                labelItems.push(
                    <li
                        className={[
                            //`

                            // absolute text-sm cursor-pointer inline-block top-2.5 
                            // [transform:translate3d(-50%,0,0)]
                            //   `,
                            `rangesliderLabel-item  absolute`,
                            () => $$(isHorizontal) ? '' : `list-none text-left h-full ml-6 mr-0 my-0 p-0
                            before:content-[''] before:w-[10px] before:h-[1px] before:absolute before:z-[1] before:-left-3.5 before:top-2/4
                            before:[transform:translate3d(0,-50%,0)] before:bg-[black] list-none`
                        ]}
                        data-value={key}
                        onMouseDown={handleDrag}
                        onTouchStart={handleStart}
                        onTouchEnd={handleEnd}
                        style={labelStyle}
                    >
                        {$$(labels)[key]}
                    </li>
                )
            }
        }
        return labelItems
    })


    const showTooltip = useMemo(() => $$(tooltip) && ($$(active) || $$(alwaysOnTooltip)))

    const coords = useMemo(() => {
        const positionVal = getPositionFromValue($$(sliderValue))
        return coordinates($$(positionVal))
    })
    const fillStyle = useMemo(() => {
        const dimension = constants.orientation[$$(orientation)].dimension
        return { [$$(dimension)]: `${$$(coords).fill}px` }
    })
    const handleStyle = useMemo(() => {
        const direction = useMemo(() => $$(reverse)
            ? constants.orientation[$$(orientation)].reverseDirection
            : constants.orientation[$$(orientation)].direction)
        return { [$$(direction)]: `${$$(coords).handle}px` }
    })

    return (
        <div
            ref={sliderRef}
            class={[
                "rangeslider relative bg-[#e6e6e6] touch-none mx-0 my-5",
                () => `rangeslider-${$$(orientation)}`,
                () => $$(reverse) ? "rangeslider-reverse" : "",
                () => $$(isHorizontal) ? 'h-3 rounded-[10px]' :
                    'h-[150px] max-w-[10px] mx-auto my-5',
                props.class ?? props.className,
            ]}
            onMouseDown={handleDrag}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}

            // class={props.class ?? props.className}
            style={props.style}

        >
            <div className={["rangesliderFill block shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] absolute",
                () => $$(isHorizontal) ? 'h-full bg-[#7cb342] rounded-[10px] top-0' + ($$(reverse) ? ' right-0' : '') :
                    ' w-full bg-[#7cb342] shadow-none bottom-0' + ($$(reverse) ? ' top-0' : ''),

            ]} style={fillStyle} />
            <div
                ref={handleRef}
                className={["rangesliderHandle bg-white border cursor-pointer inline-block absolute shadow-[0_1px_3px_rgba(0,0,0,0.4),0_-1px_3px_rgba(0,0,0,0.4)] border-solid border-[#ccc] ",
                    () => $$(isHorizontal) ? 'w-[30px] h-[30px] rounded-[30px] top-2/4 after:content-["_"] after:absolute after:w-4 after:h-4 after:bg-[#dadada] after:shadow-[0_1px_3px_rgba(0,0,0,0.4)_inset,0_-1px_3px_rgba(0,0,0,0.4)_inset] after:rounded-[50%] after:left-1.5 after:top-1.5 [transform:translate3d(-50%,-50%,0)]' :
                        'absolute w-[30px] h-2.5 shadow-none -left-2.5',

                ]}
                onMouseDown={handleStart}
                onTouchMove={handleDrag}
                onTouchEnd={handleEnd}
                onKeyDown={handleKeyDown}
                style={handleStyle}
                tabIndex={0}
            >
                {() => $$(showTooltip) ? (
                    <div ref={tooltipRef} className={["rangesliderHandle-tooltip w-10 h-10 text-center absolute bg-[rgba(0,0,0,0.8)] font-[normal] text-sm transition-all duration-100 ease-[ease-in] rounded inline-block text-[white] after:content-[' _'] after:absolute after:w-0 after:h-0 select-none",
                        () => $$(isHorizontal) ? 'top-[-55px] after:border-t-8 after:border-t-[rgba(0,0,0,0.8)] after:border-x-8 after:border-x-transparent after:border-solid after:left-2/4 left-2/4 after:-bottom-2 after:[transform:translate3d(-50%,0,0)] [transform:translate3d(-50%,0%,0)]' :
                            '-left-full top-2/4 after:border-l-8 after:border-l-[rgba(0,0,0,0.8)] after:border-y-8 after:border-y-transparent after:border-solid after:left-full after:top-3 [transform:translate3d(-50%,-50%,0)]',
                        () => $$(reverse) ? ($$(isHorizontal) ? 'right-0' : 'top-0 bottom-[inherit]') : '',
                    ]}>
                        <span class='inline-block leading-[100%] mt-3'>{() => handleTooltip($$(sliderValue))}</span>
                    </div>
                ) : null}
                <div className="rangesliderHandle-label select-none">{formatLabel}</div>
            </div>
            {() => labels ? renderLabels(labelItems as any) : null}
        </div>
    )
}

