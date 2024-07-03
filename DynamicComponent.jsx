import React, { useState, useEffect, useRef } from "react";

const DynamicComponent = ({
  parentRef,
  initialWidth,
  initialHeight,
  initialTop,
  initialLeft,
  zIndex,
}) => {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
    zIndex: zIndex,
  });

  const [position, setPosition] = useState({
    top: initialTop,
    left: initialLeft,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: initialWidth,
        height: initialHeight,
        zIndex: zIndex,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initialWidth, initialHeight, zIndex]);

  const handleMouseDown = (e) => {
    if (isHovered) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.left,
        y: e.clientY - position.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    console.log(
      initialWidth,
      initialHeight,
      initialTop,
      initialLeft,
      e,
      isDragging
    );
    if (isDragging) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const newLeft = e.clientX - dragOffset.x;
      const newTop = e.clientY - dragOffset.y;

      const withinXBounds =
        newLeft >= parentRect.left &&
        newLeft + dimensions.width <= parentRect.right;
      const withinYBounds =
        newTop <= parentRect.top &&
        newTop + dimensions.height <= parentRect.bottom;
      if (withinXBounds || withinYBounds) {
        setPosition({
          top: newTop,
          left: newLeft,
        });
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isDragging) {
      setIsDragging(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid black",
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        cursor: isHovered ? "move" : "default",
        zIndex: zIndex,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          backgroundColor: "yellow",
          padding: "10px",
          textAlign: "center",
          borderBottom: "1px solid black",
          cursor: "pointer",
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Title
      </div>
      <div style={{ padding: "10px" }}></div>
    </div>
  );
};

const ParentComponent = () => {
  const [components, setComponents] = useState([
    {
      width: window.innerWidth * 0.1,
      height: window.innerHeight * 0.1,
      top: 100,
      left: 100,
      zIndex: 1000,
    },
  ]);
  const parentRef = useRef(null);

  const addParentComponent = () => {
    const lastComponent = components[components.length - 1];
    const newComponent = {
      width: lastComponent.width * 1.5,
      height: lastComponent.height * 1.5,
      top: lastComponent.top - 20,
      left: lastComponent.left - 20,
      zIndex: lastComponent.zIndex - 10,
    };
    setComponents([...components, newComponent]);
  };

  return (
    <div>
      <button
        onClick={addParentComponent}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
        }}
      >
        Add Parent
      </button>
      {components.map((component, index) => (
        <div
          ref={parentRef}
          style={{
            width: components[index + 1]?.width,
            height: components[index + 1]?.height,
          }}
        >
          <DynamicComponent
            key={index}
            parentRef={parentRef}
            initialWidth={component.width}
            initialHeight={component.height}
            initialTop={component.top}
            initialLeft={component.left}
            zIndex={component.zIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default ParentComponent;
