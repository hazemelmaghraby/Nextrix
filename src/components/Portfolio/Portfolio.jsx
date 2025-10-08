import React from 'react';
import ComingSoon from '../../constants/components/CommingSoon';

const Portfolio = () => {
    React.useEffect(() => {
        document.title = 'Nextrix • Prot';
    }, []);
    return (
        <div>
            <ComingSoon />
        </div>
    )
}

export default Portfolio