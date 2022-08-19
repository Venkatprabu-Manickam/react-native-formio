import React from 'react';
import PropTypes from 'prop-types';
import RNTooltip from 'react-native-walkthrough-tooltip';
import { Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const Tooltip = (props) => {
  const customStyles = props.styles || {};
  const styles = StyleSheet.create({
    tooltipText: {
      flexWrap: 'wrap',
      color: props.color,
    },
    tooltipIcon: {
      marginLeft: -20,
      marginTop: 13,
      ...customStyles.icon
    },
  });
  return (
    <RNTooltip
      isVisible={true}
      content={<Text style={styles.tooltipText}>{props.text}</Text>}
      placement="top"
      onClose={() => this.setState({ toolTipVisible: false })}>
      <Icon containerStyle={styles.tooltipIcon} size={20} name='question-circle' type='font-awesome' />
    </RNTooltip>
  );
};

Tooltip.propTypes = {
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  text: PropTypes.string,
  styles: PropTypes.any,
};

// <RNTooltip
// popover={<Text style={styles.tooltipText}>{props.text}</Text>}
// backgroundColor={props.backgroundColor}
// height={props.text.length < 20 ? 70 : props.text.length + 20}
// width={props.text.length < 20 ? 100 : props.text.length + 140}
// >
// <Icon containerStyle={styles.tooltipIcon} size={20} name='question-circle' type='font-awesome' />
// </RNTooltip>

export default Tooltip;
