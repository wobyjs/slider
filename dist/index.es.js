import { jsx, jsxs } from "voby/jsx-runtime";
import { $, $$, useEffect, useMemo } from "voby";
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
const constants = {
  orientation: {
    horizontal: {
      dimension: "width",
      direction: "left",
      reverseDirection: "right",
      coordinate: "x"
    },
    vertical: {
      dimension: "height",
      direction: "top",
      reverseDirection: "bottom",
      coordinate: "y"
    }
  }
};
const Slider = (props) => {
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
    onChangeComplete
  } = props;
  const active = $(false);
  const limit = $(0);
  const grab = $(0);
  const sliderRef = $();
  const handleRef = $();
  const tooltipRef = $();
  const labelsRef = $();
  const sliderValue = $($$(value));
  const sliderDim = $(0);
  const handleDim = $(0);
  useEffect(() => {
    sliderValue($$(value));
  });
  const handleTooltip = (value2) => {
    return formatTooltip ? formatTooltip(value2) : value2;
  };
  const handleUpdate = () => {
    if (!$$(sliderRef) || !$$(handleRef)) {
      return;
    }
    const dimension = capitalize(constants.orientation[$$(orientation)].dimension);
    sliderDim($$(sliderRef)[`offset${$$(dimension)}`]);
    handleDim($$(handleRef)[`offset${$$(dimension)}`]);
    limit(sliderDim() - handleDim());
    grab(handleDim() / 2);
  };
  const handleStart = (e) => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleEnd);
    active(true);
    onChangeStart == null ? void 0 : onChangeStart(e);
  };
  const handleDrag = (e) => {
    e.stopPropagation();
    if (!onChange)
      return;
    const {
      //@ts-ignore
      target: { className, classList, dataset }
    } = e;
    if (className === "rangesliderLabels")
      return;
    sliderValue(position(e));
    if ((classList == null ? void 0 : classList.contains("rangesliderLabel-item")) && dataset.value) {
      sliderValue(parseFloat(dataset.value));
    }
    onChange == null ? void 0 : onChange($$(sliderValue), e);
  };
  useEffect(() => {
    handleUpdate();
    const resizeObserver = new ResizeObserver(handleUpdate);
    if ($$(sliderRef)) {
      resizeObserver.observe($$(sliderRef));
    }
    return () => {
      resizeObserver.disconnect();
    };
  });
  const handleEnd = (e) => {
    active(false);
    onChangeComplete == null ? void 0 : onChangeComplete(e);
    value($$(sliderValue));
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleEnd);
  };
  const handleKeyDown = (e) => {
    e.preventDefault();
    const { keyCode } = e;
    switch (keyCode) {
      case 38:
      case 39:
        sliderValue($$(value) + $$(step) > $$(max) ? $$(max) : $$(value) + $$(step));
        onChange == null ? void 0 : onChange($$(sliderValue), e);
        break;
      case 37:
      case 40:
        sliderValue($$(value) - $$(step) < $$(min) ? $$(min) : $$(value) - $$(step));
        onChange == null ? void 0 : onChange($$(sliderValue), e);
        break;
    }
  };
  const getPositionFromValue = (value2, isLabel = false) => {
    const diffMaxMin = $$(max) - $$(min);
    const diffValMin = value2 - $$(min);
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * (isLabel ? $$(sliderDim) : $$(limit)));
    return pos;
  };
  const isHorizontal = useMemo(() => $$(orientation) === "horizontal");
  const getValueFromPosition = (pos) => {
    const percentage = clamp(pos, 0, $$(limit)) / ($$(limit) || 1);
    const baseVal = $$(step) * Math.round(percentage * ($$(max) - $$(min)) / $$(step));
    const result = $$(isHorizontal) ? baseVal + $$(min) : $$(max) - baseVal;
    return clamp(result, $$(min), $$(max));
  };
  const position = (e) => {
    const coordinateStyle = constants.orientation[$$(orientation)].coordinate;
    const directionStyle = $$(reverse) ? constants.orientation[$$(orientation)].reverseDirection : constants.orientation[$$(orientation)].direction;
    const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
    const coordinate = !("touches" in e) ? e[clientCoordinateStyle] : e.touches[0][clientCoordinateStyle];
    const direction = $$(sliderRef).getBoundingClientRect()[directionStyle];
    const pos = $$(reverse) ? direction - coordinate - $$(grab) : coordinate - direction - $$(grab);
    sliderValue(getValueFromPosition(pos));
    return sliderValue;
  };
  const coordinates = (pos, isLabel = false) => {
    const value2 = getValueFromPosition(pos);
    const position2 = getPositionFromValue(value2, isLabel);
    const handlePos = $$(isHorizontal) ? position2 + $$(grab) : position2;
    const fillPos = $$(isHorizontal) ? handlePos : $$(limit) - handlePos;
    return {
      fill: fillPos,
      handle: handlePos,
      label: handlePos
    };
  };
  const renderLabels = (labels2) => /* @__PURE__ */ jsx(
    "ul",
    {
      ref: labelsRef,
      className: [
        "rangesliderLabels relative select-none",
        () => $$(isHorizontal) ? "left-[-15px] top-[20px]" : "left-[15px] top-[8px]"
      ],
      children: $$(labels2)
    }
  );
  const labelItems = useMemo(() => {
    $$(limit);
    let labelItems2 = [];
    let labelKeys = Object.keys($$(labels)).map((r) => +r);
    if (labelKeys.length > 0) {
      labelKeys = labelKeys.sort((a, b) => $$(reverse) ? a - b : b - a);
      for (let key of labelKeys) {
        const labelPosition = getPositionFromValue(key);
        const labelCoords = coordinates(labelPosition, !$$(isHorizontal));
        const labelStyle = {
          [constants.orientation[$$(orientation)].direction]: `${labelCoords.label}px`
        };
        console.log("labels", $$(limit), labelCoords.label);
        labelItems2.push(
          /* @__PURE__ */ jsx(
            "li",
            {
              className: [
                //`
                // absolute text-sm cursor-pointer inline-block top-2.5 
                // [transform:translate3d(-50%,0,0)]
                //   `,
                `rangesliderLabel-item  absolute`,
                () => $$(isHorizontal) ? "" : `list-none text-left h-full ml-6 mr-0 my-0 p-0
                            before:content-[''] before:w-[10px] before:h-[1px] before:absolute before:z-[1] before:-left-3.5 before:top-2/4
                            before:[transform:translate3d(0,-50%,0)] before:bg-[black] list-none`
              ],
              "data-value": key,
              onMouseDown: handleDrag,
              onTouchStart: handleStart,
              onTouchEnd: handleEnd,
              style: labelStyle,
              children: $$(labels)[key]
            }
          )
        );
      }
    }
    return labelItems2;
  });
  const showTooltip = useMemo(() => $$(tooltip) && ($$(active) || $$(alwaysOnTooltip)));
  const coords = useMemo(() => {
    const positionVal = getPositionFromValue($$(sliderValue));
    return coordinates($$(positionVal));
  });
  const fillStyle = useMemo(() => {
    const dimension = constants.orientation[$$(orientation)].dimension;
    return { [$$(dimension)]: `${$$(coords).fill}px` };
  });
  const handleStyle = useMemo(() => {
    const direction = useMemo(() => $$(reverse) ? constants.orientation[$$(orientation)].reverseDirection : constants.orientation[$$(orientation)].direction);
    return { [$$(direction)]: `${$$(coords).handle}px` };
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: sliderRef,
      class: [
        "rangeslider relative bg-[#e6e6e6] touch-none mx-0 my-5",
        () => `rangeslider-${$$(orientation)}`,
        () => $$(reverse) ? "rangeslider-reverse" : "",
        () => $$(isHorizontal) ? "h-3 rounded-[10px]" : "h-[150px] max-w-[10px] mx-auto my-5",
        props.class ?? props.className
      ],
      onMouseDown: handleDrag,
      onMouseUp: handleEnd,
      onTouchStart: handleStart,
      onTouchEnd: handleEnd,
      style: props.style,
      children: [
        /* @__PURE__ */ jsx("div", { className: [
          "rangesliderFill block shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] absolute",
          () => $$(isHorizontal) ? "h-full bg-[#7cb342] rounded-[10px] top-0" + ($$(reverse) ? " right-0" : "") : " w-full bg-[#7cb342] shadow-none bottom-0" + ($$(reverse) ? " top-0" : "")
        ], style: fillStyle }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: handleRef,
            className: [
              "rangesliderHandle bg-white border cursor-pointer inline-block absolute shadow-[0_1px_3px_rgba(0,0,0,0.4),0_-1px_3px_rgba(0,0,0,0.4)] border-solid border-[#ccc] ",
              () => $$(isHorizontal) ? 'w-[30px] h-[30px] rounded-[30px] top-2/4 after:content-["_"] after:absolute after:w-4 after:h-4 after:bg-[#dadada] after:shadow-[0_1px_3px_rgba(0,0,0,0.4)_inset,0_-1px_3px_rgba(0,0,0,0.4)_inset] after:rounded-[50%] after:left-1.5 after:top-1.5 [transform:translate3d(-50%,-50%,0)]' : "absolute w-[30px] h-2.5 shadow-none -left-2.5"
            ],
            onMouseDown: handleStart,
            onTouchMove: handleDrag,
            onTouchEnd: handleEnd,
            onKeyDown: handleKeyDown,
            style: handleStyle,
            tabIndex: 0,
            children: [
              () => $$(showTooltip) ? /* @__PURE__ */ jsx("div", { ref: tooltipRef, className: [
                "rangesliderHandle-tooltip w-10 h-10 text-center absolute bg-[rgba(0,0,0,0.8)] font-[normal] text-sm transition-all duration-100 ease-[ease-in] rounded inline-block text-[white] after:content-[' _'] after:absolute after:w-0 after:h-0 select-none",
                () => $$(isHorizontal) ? "top-[-55px] after:border-t-8 after:border-t-[rgba(0,0,0,0.8)] after:border-x-8 after:border-x-transparent after:border-solid after:left-2/4 left-2/4 after:-bottom-2 after:[transform:translate3d(-50%,0,0)] [transform:translate3d(-50%,0%,0)]" : "-left-full top-2/4 after:border-l-8 after:border-l-[rgba(0,0,0,0.8)] after:border-y-8 after:border-y-transparent after:border-solid after:left-full after:top-3 [transform:translate3d(-50%,-50%,0)]",
                () => $$(reverse) ? $$(isHorizontal) ? "right-0" : "top-0 bottom-[inherit]" : ""
              ], children: /* @__PURE__ */ jsx("span", { class: "inline-block leading-[100%] mt-3", children: () => handleTooltip($$(sliderValue)) }) }) : null,
              /* @__PURE__ */ jsx("div", { className: "rangesliderHandle-label select-none", children: formatLabel })
            ]
          }
        ),
        () => labels ? renderLabels(labelItems) : null
      ]
    }
  );
};
export {
  Slider
};
//# sourceMappingURL=index.es.js.map
