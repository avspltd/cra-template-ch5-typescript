import React, { useState } from 'react';
import { usePublishDigital, useSubscribeDigital } from 'react-ch5';
import classnames from 'classnames';
import { ClassValue } from 'classnames/types';
import styles from './PushButton.module.scss';

// TODO this functionality will be getting integrated into react-ch5 as a HOC

type PushButtonProps = {
  publishSignalName: string,
  subscribeSignalName: string,
  style?: ClassValue;
  styleOn?: ClassValue;
  styleOff?: ClassValue;
}

const PushButton: React.FunctionComponent<PushButtonProps> = (props) => {
  const press = usePublishDigital(props.publishSignalName);
  const [pressState, setPressState] = useState(false);
  const feedback = useSubscribeDigital(props.subscribeSignalName);

  const onPress = () => {
    if (!pressState) {
      console.log('press');
      press(true);
      setPressState(true);
    }
  }

  const onRelease = () => {
    if (pressState) {
      console.log('release')
      press(false)
      setPressState(false);
    }
  }

  // apply default styles from PushButton.module.scss or use overridden styles in props
  const className = classnames(props.style || styles.default, feedback ? props.styleOn || styles.on : props.styleOff || styles.off );

  return <div className={className} onTouchStart={onPress} onTouchEnd={onRelease} onTouchCancel={onRelease}><div style={{ margin: 'auto' }}>{props.children}</div></div>
}

export default PushButton;
