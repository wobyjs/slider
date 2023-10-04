(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("voby/jsx-runtime"), require("voby")) : typeof define === "function" && define.amd ? define(["exports", "voby/jsx-runtime", "voby"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["voby-list"] = {}, global["voby/jsx-runtime"], global.voby));
})(this, function(exports2, jsxRuntime, voby) {
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
      min = voby.$(0),
      max = voby.$(100),
      step = voby.$(1),
      value = voby.$(0),
      orientation = voby.$("horizontal"),
      tooltip = voby.$(true),
      alwaysOnTooltip = voby.$(false),
      reverse = voby.$(false),
      labels = voby.$({}),
      formatLabel = voby.$(""),
      formatTooltip,
      onChangeStart,
      onChange,
      onChangeComplete
    } = props;
    const active = voby.$(false);
    const limit = voby.$(0);
    const grab = voby.$(0);
    const sliderRef = voby.$();
    const handleRef = voby.$();
    const tooltipRef = voby.$();
    const labelsRef = voby.$();
    const sliderValue = voby.$(voby.$$(value));
    const sliderDim = voby.$(0);
    const handleDim = voby.$(0);
    voby.useEffect(() => {
      sliderValue(voby.$$(value));
    });
    const handleTooltip = (value2) => {
      return formatTooltip ? formatTooltip(value2) : value2;
    };
    const handleUpdate = () => {
      if (!voby.$$(sliderRef) || !voby.$$(handleRef)) {
        return;
      }
      const dimension = capitalize(constants.orientation[voby.$$(orientation)].dimension);
      sliderDim(voby.$$(sliderRef)[`offset${voby.$$(dimension)}`]);
      handleDim(voby.$$(handleRef)[`offset${voby.$$(dimension)}`]);
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
      onChange == null ? void 0 : onChange(voby.$$(sliderValue), e);
    };
    voby.useEffect(() => {
      handleUpdate();
      const resizeObserver = new ResizeObserver(handleUpdate);
      if (voby.$$(sliderRef)) {
        resizeObserver.observe(voby.$$(sliderRef));
      }
      return () => {
        resizeObserver.disconnect();
      };
    });
    const handleEnd = (e) => {
      active(false);
      onChangeComplete == null ? void 0 : onChangeComplete(e);
      value(voby.$$(sliderValue));
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleEnd);
    };
    const handleKeyDown = (e) => {
      e.preventDefault();
      const { keyCode } = e;
      switch (keyCode) {
        case 38:
        case 39:
          sliderValue(voby.$$(value) + voby.$$(step) > voby.$$(max) ? voby.$$(max) : voby.$$(value) + voby.$$(step));
          onChange == null ? void 0 : onChange(voby.$$(sliderValue), e);
          break;
        case 37:
        case 40:
          sliderValue(voby.$$(value) - voby.$$(step) < voby.$$(min) ? voby.$$(min) : voby.$$(value) - voby.$$(step));
          onChange == null ? void 0 : onChange(voby.$$(sliderValue), e);
          break;
      }
    };
    const getPositionFromValue = (value2, isLabel = false) => {
      const diffMaxMin = voby.$$(max) - voby.$$(min);
      const diffValMin = value2 - voby.$$(min);
      const percentage = diffValMin / diffMaxMin;
      const pos = Math.round(percentage * (isLabel ? voby.$$(sliderDim) : voby.$$(limit)));
      return pos;
    };
    const isHorizontal = voby.useMemo(() => voby.$$(orientation) === "horizontal");
    const getValueFromPosition = (pos) => {
      const percentage = clamp(pos, 0, voby.$$(limit)) / (voby.$$(limit) || 1);
      const baseVal = voby.$$(step) * Math.round(percentage * (voby.$$(max) - voby.$$(min)) / voby.$$(step));
      const result = voby.$$(isHorizontal) ? baseVal + voby.$$(min) : voby.$$(max) - baseVal;
      return clamp(result, voby.$$(min), voby.$$(max));
    };
    const position = (e) => {
      const coordinateStyle = constants.orientation[voby.$$(orientation)].coordinate;
      const directionStyle = voby.$$(reverse) ? constants.orientation[voby.$$(orientation)].reverseDirection : constants.orientation[voby.$$(orientation)].direction;
      const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
      const coordinate = !("touches" in e) ? e[clientCoordinateStyle] : e.touches[0][clientCoordinateStyle];
      const direction = voby.$$(sliderRef).getBoundingClientRect()[directionStyle];
      const pos = voby.$$(reverse) ? direction - coordinate - voby.$$(grab) : coordinate - direction - voby.$$(grab);
      sliderValue(getValueFromPosition(pos));
      return sliderValue;
    };
    const coordinates = (pos, isLabel = false) => {
      const value2 = getValueFromPosition(pos);
      const position2 = getPositionFromValue(value2, isLabel);
      const handlePos = voby.$$(isHorizontal) ? position2 + voby.$$(grab) : position2;
      const fillPos = voby.$$(isHorizontal) ? handlePos : voby.$$(limit) - handlePos;
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
        className: [
          "rangesliderLabels relative select-none",
          () => voby.$$(isHorizontal) ? "left-[-15px] top-[20px]" : "left-[15px] top-[8px]"
        ],
        children: voby.$$(labels2)
      }
    );
    const labelItems = voby.useMemo(() => {
      voby.$$(limit);
      let labelItems2 = [];
      let labelKeys = Object.keys(voby.$$(labels)).map((r) => +r);
      if (labelKeys.length > 0) {
        labelKeys = labelKeys.sort((a, b) => voby.$$(reverse) ? a - b : b - a);
        for (let key of labelKeys) {
          const labelPosition = getPositionFromValue(key);
          const labelCoords = coordinates(labelPosition, !voby.$$(isHorizontal));
          const labelStyle = {
            [constants.orientation[voby.$$(orientation)].direction]: `${labelCoords.label}px`
          };
          console.log("labels", voby.$$(limit), labelCoords.label);
          labelItems2.push(
            /* @__PURE__ */ jsxRuntime.jsx(
              "li",
              {
                className: [
                  //`
                  // absolute text-sm cursor-pointer inline-block top-2.5 
                  // [transform:translate3d(-50%,0,0)]
                  //   `,
                  `rangesliderLabel-item  absolute`,
                  () => voby.$$(isHorizontal) ? "" : `list-none text-left h-full ml-6 mr-0 my-0 p-0
                            before:content-[''] before:w-[10px] before:h-[1px] before:absolute before:z-[1] before:-left-3.5 before:top-2/4
                            before:[transform:translate3d(0,-50%,0)] before:bg-[black] list-none`
                ],
                "data-value": key,
                onMouseDown: handleDrag,
                onTouchStart: handleStart,
                onTouchEnd: handleEnd,
                style: labelStyle,
                children: voby.$$(labels)[key]
              }
            )
          );
        }
      }
      return labelItems2;
    });
    const showTooltip = voby.useMemo(() => voby.$$(tooltip) && (voby.$$(active) || voby.$$(alwaysOnTooltip)));
    const coords = voby.useMemo(() => {
      const positionVal = getPositionFromValue(voby.$$(sliderValue));
      return coordinates(voby.$$(positionVal));
    });
    const fillStyle = voby.useMemo(() => {
      const dimension = constants.orientation[voby.$$(orientation)].dimension;
      return { [voby.$$(dimension)]: `${voby.$$(coords).fill}px` };
    });
    const handleStyle = voby.useMemo(() => {
      const direction = voby.useMemo(() => voby.$$(reverse) ? constants.orientation[voby.$$(orientation)].reverseDirection : constants.orientation[voby.$$(orientation)].direction);
      return { [voby.$$(direction)]: `${voby.$$(coords).handle}px` };
    });
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ref: sliderRef,
        class: [
          "rangeslider relative bg-[#e6e6e6] touch-none mx-0 my-5",
          () => `rangeslider-${voby.$$(orientation)}`,
          () => voby.$$(reverse) ? "rangeslider-reverse" : "",
          () => voby.$$(isHorizontal) ? "h-3 rounded-[10px]" : "h-[150px] max-w-[10px] mx-auto my-5",
          props.class ?? props.className
        ],
        onMouseDown: handleDrag,
        onMouseUp: handleEnd,
        onTouchStart: handleStart,
        onTouchEnd: handleEnd,
        style: props.style,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: [
            "rangesliderFill block shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)] absolute",
            () => voby.$$(isHorizontal) ? "h-full bg-[#7cb342] rounded-[10px] top-0" + (voby.$$(reverse) ? " right-0" : "") : " w-full bg-[#7cb342] shadow-none bottom-0" + (voby.$$(reverse) ? " top-0" : "")
          ], style: fillStyle }),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              ref: handleRef,
              className: [
                "rangesliderHandle bg-white border cursor-pointer inline-block absolute shadow-[0_1px_3px_rgba(0,0,0,0.4),0_-1px_3px_rgba(0,0,0,0.4)] border-solid border-[#ccc] ",
                () => voby.$$(isHorizontal) ? 'w-[30px] h-[30px] rounded-[30px] top-2/4 after:content-["_"] after:absolute after:w-4 after:h-4 after:bg-[#dadada] after:shadow-[0_1px_3px_rgba(0,0,0,0.4)_inset,0_-1px_3px_rgba(0,0,0,0.4)_inset] after:rounded-[50%] after:left-1.5 after:top-1.5 [transform:translate3d(-50%,-50%,0)]' : "absolute w-[30px] h-2.5 shadow-none -left-2.5"
              ],
              onMouseDown: handleStart,
              onTouchMove: handleDrag,
              onTouchEnd: handleEnd,
              onKeyDown: handleKeyDown,
              style: handleStyle,
              tabIndex: 0,
              children: [
                () => voby.$$(showTooltip) ? /* @__PURE__ */ jsxRuntime.jsx("div", { ref: tooltipRef, className: [
                  "rangesliderHandle-tooltip w-10 h-10 text-center absolute bg-[rgba(0,0,0,0.8)] font-[normal] text-sm transition-all duration-100 ease-[ease-in] rounded inline-block text-[white] after:content-[' _'] after:absolute after:w-0 after:h-0 select-none",
                  () => voby.$$(isHorizontal) ? "top-[-55px] after:border-t-8 after:border-t-[rgba(0,0,0,0.8)] after:border-x-8 after:border-x-transparent after:border-solid after:left-2/4 left-2/4 after:-bottom-2 after:[transform:translate3d(-50%,0,0)] [transform:translate3d(-50%,0%,0)]" : "-left-full top-2/4 after:border-l-8 after:border-l-[rgba(0,0,0,0.8)] after:border-y-8 after:border-y-transparent after:border-solid after:left-full after:top-3 [transform:translate3d(-50%,-50%,0)]",
                  () => voby.$$(reverse) ? voby.$$(isHorizontal) ? "right-0" : "top-0 bottom-[inherit]" : ""
                ], children: /* @__PURE__ */ jsxRuntime.jsx("span", { class: "inline-block leading-[100%] mt-3", children: () => handleTooltip(voby.$$(sliderValue)) }) }) : null,
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "rangesliderHandle-label select-none", children: formatLabel })
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
});
//# sourceMappingURL=index.umd.js.map
