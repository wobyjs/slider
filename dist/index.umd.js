(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("woby/jsx-runtime"), require("woby")) : typeof define === "function" && define.amd ? define(["exports", "woby/jsx-runtime", "woby"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["woby-list"] = {}, global["woby/jsx-runtime"], global.woby));
})(this, (function(exports2, jsxRuntime, woby) {
  "use strict";
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
      min = woby.$(0),
      max = woby.$(100),
      step = woby.$(1),
      value = woby.$(0),
      orientation = woby.$("horizontal"),
      tooltip = woby.$(true),
      alwaysOnTooltip = woby.$(false),
      reverse = woby.$(false),
      labels = woby.$({}),
      formatLabel = woby.$(""),
      formatTooltip,
      onChangeStart,
      onChange,
      onChangeComplete
    } = props;
    const active = woby.$(false);
    const limit = woby.$(0);
    const grab = woby.$(0);
    const sliderRef = woby.$();
    const handleRef = woby.$();
    const tooltipRef = woby.$();
    const labelsRef = woby.$();
    const sliderValue = woby.$(woby.$$(value));
    const sliderDim = woby.$(0);
    const handleDim = woby.$(0);
    woby.useEffect(() => {
      sliderValue(woby.$$(value));
    });
    const handleTooltip = (value2) => {
      return formatTooltip ? formatTooltip(value2) : value2;
    };
    const handleUpdate = () => {
      if (!woby.$$(sliderRef) || !woby.$$(handleRef)) {
        return;
      }
      const dimension = capitalize(constants.orientation[woby.$$(orientation)].dimension);
      sliderDim(woby.$$(sliderRef)[`offset${woby.$$(dimension)}`]);
      handleDim(woby.$$(handleRef)[`offset${woby.$$(dimension)}`]);
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
      if (!onChange) return;
      const {
        //@ts-ignore
        target: { className, classList, dataset }
      } = e;
      if (className === "rangesliderLabels") return;
      sliderValue(position(e));
      if ((classList == null ? void 0 : classList.contains("rangesliderLabel-item")) && dataset.value) {
        sliderValue(parseFloat(dataset.value));
      }
      onChange == null ? void 0 : onChange(woby.$$(sliderValue), e);
    };
    woby.useEffect(() => {
      handleUpdate();
      const resizeObserver = new ResizeObserver(handleUpdate);
      if (woby.$$(sliderRef)) {
        resizeObserver.observe(woby.$$(sliderRef));
      }
      return () => {
        resizeObserver.disconnect();
      };
    });
    const handleEnd = (e) => {
      active(false);
      onChangeComplete == null ? void 0 : onChangeComplete(e);
      value(woby.$$(sliderValue));
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleEnd);
    };
    const handleKeyDown = (e) => {
      e.preventDefault();
      const { keyCode } = e;
      switch (keyCode) {
        case 38:
        case 39:
          sliderValue(+woby.$$(value) + +woby.$$(step) > +woby.$$(max) ? +woby.$$(max) : +woby.$$(value) + +woby.$$(step));
          onChange == null ? void 0 : onChange(woby.$$(sliderValue), e);
          break;
        case 37:
        case 40:
          sliderValue(+woby.$$(value) - +woby.$$(step) < +woby.$$(min) ? +woby.$$(min) : +woby.$$(value) - +woby.$$(step));
          onChange == null ? void 0 : onChange(woby.$$(sliderValue), e);
          break;
      }
    };
    const getPositionFromValue = (value2, isLabel = false) => {
      const diffMaxMin = +woby.$$(max) - +woby.$$(min);
      const diffValMin = value2 - +woby.$$(min);
      const percentage = diffValMin / diffMaxMin;
      const pos = Math.round(percentage * (isLabel ? +woby.$$(sliderDim) : +woby.$$(limit)));
      return pos;
    };
    const isHorizontal = woby.useMemo(() => woby.$$(orientation) === "horizontal");
    const getValueFromPosition = (pos) => {
      const percentage = clamp(pos, 0, +woby.$$(limit)) / (+woby.$$(limit) || 1);
      const baseVal = +woby.$$(step) * Math.round(percentage * (+woby.$$(max) - +woby.$$(min)) / +woby.$$(step));
      const result = woby.$$(isHorizontal) ? baseVal + +woby.$$(min) : +woby.$$(max) - baseVal;
      return clamp(result, +woby.$$(min), +woby.$$(max));
    };
    const position = (e) => {
      const coordinateStyle = constants.orientation[woby.$$(orientation)].coordinate;
      const directionStyle = woby.$$(reverse) ? constants.orientation[woby.$$(orientation)].reverseDirection : constants.orientation[woby.$$(orientation)].direction;
      const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
      const coordinate = !("touches" in e) ? e[clientCoordinateStyle] : e.touches[0][clientCoordinateStyle];
      const direction = woby.$$(sliderRef).getBoundingClientRect()[directionStyle];
      const pos = woby.$$(reverse) ? direction - coordinate - +woby.$$(grab) : coordinate - direction - +woby.$$(grab);
      sliderValue(getValueFromPosition(pos));
      return sliderValue;
    };
    const coordinates = (pos, isLabel = false) => {
      const value2 = getValueFromPosition(pos);
      const position2 = getPositionFromValue(value2, isLabel);
      const handlePos = woby.$$(isHorizontal) ? position2 + +woby.$$(grab) : position2;
      const fillPos = woby.$$(isHorizontal) ? handlePos : +woby.$$(limit) - handlePos;
      return {
        fill: fillPos,
        handle: handlePos,
        label: handlePos
      };
    };
    const renderLabels = (labels2) => /* @__PURE__ */ jsxRuntime.jsx(
      "ul",
      {
        ref: labelsRef,
        class: [
          "rangesliderLabels relative select-none",
          () => woby.$$(isHorizontal) ? "left-[-15px] top-[20px]" : "left-[15px] top-[8px]"
        ],
        children: Object.values(woby.$$(labels2))
      }
    );
    const labelItems = woby.useMemo(() => {
      woby.$$(limit);
      let labelItems2 = [];
      let labelKeys = Object.keys(woby.$$(labels)).map((r) => +r);
      if (labelKeys.length > 0) {
        labelKeys = labelKeys.sort((a, b) => woby.$$(reverse) ? a - b : b - a);
        for (let key of labelKeys) {
          const labelPosition = getPositionFromValue(key);
          const labelCoords = coordinates(labelPosition, !woby.$$(isHorizontal));
          const labelStyle = {
            [constants.orientation[woby.$$(orientation)].direction]: `${labelCoords.label}px`
          };
          console.log("labels", woby.$$(limit), labelCoords.label);
          labelItems2.push(
            /* @__PURE__ */ jsxRuntime.jsx(
              "li",
              {
                class: [
                  //`
                  // absolute text-sm cursor-pointer inline-block top-2.5 
                  // [transform:translate3d(-50%,0,0)]
                  //   `,
                  `rangesliderLabel-item  absolute`,
                  () => woby.$$(isHorizontal) ? "" : `list-none text-left h-full ml-6 mr-0 my-0 p-0
                            before:content-[''] before:w-[10px] before:h-[1px] before:absolute before:z-[1] before:-left-3.5 before:top-2/4
                            before:[transform:translate3d(0,-50%,0)] before:bg-[black] list-none`
                ],
                "data-value": key,
                onPointerDown: handleStart,
                onPointerUp: handleEnd,
                style: labelStyle,
                children: woby.$$(labels)[key]
              }
            )
          );
        }
      }
      return labelItems2;
    });
    const showTooltip = woby.useMemo(() => woby.$$(tooltip) && (woby.$$(active) || woby.$$(alwaysOnTooltip)));
    const coords = woby.useMemo(() => {
      const positionVal = getPositionFromValue(woby.$$(sliderValue));
      return coordinates(woby.$$(positionVal));
    });
    const fillStyle = woby.useMemo(() => {
      const dimension = constants.orientation[woby.$$(orientation)].dimension;
      return { [woby.$$(dimension)]: `${woby.$$(coords).fill}px` };
    });
    const handleStyle = woby.useMemo(() => {
      const direction = woby.useMemo(() => woby.$$(reverse) ? constants.orientation[woby.$$(orientation)].reverseDirection : constants.orientation[woby.$$(orientation)].direction);
      return { [woby.$$(direction)]: `${woby.$$(coords).handle}px` };
    });
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: sliderRef,
        class: [
          "rangeslider relative bg-[#e6e6e6] touch-none mx-0 my-5",
          () => `rangeslider-${woby.$$(orientation)}`,
          () => woby.$$(reverse) ? "rangeslider-reverse" : "",
          () => woby.$$(isHorizontal) ? "h-3 rounded-[10px]" : "h-[150px] max-w-[10px] mx-auto my-5",
          props.class ?? props.className
        ],
        onMouseDown: handleDrag,
        onMouseUp: handleEnd,
        onTouchStart: handleStart,
        onTouchEnd: handleEnd,
        style: props.style,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { class: [
            "rangesliderFill block shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] absolute",
            () => woby.$$(isHorizontal) ? "h-full bg-[#7cb342] rounded-[10px] top-0" + (woby.$$(reverse) ? " right-0" : "") : " w-full bg-[#7cb342] shadow-none bottom-0" + (woby.$$(reverse) ? " top-0" : "")
          ], style: fillStyle }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              ref: handleRef,
              class: [
                "rangesliderHandle bg-white border cursor-pointer inline-block absolute shadow-[0_1px_3px_rgba(0,0,0,0.4),0_-1px_3px_rgba(0,0,0,0.4)] border-solid border-[#ccc] ",
                () => woby.$$(isHorizontal) ? 'w-[30px] h-[30px] rounded-[30px] top-2/4 after:content-["_"] after:absolute after:w-4 after:h-4 after:bg-[#dadada] after:shadow-[0_1px_3px_rgba(0,0,0,0.4)_inset,0_-1px_3px_rgba(0,0,0,0.4)_inset] after:rounded-[50%] after:left-1.5 after:top-1.5 [transform:translate3d(-50%,-50%,0)]' : "absolute w-[30px] h-2.5 shadow-none -left-2.5"
              ],
              onMouseDown: handleStart,
              onTouchMove: handleDrag,
              onTouchEnd: handleEnd,
              onKeyDown: handleKeyDown,
              style: handleStyle,
              tabIndex: 0,
              children: [
                () => woby.$$(showTooltip) ? /* @__PURE__ */ jsxRuntime.jsx("div", { ref: tooltipRef, class: [
                  "rangesliderHandle-tooltip w-10 h-10 text-center absolute bg-[rgba(0,0,0,0.8)] font-[normal] text-sm transition-all duration-100 ease-[ease-in] rounded inline-block text-[white] after:content-[' _'] after:absolute after:w-0 after:h-0 select-none",
                  () => woby.$$(isHorizontal) ? "top-[-55px] after:border-t-8 after:border-t-[rgba(0,0,0,0.8)] after:border-x-8 after:border-x-transparent after:border-solid after:left-2/4 left-2/4 after:-bottom-2 after:[transform:translate3d(-50%,0,0)] [transform:translate3d(-50%,0%,0)]" : "-left-full top-2/4 after:border-l-8 after:border-l-[rgba(0,0,0,0.8)] after:border-y-8 after:border-y-transparent after:border-solid after:left-full after:top-3 [transform:translate3d(-50%,-50%,0)]",
                  () => woby.$$(reverse) ? woby.$$(isHorizontal) ? "right-0" : "top-0 bottom-[inherit]" : ""
                ], children: /* @__PURE__ */ jsxRuntime.jsx("span", { class: "inline-block leading-[100%] mt-3", children: () => handleTooltip(woby.$$(sliderValue)) }) }) : null,
                /* @__PURE__ */ jsxRuntime.jsx("div", { class: "rangesliderHandle-label select-none", children: formatLabel })
              ]
            }
          ),
          () => labels ? renderLabels(labelItems) : null
        ]
      }
    );
  };
  exports2.Slider = Slider;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
}));
//# sourceMappingURL=index.umd.js.map
