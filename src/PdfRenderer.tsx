import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

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

// Create Document Component
const PdfRenderer = ({ gridData, palette }) => {
  // Helper functions to check for tenth and center lines
  const isTenthLine = (index) => index % 10 === 0;
  const centerRow = Math.floor(gridData.length / 2);
  const centerCol = Math.floor(gridData[0].length / 2);

  const rowCount = gridData.length;
  const colCount = gridData[0].length;

  const cellWidth = 575 / colCount;
  const cellHeight = 575 / rowCount;

  const cellSize = Math.min(cellWidth, cellHeight);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {gridData.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: "row" }}>
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: cell !== null ? palette[cell] : "white",
                    // Apply special styling for tenth and center lines
                    borderTop:
                      rowIndex === centerRow
                        ? "1px solid red"
                        : isTenthLine(rowIndex)
                          ? "1px solid black"
                          : "1px solid #E4E4E4",
                    borderLeft:
                      cellIndex === centerCol
                        ? "1px olid red"
                        : isTenthLine(cellIndex)
                          ? "1px solid black"
                          : "1px solid #E4E4E4",
                  }}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
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
};

export default PdfRenderer;
