import React, { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';
interface ResizableProps {
  direction: 'vertical' | 'horizontal';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableBoxProps: ResizableBoxProps;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(innerWidth * 0.75);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  useEffect(() => {
    let timer: any;
    if (timer) {
      clearTimeout(timer);
    }
    const listener = () => {
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [width]);
  if ('vertical' === direction) {
    resizableBoxProps = {
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 48],
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
    };
  } else {
    resizableBoxProps = {
      className: 'resize-horizontal',
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.25, Infinity],
      height: Infinity,
      width,
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
      resizeHandles: ['e'],
    };
  }
  return <ResizableBox {...resizableBoxProps}>{children}</ResizableBox>;
};

export default Resizable;
