import React, { useState } from "react";
import Plotly from "plotly.js-basic-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { connect } from "react-redux";
import { setCategoryGoal } from "../../store/modules/counter";
import { changeCategory } from "../../store/modules/counter";
import { allColors, allDays } from "../variables/categories";
import { convertSecToTime } from "../Functions/convertNumToTime";

import usageData from "../../static/data/usageTime.json";
import emotionAvgData from "../../static/data/emotionAvg.json";
import { emotionAxis } from "./configs";

const Plot = createPlotlyComponent(Plotly);

const mapStateToProps = (state) => ({
  category: state.counter.category,
  Total: state.counter.Total,
  Entertainment: state.counter.Entertainment,
  SNS: state.counter.SNS,
  Communication: state.counter.Communication,
  Productivity: state.counter.Productivity,
});
const mapDispatchToProps = (dispatch) => ({
  setCategoryGoal: (category, num) => dispatch(setCategoryGoal(category, num)),
  changeCategory: (type) => dispatch(changeCategory(type)),
});

const DraggableGraph2 = (props) => {
  const { category, Total, Entertainment,SNS, Communication, Productivity, setCategoryGoal } = props;

  const getGoal = (type) => {
    switch (type) {
      case "Entertainment":
        return Entertainment;
      case "SNS":
        return SNS;
      case "Communication":
        return Communication;
      case "Productivity":
        return Productivity;
      case "Total":
        return Total;
      default:
        return null;
    }
  };

  const [xaxis, setXaxis] = useState({ x0: 0, x1: 1 });
  const [goal, setGoal2] = useState(getGoal(category));

  const emotionTrace = {
    x: allDays,
    y: emotionAvgData.map((d) => d.Emotional_state),
    yaxis: "y2",
    name: "Emotion Rate",
    marker: {
      size: 12,
    },
  };

  const usage = usageData.map(
    (d) => Math.round(convertSecToTime(d[category]) * 100) / 100
  );
  const usageTrace = {
    x: allDays,
    y: usage,
    name: category + " Total Usage",
    mode: "bar",
    type: "bar",
    marker: {
      color: usage.map((value) => {
        return value > getGoal(category) ? allColors[category][1] : allColors[category][0];
      }),
    },
  };

  return (
    <>
      <Plot
        style={{ width: "100%" }}
        data={[emotionTrace, usageTrace]}
        layout={{
          margin: { l: 50, b: 50, r: 50, t: 0 },
          showlegend: true,
          legend: {
            x: 0.4,
            y: -0.2,
          },
          xaxis: {
            fixedrange: true,
          },
          yaxis: {
            title: "Usage Time",
            fixedrange: true,
            showgrid: false,
          },
          yaxis2: emotionAxis("right"),
          shapes: [
            {
              type: "line",

              x0: xaxis.x0,
              x1: xaxis.x1,
              xref: "paper",

              y0: getGoal(category) ? getGoal(category) : 3,
              y1: getGoal(category) ? getGoal(category) : 3,
              yref: "y",

              line: {
                width: 2,
                color: "rgb(30, 30, 30)",
              },
            },
          ],
          paper_bgcolor: "#f9fbff",
          plot_bgcolor: "#f9fbff",
        }}
        config={{
          displayModeBar: false,
          edits: {
            shapePosition: true,
          },
        }}
        onUpdate={(figure) => {
          setXaxis({x0:0, x1:1})
          setCategoryGoal(category, figure.layout.shapes[0].y0);
          //setCategoryGoal(props.category, figure.layout.shapes[0].y0);
        }}
      />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableGraph2);
