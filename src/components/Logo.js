import React from 'react';

const Logo = (props) => {
    return (
        <div style={{padding: '3px'}}>
            <img
                alt="Logo"
                height={62}
                src={"/images/logo_topbar.png"}
                {...props}
            />
        </div>
    );
};

export default Logo;
