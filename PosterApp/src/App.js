/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactToPdf from "react-to-pdf";
import { Rnd } from "react-rnd";
import { SketchPicker, TwitterPicker } from "react-color";
import "./App.css";
import icon from "./icon.png";

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
  const [ctrlDown, setCtrlDown] = useState(false);
  const [clipboard, setClipboard] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [currentColor, setCurrentColor] = useState("black");
  const [link, setLink] = useState("");

  useEffect(() => {
    const handleCtrlDown = (event) => {
      if (event.keyCode === 17) {
        setCtrlDown(true);
      }
    };

    const handleCtrlUp = (event) => {
      if (event.keyCode === 17) {
        setCtrlDown(false);
      }
    };

    const handleCV = (event) => {
      if (clicked !== -1 && ctrlDown && event.keyCode === 67) {
        setClipboard(elements[clicked]);
        setShow("Copied to clipboard!");
        setTimeout(() => setShow(null), 2000);
      }
      if (event.keyCode === 86 && ctrlDown) {
        const copyElements = elements;
        copyElements.push(clipboard);
        setElements(copyElements);
        setShow("Pasted to clipboard!");
        setTimeout(() => setShow(null), 2000);
      }
    };

    const handleDelete = (event) => {
      if (ctrlDown && event.keyCode === 8 && clicked !== -1) {
        let copyElements = elements;
        copyElements.splice(clicked, 1);
        setElements(copyElements);
        setClicked(-1);
        setShow("Element deleted!");
        setTimeout(() => setShow(null), 2000);
      }
    };

    window.addEventListener("keydown", handleCtrlDown);
    window.addEventListener("keyup", handleCtrlUp);
    window.addEventListener("keydown", handleCV);
    window.addEventListener("keydown", handleDelete);

    return () => {
      window.removeEventListener("keydown", handleCtrlDown);
      window.removeEventListener("keyup", handleCtrlUp);
      window.removeEventListener("keydown", handleCV);
      window.removeEventListener("keydown", handleDelete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clicked, ctrlDown, clipboard]);

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

  const handleChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleChangeComplete = (color) => {
    setCurrentColor(color.hex);
    if (clicked !== -1) {
      let copyElements = [...elements];
      copyElements[clicked][3] = color.hex;
      setElements(copyElements);
    }
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
            setCurrentColor(element[3]);
            setClicked(i);
          }}
        >
          <p
            className={element[2] ? element[2] : "font17"}
            style={{ fontSize: "16px", marginBottom: 0, color: element[3] }}
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
        <h1 className="font12" style={{ fontSize: "60px" }}>
          Poster maker
        </h1>
        <div>
          <hr />
        </div>

        <div className="d-flex flex-column">
          <h4 className="font15">General setting</h4>
          <div className="d-flex flex-row">
            <div
              className="d-flex flex-column"
              name="page-setting"
              style={{ width: "50%", marginRight: "16px" }}
            >
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

              <button
                style={{
                  backgroundColor: "#7027A0",
                  color: "#FECD1A",
                }}
                className="btn"
                onClick={() => {
                  setEnableBorder(!enableBorder);
                }}
              >
                Show/Hide border
              </button>

              <ul
                className="list-group list-group-flush border round-3 border-2 border-dark"
                style={{ marginTop: "16px" }}
              >
                <li
                  className="list-group-item"
                  style={{ backgroundColor: "#FECD1A" }}
                >
                  <label
                    className="input-group-text"
                    style={{
                      backgroundColor: "#7027A0",
                      color: "#FECD1A",
                      justifyContent: "center",
                    }}
                  >
                    Instructions
                  </label>
                </li>
                <li
                  class="list-group-item"
                  style={{ backgroundColor: "#FECD1A" }}
                >
                  Click to select elements
                </li>
                <li
                  class="list-group-item"
                  style={{ backgroundColor: "#FECD1A" }}
                >
                  Ctrl + backspace to delete elements
                </li>
                <li
                  class="list-group-item"
                  style={{ backgroundColor: "#FECD1A" }}
                >
                  Ctrl + C/V to copy and paste
                </li>
              </ul>
            </div>
            <div className="d-flex flex-column">
              <label
                className="input-group-text"
                style={{ backgroundColor: "#7027A0", color: "#FECD1A" }}
              >
                Background color
              </label>
              <SketchPicker color={backgroundColor} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div>
          <hr border="1px" />
        </div>

        <div className="d-flex flex-column" name="add-text">
          <h4 className="font15">Add text</h4>
          <div className="input-group mb-3">
            <input
              style={{
                backgroundColor: "#C996CC",
                color: "black",
                border: "2px solid #3D2C8D",
              }}
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
                copyElements.push(["text", text, currentFont, currentColor]);
                setElements(copyElements);
                setText("");
                setShow("Text added!");
                setTimeout(() => setShow(null), 2000);
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
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label
                className="input-group-text"
                for="inputGroupSelect03"
                style={{ backgroundColor: "#7027A0", color: "#FECD1A" }}
              >
                Text color
              </label>
            </div>
            <TwitterPicker
              className="form-control"
              id="inputGroupSelect03"
              width="80%"
              triangle="hide"
              colors={[
                "#f44336",
                "#e91e63",
                "#9c27b0",
                "#673ab7",
                "#3f51b5",
                "#2196f3",
                "#03a9f4",
                "#00bcd4",
                "#009688",
                "#4caf50",
                "#8bc34a",
                "#cddc39",
                "#ffeb3b",
                "#ffc107",
                "#ff9800",
                "#ff5722",
                "#795548",
                "#607d8b",
                "#000000",
                "#ffffff",
              ]}
              color={currentColor}
              onChangeComplete={handleChangeComplete}
            />
          </div>
        </div>

        <div>
          <hr border="1px" />
        </div>

        <h4 className="font15">Add image</h4>

        <div>
          <input
            className="form-control"
            type="file"
            name="myImage"
            value=""
            style={{
              backgroundColor: "#C996CC",
              color: "black",
            }}
            onChange={onImageChange}
          />
        </div>
        <div>
          <hr border="1px" />
        </div>

        <div className="d-flex flex-column">
          <h4 className="font15">Add QR Code</h4>
          <div className="input-group">
            <input
              style={{
                backgroundColor: "#C996CC",
                color: "black",
                border: "2px solid #3D2C8D",
              }}
              placeholder="Enter link..."
              className="form-control"
              type="text"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
            <button
              className="btn btn-primary"
              style={{ marginLeft: "12px", backgroundColor: "#3D2C8D" }}
              onClick={() => {
                const copyElements = elements;
                copyElements.push([
                  "img",
                  "https://qrtag.net/api/qr_12.svg?url=" + link,
                ]);
                setElements(copyElements);
                setLink("");
                setShow("QR code added!");
                setTimeout(() => setShow(null), 2000);
              }}
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <hr />
        </div>

        <ReactToPdf
          options={{ orientation: orientation }}
          targetRef={ref}
          filename="poster.pdf"
          scale={number === null ? 1 : 1 / number}
        >
          {({ toPdf }) => (
            <button
              class="btn btn-primary"
              style={{ marginTop: "16px", backgroundColor: "#3D2C8D" }}
              onClick={toPdf}
            >
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
          backgroundColor: backgroundColor,
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
            <img
              src={icon}
              class="rounded"
              alt="icon"
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />
            <strong class="mr-auto">Poster Maker</strong>
          </div>
          <div class="toast-body">{show}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
