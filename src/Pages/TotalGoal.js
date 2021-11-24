import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DraggableGraph from "../Components/Graphs/DraggableGraph";
import SectionTitle from "../Components/SectionTitle";
import { connect } from "react-redux";
import { convertNumToTime } from "../Components/Functions/convertNumToTime";
import { Range, getTrackBackground } from "react-range";
import { setGoal } from "../store/modules/counter";
import usageData from "../static/data/usageTime.json";
import { convertSecToTime } from "../Components/Functions/convertNumToTime";

import "../static/customStyle.css";
import "./Goal.css";

const mapStateToProps = (state) => ({
  Total: state.counter.Total,
});
const mapDispatchToProps = (dispatch) => ({
  setGoal: (Total) => dispatch(setGoal(Total)),
});

const TotalGoal = (props) => {
  console.log(props)
  const { Total, setGoal } = props;
  console.log("Total", [Total]);
  const history = useHistory();
  const [values, setValues] = useState([2]);
  const min = 0.25;
  const usage = usageData.map(
    (d) => Math.round(convertSecToTime(d["Total"]) * 100) / 100
  );
  const [max, setMax] = useState(Math.max.apply(Math, usage.slice(0, 7)));

  const Direction = {
    Right: "to right",
    Left: "to left",
    Down: "to bottom",
    Up: "to top",
  };

  useEffect(() => {
    console.log("value changed", values);
    setGoal(values[0]);
    console.log("new goal", Total);
  }, [values]);
  const handleRoute = (path) => {
    history.push(path);
  };

  return (
    <div className="container">
      <div className="content">
        <SectionTitle
          title="Goal Type"
          subtitle="Choose a new type of goal you want to create"
        />

        <div className="goalContainer row">
          <div className="goalType col-3" style={{ cursor: "default" }}>
            <h2
              style={{ color: "rgba(53, 152, 219, 1)", marginBottom: "32px" }}
            >
              New Goal
            </h2>
            <h4>
              I will use my phone less than{" "}
              <span className="blank">{convertNumToTime(Total)}</span> a day.
            </h4>
            <button
              className="uplifeButton"
              style={{ marginTop: "auto" }}
              onClick={() => handleRoute("/")}
            >
              Set Goal
            </button>
          </div>
          <div className="col-8">
            <div className="uplifeDiv" style={{ marginBottom: "20px" }}>
              Total phone usage over the past week
            </div>
            <h6 style={{ textAlign: "center", marginBottom: "25px" }}>
              Drag the black bar to set your own goal
            </h6>
            <div style={{ width: "100%" }}>
              <DraggableGraph />
            </div>
          </div>
          <div className="col">
            <Range
              direction={Direction.Up}
              values={[Total]}
              step={0.1}
              min={min}
              max={max}
              onChange={(values) => {
                setGoal(values[0]);
              }}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    margin: "150px 0px",
                    height: "60%",
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: "100%",
                      width: "5px",
                      borderRadius: "0px",
                      background: getTrackBackground({
                        values: [Total],
                        colors: ["#548BF4", "#ccc"],
                        min: min,
                        max: max,
                        direction: Direction.Up,
                      }),
                      alignSelf: "center",
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "40px",
                    width: "40px",
                    borderRadius: "20px",
                    backgroundColor: "#FFF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 6px #AAA",
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalGoal);
