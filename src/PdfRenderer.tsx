import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { FC } from "react";

import type { GridData } from "./App";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const isTenth = (index: number): boolean => index % 10 === 0;

const Grid: FC<{ gridData: GridData; palette: string[] }> = ({
  gridData,
  palette,
}) => {
  const centerRow = Math.floor(gridData.length / 2);
  const centerCol = Math.floor(gridData[0].length / 2);
  const rowCount = gridData.length;
  const colCount = gridData[0].length;

  const cellWidth = 575 / colCount;
  const cellHeight = 575 / rowCount;
  const cellSize = Math.min(cellWidth, cellHeight);

  return (
    <View style={styles.section}>
      {gridData.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell === null ? "white" : palette[cell],
                // Apply special styling for tenth and center lines
                borderTop:
                  rowIndex === centerRow
                    ? "1px solid red"
                    : isTenth(rowIndex)
                      ? "1px solid black"
                      : "1px solid #E4E4E4",
                borderLeft:
                  cellIndex === centerCol
                    ? "1px solid red"
                    : isTenth(cellIndex)
                      ? "1px solid black"
                      : "1px solid #E4E4E4",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const PdfRenderer: FC<{ gridData: GridData; palette: string[] }> = ({
  gridData,
  palette,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Grid gridData={gridData} palette={palette} />
        <Text>Colors:</Text>
        {palette.map((color, index) => (
          <View
            key={index}
            style={{
              backgroundColor: color,
              height: 20,
              width: 80,
              marginTop: 5,
            }}
          />
        ))}
      </View>
    </Page>
  </Document>
);

export default PdfRenderer;
