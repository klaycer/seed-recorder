import React from 'react';
import Header from '../Components/Header';

const Layout = ({ children }) => {

    return (
        <section className="text-gray-400 bg-gray-900 body-font w-full h-full">
            <Header />
            <div className="container px-2 py-2 mx-auto h-full overflow">
                { children }
            </div>
        </section>
    )

}

export default Layout;