/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import ReactToPdf from "react-to-pdf";
import { Rnd } from "react-rnd";

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
};

function App() {
  const ref = useRef();
  const [text, setText] = useState("");
  const [elements, setElements] = useState([]);
  const [startSize, setStartSize] = useState([0, 0]);

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      const copyElements = elements;
      copyElements.push(["img", URL.createObjectURL(img)]);
      setElements(copyElements);
      console.log(elements);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button
          onClick={() => {
            const copyElements = elements;
            copyElements.push(["text", text]);
            setElements(copyElements);
            setText("");
          }}
        >
          Add
        </button>
        <input type="file" name="myImage" onChange={onImageChange} />
        <ReactToPdf targetRef={ref} filename="poster.pdf">
          {({ toPdf }) => <button onClick={toPdf}>Generate pdf</button>}
        </ReactToPdf>
      </div>
      <div style={{ width: 794, height: 1123, background: "blue" }} ref={ref}>
        {elements.map((element) => {
          if (element[0] === "img") {
            return (
              <Rnd
                style={style}
                onResizeStart={(e, dir, elementRef) => {
                  const img = elementRef.getElementsByTagName("img")[0];
                  setStartSize([img.width, img.height]);
                }}
                onResize={(e, dir, elementRef, delta) => {
                  const img = elementRef.getElementsByTagName("img")[0];
                  console.log(img.width, delta.width, startSize[0]);
                  img.style.width = startSize[0] + delta.width + "px";
                  img.style.height = startSize[1] + delta.height + "px";
                }}
              >
                <img
                  src={element[1]}
                  alt="uploadedImage"
                  onLoad={(e) => {
                    e.target.parentElement
                      .getElementsByTagName("img")[0]
                      .setAttribute("width", e.target.width);
                    e.target.parentElement
                      .getElementsByTagName("img")[0]
                      .setAttribute("height", e.target.height);
                  }}
                  // style={{ width: 200, height: 200 }}
                />
              </Rnd>
            );
          } else {
            return (
              <Rnd
                style={style}
                onResizeStart={(e, dir, elementRef) => {
                  const text = elementRef.getElementsByTagName("p")[0];
                  setStartSize([
                    Number(
                      text.style.fontSize.substring(
                        0,
                        text.style.fontSize.length - 2
                      )
                    ),
                    0,
                  ]);
                }}
                onResize={(e, dir, elementRef, delta) => {
                  const text = elementRef.getElementsByTagName("p")[0];
                  text.style.fontSize =
                    startSize[0] + Math.min(delta.width, delta.height) + "px";
                }}
              >
                <p style={{ fontSize: "16px" }}>{element[1]}</p>
              </Rnd>
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;
