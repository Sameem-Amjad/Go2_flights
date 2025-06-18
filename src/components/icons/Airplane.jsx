// AirplaneIcon.jsx
import React from 'react';

const AirplaneIcon = React.forwardRef((_, ref) => (
    <div
        ref={ref}
        style={{
            backgroundImage: 'url("/images/airplane.png")',
            width: '32px',
            height: '32px',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transformOrigin: 'center center',
            transition: 'transform 0.1s linear'
        }}
    />
));

export default AirplaneIcon;
