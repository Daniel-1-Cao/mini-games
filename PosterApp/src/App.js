/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactToPdf from "react-to-pdf";
import { Rnd } from "react-rnd";
import "./App.css";

const fonts = [
  "Are You Serious",
  "Arial",
  "Bangers",
  "Cinzel",
  "Courier",
  "Henny Penny",
  "Josefin Sans",
  "Josefin Slab",
  "Lobster",
  "Major Mono Display",
  "Oswald",
  "Permanent Marker",
  "Rampart One",
  "Roboto Slab",
  "Share Tech Mono",
  "Special Elite",
  "Times New Roman",
  "VT323",
  "Zen Kurenaido",
  "Zen Old Mincho",
];

function App() {
  const ref = useRef();

  const [text, setText] = useState("");
  const [orientation, setOrientation] = useState("portrait");
  const [number, setNumber] = useState(null);
  const [elements, setElements] = useState([]);
  const [startSize, setStartSize] = useState([0, 0]);
  const [currentFont, setCurrentFont] = useState("font17");
  const [enableBorder, setEnableBorder] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [show, setShow] = useState(null);

  useEffect(() => {
    const handleDelete = (event) => {
      console.log(event.keyCode, clicked);

      if (event.keyCode === 8 && clicked !== -1) {
        let copyElements = elements;
        copyElements.splice(clicked, 1);
        setElements(copyElements);
        setClicked(-1);
        setShow("Element deleted!");
        setTimeout(() => setShow(null), 2000);
      }
    };

    window.addEventListener("keydown", handleDelete);

    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked]);

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: enableBorder ? "solid 1px #ddd" : null,
  };

  const clickedStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: enableBorder ? "solid 5px rgb(162, 205, 205,0.4)" : null,
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      const copyElements = elements;
      copyElements.push(["img", URL.createObjectURL(img)]);
      setElements(copyElements);
      setShow("Image added!");
      setTimeout(() => setShow(null), 2000);
    }
  };

  const onNumberChange = (e) => {
    let { value, min, max } = e.target;
    setNumber(value < min ? min : Math.min(value, max));
  };

  const renderElement = (element, i) => {
    if (element[0] === "img") {
      return (
        <Rnd
          className="rounded-3"
          bounds="parent"
          style={clicked === i ? clickedStyle : style}
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
          onClick={() => {
            setClicked(i);
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
          />
        </Rnd>
      );
    } else {
      return (
        <Rnd
          className="rounded-3"
          bounds="parent"
          style={clicked === i ? clickedStyle : style}
          onResizeStart={(e, dir, elementRef) => {
            const text = elementRef.getElementsByTagName("p")[0];
            setStartSize([
              Number(
                text.style.fontSize.substring(0, text.style.fontSize.length - 2)
              ),
              0,
            ]);
          }}
          onResize={(e, dir, elementRef, delta) => {
            const text = elementRef.getElementsByTagName("p")[0];
            text.style.fontSize =
              startSize[0] + Math.min(delta.width, delta.height) + "px";
          }}
          onClick={() => {
            setCurrentFont(element[2]);
            console.log(i);
            setClicked(i);
          }}
        >
          <p
            className={element[2] ? element[2] : "font17"}
            style={{ fontSize: "16px", marginBottom: 0 }}
          >
            {element[1]}
          </p>
        </Rnd>
      );
    }
  };

  return (
    <div
      className="d-flex flex-row font14"
      style={{
        position: "relative",
        overflow: "auto",
        height: "100vh",
        backgroundColor: "#FECD1A",
      }}
    >
      <div className="d-flex flex-column m-3" style={{ width: "33vw" }}>
        <h1 className="font12">Poster maker</h1>
        <hr />
        <div className="d-flex flex-column" name="page-setting">
          <h4 className="font15">Page setting</h4>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                for="inputGroupSelect01"
                style={{ backgroundColor: "#7027A0", color: "#FECD1A" }}
              >
                Orientation
              </label>
            </div>
            <select
              className="form-control"
              id="inputGroupSelect01"
              style={{ backgroundColor: "#C996CC", color: "black" }}
              onChange={(e) => {
                setOrientation(e.target.value);
                const temp = ref.current.style.width;
                ref.current.style.width = ref.current.style.height;
                ref.current.style.height = temp;
              }}
            >
              <option selected value="portrait">
                Portrait
              </option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                for="inputGroupNumber01"
                style={{ backgroundColor: "#7027A0", color: "#FECD1A" }}
              >
                Scale
              </label>
            </div>
            <input
              style={{ backgroundColor: "#C996CC", color: "black" }}
              className="form-control"
              id="inputGroupNumber01"
              type="number"
              value={number}
              min={0.5}
              max={2}
              placeholder="0.5-2"
              onChange={onNumberChange}
            />
          </div>
        </div>
        <hr />
        <div className="d-flex flex-column" name="add-text">
          <h4 className="font15">Add text</h4>
          <div className="input-group mb-3">
            <input
              style={{ backgroundColor: "#C996CC", color: "black" }}
              placeholder="type..."
              className="form-control"
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <button
              className="btn btn-primary"
              style={{ marginLeft: "12px", backgroundColor: "#3D2C8D" }}
              onClick={() => {
                const copyElements = elements;
                console.log(currentFont);
                copyElements.push(["text", text, currentFont]);
                setElements(copyElements);
                setText("");
                setShow("Text added!");
              }}
            >
              Add
            </button>
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                for="inputGroupSelect02"
                style={{ backgroundColor: "#7027A0", color: "#FECD1A" }}
              >
                Font
              </label>
            </div>
            <select
              className="form-control"
              id="inputGroupSelect02"
              style={{ backgroundColor: "#C996CC", color: "black" }}
              value={fonts[Number(currentFont.substring(4)) - 1]}
              onChange={(e) => {
                setCurrentFont("font" + (e.target.selectedIndex + 1));
                if (clicked !== -1) {
                  let copyElements = elements;
                  copyElements[clicked][2] =
                    "font" + (e.target.selectedIndex + 1);
                  setElements(copyElements);
                }
              }}
            >
              {fonts.map((value, i) => {
                return (
                  <option value={value} className={"font" + (i + 1)}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <hr />
        <input
          type="checkbox"
          onChange={() => {
            setEnableBorder(!enableBorder);
          }}
        />

        <input
          className="form-control"
          type="file"
          name="myImage"
          value=""
          onChange={onImageChange}
        />
        <ReactToPdf
          options={{ orientation: orientation }}
          targetRef={ref}
          filename="poster.pdf"
          scale={number === null ? 1 : 1 / number}
        >
          {({ toPdf }) => (
            <button class="btn btn-primary" onClick={toPdf}>
              Generate pdf
            </button>
          )}
        </ReactToPdf>
      </div>

      <div
        className="border border-2 border-secondary m-3"
        style={{
          width: 794 * (number === null ? 1 : number),
          height: 1123 * (number === null ? 1 : number),
          left: "34vw",
          position: "absolute",
          backgroundColor: "white",
        }}
        ref={ref}
        onMouseDown={(e) => {
          if (e.button === 2) {
            setClicked(-1);
          }
        }}
      >
        {elements.map((element, i) => {
          return renderElement(element, i);
        })}
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          minHeight: "300px",
          width: "300px",
        }}
      >
        <div
          className="toast"
          style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            display: show === null ? "none" : "block",
          }}
        >
          <div class="toast-header">
            {/* <img src="..." class="rounded mr-2" alt="...">  */}
            <strong class="mr-auto">Poster Maker</strong>
          </div>
          <div class="toast-body">{show}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
