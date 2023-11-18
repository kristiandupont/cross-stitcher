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
                    width: 10,
                    height: 10,
                    backgroundColor: cell !== null ? palette[cell] : "white",
                    // Apply special styling for tenth and center lines
                    borderTop: isTenthLine(rowIndex)
                      ? "2px solid black"
                      : "2px solid #E4E4E4",
                    borderLeft: isTenthLine(cellIndex)
                      ? "2px solid black"
                      : "2px solid #E4E4E4",
                    // borderColor:
                    //   rowIndex === centerRow || cellIndex === centerCol
                    //     ? "red"
                    //     : undefined,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Palette Information:</Text>
          {palette.map((color, index) => (
            <Text key={index}>{color}</Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PdfRenderer;
