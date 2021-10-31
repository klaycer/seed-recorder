import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Routes from '../Components/Routes';
import ToggleDraggable from '../Components/Utils/ToggleDraggable';

const Header = () => {

    return (
        <header className="text-gray-400 bg-gray-900">
            <nav className="text-gray-400 bg-gray-900">
                <div className="container p-6 mx-auto"> 
                    <ToggleDraggable />
                    <Link className="block text-2xl font-bold text-center text-gray-800 dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300" to="/">Seed Recorder</Link>
                    <div className="flex items-center justify-center mt-6 text-gray-600 capitalize dark:text-gray-300">
                        {Routes.map(r => {
                            return (
                                <Fragment key={r.path}>
                                    {Array.isArray(r.childRoutes) && r.childRoutes.map(cr => {
                                        return (
                                            <NavLink exact={true} activeClassName="border-b-2 border-indigo-400 text-indigo-400 font-bold" className="title-font text-white mx-1.5 sm:mx-6" key={cr.path} to={cr.path}>
                                                {cr.name}
                                            </NavLink>
                                        )
                                    })}
                                </Fragment>
                            )
                        })}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;