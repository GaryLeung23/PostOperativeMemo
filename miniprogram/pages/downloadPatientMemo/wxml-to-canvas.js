const style = (styles) => {
  return {
    container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: "10",
      color: '#fff',
      backgroundColor: '#fff',
      width: styles.containerWidth,
      height: styles.containerHeight,
    },
    container_row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      height: 40,
      width: styles.containerRowWidth,
    },
    container_col: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      height: 40,
      width: styles.containerColWidth,
    },
    text_2: {
      textAlign: 'center',
      verticalAlign: 'middle',
      color: '#000000',
      fontSize: 14,
      height: 20,
      width: styles.text2Width,
    },
    text_1: {
      textAlign: 'center',
      verticalAlign: 'middle',
      color: '#000000',
      fontSize: 14,
      height: 20,
      width: styles.text1Width,
    },
    text_align_left: {
      textAlign: 'left',
    },
    text_align_center: {
      textAlign: 'center',
    },

    title: {
      fontSize: 20,
      color: '#000000',
      textAlign: 'center',
      verticalAlign: 'middle',
      height: 40,
      width: styles.titleWidth,
    },
    line: {
      backgroundColor: '#DCDCDC',
      verticalAlign: 'middle',
      marginTop: 2,
      marginBottom: 2,
      height: 1,
      width: styles.lineWidth,
    },
    sub_line: {
      backgroundColor: '#CAE1FF',
      verticalAlign: 'middle',
      marginTop: 2,
      marginBottom: 2,
      height: 1,
      width: styles.subLineWidth,
    },
    surgery_height: {
      height: 60,
    },
    mobility_height: {
      height: 40,
    },
    weight_bearing_height: {
      height: 40,
    },
    brace_info_height: {
      height: 40,
    },
    brace_angle_height: {
      height: 40,
    },
    tissue_quality_height: {
      height: 40,
    },
    content_height: {
      height: 80,
      verticalAlign: 'top',
    },
  }
}

module.exports = {
  style
}